"use server"

import {Edge, Node} from "reactflow";
import {NodeTypes} from "@/model/NodeTypes";
import {GamificationType} from "@/model/GamificationType";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

// TODO Save viewport as well

// TODO Track and cache changed nodes and edges ans only update those

// TODO Remove InfoNode and make it an activity type of the activity node

// TODO Delete gamification options when node is deleted (maybe via cascading in the database)

// TODO Beim speichern soll das updated by in der Datenbank des process_model auf den aktuellen User gesetzt werden

// TODO Möglicherweise schmeiße ich die spezifischen nodes in der datenbank raus, weil ich es besser finde data in dem flow_element zu speichern. Ich muss mir nur überlegen, wie ich das mit den mehreren ausgängen bei dem gateway mache.

// TODO Laden der Prozesse auf Serverseite ausgführen und dann an die client Komponente BPMNEditor übergeben

// TODO Update loading of nodeData in rest of flow elements and remove unnecesarry node data in database

export default async function(nodes: Node[], edges: Edge[], processModelId: number): Promise<Map<string, number>> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const existingNodes: number[] = []
    const oldNewIdMapping = new Map<string, number>()

    // Save base flow elements to database
    await Promise.all(nodes.map(async (node) => {

        const id = node.id.toString().includes("-") ? undefined : node.id.toString()

        // TODO Make it more robust
        const executionMode = node.type === NodeTypes.ACTIVITY_NODE ? "Manual" : "Automatic"

        // TODO URL soll in die node/options definition und nicht hier hardcoded sein
        let executionUrl: string | undefined = undefined
        if (node.type === NodeTypes.ACTIVITY_NODE) {
            executionUrl = `${process.env.APP_URL || window.location.origin}/instance/task/activity`
        } else if (node.type === NodeTypes.GAMIFICATION_EVENT_NODE) {
            executionUrl = `${process.env.APP_URL || window.location.origin}/api/instance/event`
        }

        const insertedElement = await supabase.from("flow_element").upsert({
            // @ts-ignore
            id: id,
            model_id: processModelId,
            type: node.type,
            position_x: node.position.x,
            position_y: node.position.y,
            width: node.data.width,
            height: node.data.height,
            parent_flow_element_id: node.parentId || null,
            z_index: node.zIndex,
            execution_mode: executionMode,
            execution_url: executionUrl,
            data: node.data || {}
        }, {onConflict: "id"}).select()

        const assignedId = insertedElement.data?.[0].id

        if (!assignedId) {
            throw new Error("Could not save node")
        }

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
                // @ts-ignore
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
                // @ts-ignore
                flow_element_id: oldNewIdMapping.get(node.id),
                task: node.data.task,
                description: node.data.description,
                activity_type: node.data.activityType,
                choices: node.data.choices,
                input_regex: node.data.inputRegex,
                info_text: node.data.infoText,
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
                // @ts-ignore
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
                // @ts-ignore
                flow_element_id: oldNewIdMapping.get(node.id),
                next_flow_element_id: targetNodeId
            }, {onConflict: "flow_element_id"})
        } else if (nodeType === NodeTypes.END_NODE) {
            await supabase.from("end_element").upsert({
                // @ts-ignore
                flow_element_id: oldNewIdMapping.get(node.id)
            }, {onConflict: "flow_element_id"})
        } else if (nodeType === NodeTypes.GAMIFICATION_EVENT_NODE) {
            const outgoingEdge = edges.find(edge => edge.source === node.id)
            let targetNodeId = null
            if (outgoingEdge) {
                targetNodeId = oldNewIdMapping.get(outgoingEdge.target)
            }

            const gamificationOptionsId = await saveGamificationOptions(node, oldNewIdMapping, supabase)

            await supabase.from("gamification_event_element").upsert({
                // @ts-ignore
                flow_element_id: oldNewIdMapping.get(node.id),
                next_flow_element_id: targetNodeId,
                gamification_type: node.data.gamificationType,
                gamification_option_id: gamificationOptionsId
            }, {onConflict: "flow_element_id"})
        } else {
            const exhaustiveCheck: never = nodeType;
            throw new Error(`Unhandled nodeType case: ${exhaustiveCheck}`);
        }
    })).catch((error) => {
        throw error
    })

    // Delete any nodes that are not existing nodes and have the process model id
    await supabase.from("flow_element").delete().not("id", "in", `(${existingNodes.join(",")})`).eq("model_id", processModelId).then(res => {
        if (res.error) {
            throw res.error
        }
    })

    return oldNewIdMapping
}

async function saveGamificationOptions(node: Node, oldNewIdMapping: Map<string, number>, supabase: any): Promise<string | null> {
    let gamificationOptionsId: string | null = null
    if (node.data.gamificationOptions && node.data.gamificationType !== GamificationType.NONE && node.data.rewardType !== GamificationType.NONE) {
        gamificationOptionsId = (await supabase.from("gamification_option").upsert(
            convertKeysToSnakeCaseWithId(oldNewIdMapping.get(node.id), node.data.gamificationOptions),
            { onConflict: "id"}
        ).select()).data?.[0].id
    }
    return gamificationOptionsId
}

function convertKeysToSnakeCaseWithId(id: number | undefined, obj: any): any {
    const newObj: any = {
        id: id
    };
    for (const [key, value] of Object.entries(obj)) {
        const newKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        newObj[newKey] = value;
    }
    return newObj;
}