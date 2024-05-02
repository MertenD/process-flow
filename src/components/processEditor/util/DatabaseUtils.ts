import {Edge, Node, ReactFlowInstance} from "reactflow";
import {SupabaseClient} from "@supabase/supabase-js";
import {NodeTypes} from "@/model/NodeTypes";

// TODO Check if nodes got deleted and delete them from the database when saving

// TODO Save viewport as well

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
            height: node.height
        }, {onConflict: "id"}).select()

        const assignedId = insertedElement.data?.[0].id

        oldNewIdMapping.set(node.id, assignedId)

        existingNodes.push(assignedId)
    }))

    // Save specific flow elements to database with data
    await Promise.all(nodes.map(async (node) => {

        const nodeType = node.type as NodeTypes
        if (nodeType === NodeTypes.CHALLENGE_NODE) {// TODO Implement logic for CHALLENGE_NODE
        } else if (nodeType === NodeTypes.ACTIVITY_NODE) {
            const outgoingEdge = edges.find(edge => edge.source === node.id)
            let targetNodeId = null
            if (outgoingEdge) {
                targetNodeId = oldNewIdMapping.get(outgoingEdge.target)
            }

            await supabase.from("activity_element").upsert({
                flow_element_id: oldNewIdMapping.get(node.id),
                task: node.data.task,
                activity_type: node.data.activityType,
                choices: node.data.choices,
                input_regex: node.data.inputRegex,
                variable_name: node.data.variableName,
                next_flow_element_id: targetNodeId
            }, {onConflict: "flow_element_id"})
        } else if (nodeType === NodeTypes.GATEWAY_NODE) {// TODO Implement logic for GATEWAY_NODE
        } else if (nodeType === NodeTypes.START_NODE) {// TODO Implement logic for START_NODE
        } else if (nodeType === NodeTypes.END_NODE) {// TODO Implement logic for END_NODE
        } else if (nodeType === NodeTypes.INFO_NODE) {// TODO Implement logic for INFO_NODE
        } else if (nodeType === NodeTypes.GAMIFICATION_EVENT_NODE) {// TODO Implement logic for GAMIFICATION_EVENT_NODE
        } else {
            const exhaustiveCheck: never = nodeType;
            throw new Error(`Unhandled nodeType case: ${exhaustiveCheck}`);
        }
    }))

    // Update react flow if any new ids were assigned
    reactFlowInstance.setNodes(nodes.map(node => {
        return {
            ...node,
            id: oldNewIdMapping.get(node.id)?.toString() ?? node.id
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
        .returns<{ id: string, type: string, position_x: number, position_y: number, width: number, height: number }[]>()

    if (databaseFlowElements) {
        const nodes: Node[] = []
        const edges: Edge[] = []

        await Promise.all(databaseFlowElements.map(async (node) => {

            let nodeData = {}
            let nextFlowElementId = null

            const nodeType = node.type as NodeTypes
            if (nodeType === NodeTypes.CHALLENGE_NODE) {// TODO Implement logic for CHALLENGE_NODE
            } else if (nodeType === NodeTypes.ACTIVITY_NODE) {
                const { data } = await supabase
                    .from("activity_element")
                    .select("*")
                    .eq("flow_element_id", node.id)
                    .single()
                nodeData = {
                    task: data?.task,
                    activityType: data?.activity_type,
                    choices: data?.choices,
                    inputRegex: data?.input_regex,
                    variableName: data?.variable_name,
                }

                nextFlowElementId = data?.next_flow_element_id
                edges.push({
                    id: `${node.id}-${nextFlowElementId}`,
                    source: node.id.toString(),
                    target: nextFlowElementId?.toString()
                } as Edge)
            } else if (nodeType === NodeTypes.GATEWAY_NODE) {// TODO Implement logic for GATEWAY_NODE
            } else if (nodeType === NodeTypes.START_NODE) {// TODO Implement logic for START_NODE
            } else if (nodeType === NodeTypes.END_NODE) {// TODO Implement logic for END_NODE
            } else if (nodeType === NodeTypes.INFO_NODE) {// TODO Implement logic for INFO_NODE
            } else if (nodeType === NodeTypes.GAMIFICATION_EVENT_NODE) {// TODO Implement logic for GAMIFICATION_EVENT_NODE
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
                data: nodeData
            } as Node)
        }))

        return {nodes: nodes, edges: edges}
    }
}