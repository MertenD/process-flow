import {Edge, Node, ReactFlowInstance} from "reactflow";
import {SupabaseClient} from "@supabase/supabase-js";
import {NodeTypes} from "@/model/NodeTypes";
import {GamificationType} from "@/model/GamificationType";

// TODO Save viewport as well

// TODO Track and cache changed nodes and edges ans only update those

// TODO Remove InfoNode and make it an activity type of the activity node

// TODO Delete gamification options when node is deleted (maybe via cascading in the database)

export async function saveProcessModelToDatabase(nodes: Node[], edges: Edge[], processModelId: string, supabase: SupabaseClient<any, "public", any>, reactFlowInstance: ReactFlowInstance) {

    const existingNodes: string[] = []
    const oldNewIdMapping = new Map<string, string>()

    // Save base flow elements to database
    await Promise.all(nodes.map(async (node) => {

        const id = node.id.toString().includes("-") ? undefined : node.id

        const insertedElement = await supabase.from("flow_element").upsert({
            id: id,
            model_id: processModelId,
            type: node.type,
            position_x: node.position.x,
            position_y: node.position.y,
            width: node.width,
            height: node.height,
            parent_flow_element_id: node.parentId || null,
            z_index: node.zIndex
        }, {onConflict: "id"}).select()

        const assignedId = insertedElement.data?.[0].id

        oldNewIdMapping.set(node.id, assignedId)

        existingNodes.push(assignedId)
    }))

    // Save specific flow elements to database with data
    await Promise.all(nodes.map(async (node) => {

        const nodeType = node.type as NodeTypes
        if (nodeType === NodeTypes.CHALLENGE_NODE) {
            const { data } = node
            const gamificationOptionsId = await saveGamificationOptions(node, oldNewIdMapping, supabase)

            await supabase.from("challenge_element").upsert({
                flow_element_id: oldNewIdMapping.get(node.id),
                background_color: data.backgroundColor,
                challenge_type: data.challengeType,
                seconds_to_complete: data.secondsToComplete,
                reward_type: data.rewardType,
                gamification_option_id: gamificationOptionsId
            }, {onConflict: "flow_element_id"})
        } else if (nodeType === NodeTypes.ACTIVITY_NODE) {
            const outgoingEdge = edges.find(edge => edge.source === node.id)
            let targetNodeId = null
            if (outgoingEdge) {
                targetNodeId = oldNewIdMapping.get(outgoingEdge.target)
            }

            const gamificationOptionsId = await saveGamificationOptions(node, oldNewIdMapping, supabase)

            await supabase.from("activity_element").upsert({
                flow_element_id: oldNewIdMapping.get(node.id),
                task: node.data.task,
                description: node.data.description,
                activity_type: node.data.activityType,
                choices: node.data.choices,
                input_regex: node.data.inputRegex,
                variable_name: node.data.variableName,
                next_flow_element_id: targetNodeId,
                gamification_type: node.data.gamificationType,
                gamification_option_id: gamificationOptionsId
            }, {onConflict: "flow_element_id"})
        } else if (nodeType === NodeTypes.GATEWAY_NODE) {
            const outgoingEdges = edges.filter(edge => edge.source === node.id)

            const falseOutgoingEdge = outgoingEdges.find(edge => edge.sourceHandle === "False")
            let falseTargetNodeId = null
            if (falseOutgoingEdge) {
                falseTargetNodeId = oldNewIdMapping.get(falseOutgoingEdge.target)
            }

            const trueOutgoingEdge = outgoingEdges.find(edge => edge.sourceHandle === "True")
            let trueTargetNodeId = null
            if (trueOutgoingEdge) {
                trueTargetNodeId = oldNewIdMapping.get(trueOutgoingEdge.target)
            }

            await supabase.from("gateway_element").upsert({
                flow_element_id: oldNewIdMapping.get(node.id),
                comparison: node.data.comparison,
                value1: node.data.value1,
                value2: node.data.value2,
                next_flow_element_false_id: falseTargetNodeId,
                next_flow_element_true_id: trueTargetNodeId
            }, {onConflict: "flow_element_id"})
        } else if (nodeType === NodeTypes.START_NODE) {
            const outgoingEdge = edges.find(edge => edge.source === node.id)
            let targetNodeId = null
            if (outgoingEdge) {
                targetNodeId = oldNewIdMapping.get(outgoingEdge.target)
            }

            await supabase.from("start_element").upsert({
                flow_element_id: oldNewIdMapping.get(node.id),
                next_flow_element_id: targetNodeId
            }, {onConflict: "flow_element_id"})
        } else if (nodeType === NodeTypes.END_NODE) {
            await supabase.from("end_element").upsert({
                flow_element_id: oldNewIdMapping.get(node.id)
            }, {onConflict: "flow_element_id"})
        } else if (nodeType === NodeTypes.INFO_NODE) {
            // TODO Implement logic for INFO_NODE
            // TODO Remove Info Node
        } else if (nodeType === NodeTypes.GAMIFICATION_EVENT_NODE) {
            const outgoingEdge = edges.find(edge => edge.source === node.id)
            let targetNodeId = null
            if (outgoingEdge) {
                targetNodeId = oldNewIdMapping.get(outgoingEdge.target)
            }

            const gamificationOptionsId = await saveGamificationOptions(node, oldNewIdMapping, supabase)

            await supabase.from("gamification_event_element").upsert({
                flow_element_id: oldNewIdMapping.get(node.id),
                next_flow_element_id: targetNodeId,
                gamification_type: node.data.gamificationType,
                gamification_option_id: gamificationOptionsId
            }, {onConflict: "flow_element_id"})
        } else {
            const exhaustiveCheck: never = nodeType;
            throw new Error(`Unhandled nodeType case: ${exhaustiveCheck}`);
        }
    }))

    // Update react flow if any new ids were assigned
    reactFlowInstance.setNodes(nodes.map(node => {
        return {
            ...node,
            id: oldNewIdMapping.get(node.id)?.toString() ?? node.id,
            parentId: node.parentId ? oldNewIdMapping.get(node.parentId)?.toString() : undefined
        } as Node
    }))
    reactFlowInstance.setEdges(edges.map(edge => {
        return {
            ...edge,
            source: oldNewIdMapping.get(edge.source)?.toString() ?? edge.source,
            target: oldNewIdMapping.get(edge.target)?.toString() ?? edge.target,
        } as Edge
    }))

    // Delete any nodes that are not existing nodes and have the process model id
    await supabase.from("flow_element").delete().not("id", "in", `(${existingNodes.join(",")})`).eq("model_id", processModelId)
}

export async function loadProcessModelFromDatabase(supabase: SupabaseClient<any, "public", any>, processModelId: string) {
    const { data: databaseFlowElements, error } = await supabase
        .from("flow_element")
        .select("*")
        .eq("model_id", processModelId)
        .returns<{ id: string, type: string, position_x: number, position_y: number, width: number, height: number, parent_flow_element_id: string, z_index: number }[]>()

    if (databaseFlowElements) {
        const nodes: Node[] = []
        const edges: Edge[] = []

        await Promise.all(databaseFlowElements.map(async (node) => {

            let nodeData = {}
            let nextFlowElementId = null

            const nodeType = node.type as NodeTypes
            if (nodeType === NodeTypes.CHALLENGE_NODE) {
                const { data: challengeElementData } = await supabase
                    .from("challenge_element")
                    .select("*")
                    .eq("flow_element_id", node.id)
                    .single()

                let gamificationOptions = null
                if (challengeElementData?.gamification_option_id) {
                    const { data } = await supabase
                        .from("gamification_option")
                        .select("*")
                        .eq("id", challengeElementData?.gamification_option_id)
                        .single()
                    gamificationOptions = data
                }

                nodeData = {
                    backgroundColor: challengeElementData?.background_color,
                    challengeType: challengeElementData?.challenge_type,
                    secondsToComplete: challengeElementData?.seconds_to_complete,
                    rewardType: challengeElementData?.reward_type,
                    gamificationOptions: convertKeysFromSnakeToCamelCase(gamificationOptions)
                }
            } else if (nodeType === NodeTypes.ACTIVITY_NODE) {
                const { data: activityElementData } = await supabase
                    .from("activity_element")
                    .select("*")
                    .eq("flow_element_id", node.id)
                    .single()

                let gamificationOptions = null
                if (activityElementData?.gamification_option_id) {
                    const { data } = await supabase
                        .from("gamification_option")
                        .select("*")
                        .eq("id", activityElementData?.gamification_option_id)
                        .single()
                    gamificationOptions = data
                }

                nodeData = {
                    task: activityElementData?.task,
                    description: activityElementData?.description,
                    activityType: activityElementData?.activity_type,
                    choices: activityElementData?.choices,
                    inputRegex: activityElementData?.input_regex,
                    variableName: activityElementData?.variable_name,
                    gamificationType: activityElementData?.gamification_type,
                    gamificationOptions: convertKeysFromSnakeToCamelCase(gamificationOptions)
                }

                nextFlowElementId = activityElementData?.next_flow_element_id
                edges.push({
                    id: `${node.id}-${nextFlowElementId}`,
                    source: node.id.toString(),
                    target: nextFlowElementId?.toString()
                } as Edge)
            } else if (nodeType === NodeTypes.GATEWAY_NODE) {
                const { data } = await supabase
                    .from("gateway_element")
                    .select("*")
                    .eq("flow_element_id", node.id)
                    .single()
                const falseFlowElementId = data?.next_flow_element_false_id

                nodeData = {
                    value1: data.value1,
                    comparison: data.comparison,
                    value2: data.value2
                }

                edges.push({
                    id: `${node.id}-${falseFlowElementId}`,
                    source: node.id.toString(),
                    target: falseFlowElementId?.toString(),
                    sourceHandle: "False"
                })
                const trueFlowElementId = data?.next_flow_element_true_id
                edges.push({
                    id: `${node.id}-${trueFlowElementId}`,
                    source: node.id.toString(),
                    target: trueFlowElementId?.toString(),
                    sourceHandle: "True"
                })
            } else if (nodeType === NodeTypes.START_NODE) {
                const { data } = await supabase
                    .from("start_element")
                    .select("*")
                    .eq("flow_element_id", node.id)
                    .single()
                nextFlowElementId = data?.next_flow_element_id
                edges.push({
                    id: `${node.id}-${nextFlowElementId}`,
                    source: node.id.toString(),
                    target: nextFlowElementId?.toString()
                } as Edge)
            } else if (nodeType === NodeTypes.END_NODE) {
                // No data to load
            } else if (nodeType === NodeTypes.INFO_NODE) {
                // TODO Implement logic for INFO_NODE
                // TODO Remove Info Node
            } else if (nodeType === NodeTypes.GAMIFICATION_EVENT_NODE) {
                const { data: gamificationEventElementData } = await supabase
                    .from("gamification_event_element")
                    .select("*")
                    .eq("flow_element_id", node.id)
                    .single()

                let gamificationOptions = null
                if (gamificationEventElementData?.gamification_option_id) {
                    const {data} = await supabase
                        .from("gamification_option")
                        .select("*")
                        .eq("id", gamificationEventElementData?.gamification_option_id || "")
                        .single()
                    gamificationOptions = data
                }

                nodeData = {
                    gamificationType: gamificationEventElementData?.gamification_type,
                    gamificationOptions: convertKeysFromSnakeToCamelCase(gamificationOptions)
                }

                nextFlowElementId = gamificationEventElementData?.next_flow_element_id
                edges.push({
                    id: `${node.id}-${nextFlowElementId}`,
                    source: node.id.toString(),
                    target: nextFlowElementId?.toString()
                } as Edge)
            } else {
                const exhaustiveCheck: never = nodeType;
                throw new Error(`Unhandled nodeType case: ${exhaustiveCheck}`);
            }

            nodes.push({
                id: node.id.toString(),
                type: node.type,
                position: {x: node.position_x, y: node.position_y},
                width: node.width || 50,
                height: node.height || 50,
                parentId: node.parent_flow_element_id?.toString() || undefined,
                zIndex: node.z_index || undefined,
                data: nodeData
            } as Node)
        }))

        return {nodes: nodes, edges: edges}
    }
}

async function saveGamificationOptions(node: Node, oldNewIdMapping: Map<string, string>, supabase: SupabaseClient<any, "public", any>): Promise<string | null> {
    let gamificationOptionsId: string | null = null
    if (node.data.gamificationOptions && node.data.gamificationType !== GamificationType.NONE && node.data.rewardType !== GamificationType.NONE) {
        gamificationOptionsId = (await supabase.from("gamification_option").upsert(
            convertKeysToSnakeCaseWithId(oldNewIdMapping.get(node.id), node.data.gamificationOptions),
            { onConflict: "id"}
        ).select()).data?.[0].id
    }
    return gamificationOptionsId
}

function convertKeysToSnakeCaseWithId(id: string | undefined, obj: any): any {
    const newObj: any = {
        id: id
    };
    for (const [key, value] of Object.entries(obj)) {
        const newKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        newObj[newKey] = value;
    }
    return newObj;
}

function convertKeysFromSnakeToCamelCase(obj: any): any {
    if (!obj) {
        return undefined
    }
    const newObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
        const newKey = key.replace(/_([a-z])/g, letter => letter[1].toUpperCase());
        newObj[newKey] = value;
    }
    return newObj;
}