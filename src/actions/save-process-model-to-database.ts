"use server"

import {Edge, Node} from "reactflow";
import {NodeTypes} from "@/model/NodeTypes";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

// TODO Save viewport as well

// TODO Track and cache changed nodes and edges ans only update those

// TODO Beim speichern soll das updated by in der Datenbank des process_model auf den aktuellen User gesetzt werden

export default async function(nodes: Node[], edges: Edge[], processModelId: number): Promise<Map<string, number>> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const existingNodes: number[] = []
    const oldNewIdMapping = new Map<string, number>()

    // Save base flow elements to database
    await Promise.all(nodes.map(async (node) => {

        const id = node.id.toString().includes("-") ? undefined : node.id.toString()

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
            data: node.data || {}
        }, {onConflict: "id"}).select()

        const assignedId = insertedElement.data?.[0].id

        if (!assignedId) {
            throw new Error("Could not save node")
        }

        oldNewIdMapping.set(node.id, assignedId)

        existingNodes.push(assignedId)
    }))

    // Save specific flow elements to database
    await Promise.all(nodes.map(async (node) => {

        const nodeType = node.type as NodeTypes
        if (nodeType === NodeTypes.ACTIVITY_NODE) {
            const outgoingEdge = edges.find(edge => edge.source === node.id)
            let targetNodeId = null
            if (outgoingEdge) {
                targetNodeId = oldNewIdMapping.get(outgoingEdge.target)
            }

            await supabase.from("activity_element").upsert({
                // @ts-ignore
                flow_element_id: oldNewIdMapping.get(node.id),
                next_flow_element_id: targetNodeId,
                next_flow_element_handle: outgoingEdge?.targetHandle
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
                next_flow_element_false_id: falseTargetNodeId,
                next_flow_element_false_handle: falseOutgoingEdge?.targetHandle,
                next_flow_element_true_id: trueTargetNodeId,
                next_flow_element_true_handle: trueOutgoingEdge?.targetHandle
            }, {onConflict: "flow_element_id"})
        } else if (nodeType === NodeTypes.AND_SPLIT_NODE) {
            const outgoingEdges = edges.filter(edge => edge.source === node.id)

            const targetNodeIds = outgoingEdges.map(edge => oldNewIdMapping.get(edge.target))

            await supabase.from("and_split_element").upsert({
                // @ts-ignore
                flow_element_id: oldNewIdMapping.get(node.id),
                next_flow_element_id_1: targetNodeIds[0],
                next_flow_element_handle_1: outgoingEdges[0]?.targetHandle,
                next_flow_element_id_2: targetNodeIds[1],
                next_flow_element_handle_2: outgoingEdges[1]?.targetHandle
            }, {onConflict: "flow_element_id"})
        } else if (nodeType === NodeTypes.AND_JOIN_NODE) {
            const outgoingEdge = edges.find(edge => edge.source === node.id)

            console.log("AND JOIN NODE", node.id, edges.filter(edge => edge.target === node.id))

            const incomingEdge1 = edges.filter(edge => edge.target === node.id).find(edge => edge.targetHandle === "1")
            const incomingEdge2 = edges.filter(edge => edge.target === node.id).find(edge => edge.targetHandle === "2")

            await supabase.from("and_join_element").upsert({
                // @ts-ignore
                flow_element_id: oldNewIdMapping.get(node.id),
                next_flow_element_id: outgoingEdge ? oldNewIdMapping.get(outgoingEdge.target) : null,
                next_flow_element_handle: outgoingEdge?.targetHandle,
                previous_flow_element_id_1: incomingEdge1 ? oldNewIdMapping.get(incomingEdge1.source) : null,
                previous_flow_element_id_2: incomingEdge2 ? oldNewIdMapping.get(incomingEdge2.source) : null
            }, { onConflict: "flow_element_id" })

        } else if (nodeType === NodeTypes.START_NODE) {
            const outgoingEdge = edges.find(edge => edge.source === node.id)
            let targetNodeId = null
            if (outgoingEdge) {
                targetNodeId = oldNewIdMapping.get(outgoingEdge.target)
            }

            await supabase.from("start_element").upsert({
                // @ts-ignore
                flow_element_id: oldNewIdMapping.get(node.id),
                next_flow_element_id: targetNodeId,
                next_flow_element_handle: outgoingEdge?.targetHandle
            }, {onConflict: "flow_element_id"})
        } else if (nodeType === NodeTypes.END_NODE) {
            await supabase.from("end_element").upsert({
                // @ts-ignore
                flow_element_id: oldNewIdMapping.get(node.id)
            }, {onConflict: "flow_element_id"})
        } else {
            const exhaustiveCheck: never = nodeType;
            throw new Error(`Unhandled nodeType case: ${exhaustiveCheck}`);
        }
    })).catch((error) => {
        throw error
    })

    // Delete any nodes that are not existing nodes and have the process model id
    await supabase
        .from("flow_element")
        .delete()
        .not("id", "in", `(${existingNodes.join(",")})`)
        .eq("model_id", processModelId)
        .then(res => {
            if (res.error) {
                throw res.error
            }
        })

    return oldNewIdMapping
}