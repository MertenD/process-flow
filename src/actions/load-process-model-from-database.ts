"use server"

import {Edge, Node} from "reactflow";
import {NodeTypes} from "@/model/NodeTypes";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function (processModelId: number): Promise<{ nodes: Node[], edges: Edge[] } | undefined> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: databaseFlowElements, error } = await supabase
        .from("flow_element")
        .select("*")
        .eq("model_id", processModelId)
        .returns<{ id: string, type: string, position_x: number, position_y: number, width: number, height: number, parent_flow_element_id: string, z_index: number }[]>()

    if (databaseFlowElements) {
        const nodes: Node[] = []
        const edges: Edge[] = []

        await Promise.all(databaseFlowElements.map(async (node) => {

            let nodeData: {} | undefined | null = {}
            let nextFlowElementId = null

            const nodeType = node.type as NodeTypes
            if (nodeType === NodeTypes.ACTIVITY_NODE) {
                const { data: activityElementData } = await supabase
                    .from("activity_element")
                    .select("next_flow_element_id")
                    .eq("flow_element_id", node.id)
                    .single()
                nextFlowElementId = activityElementData?.next_flow_element_id

                const { data: flowElementData } = await supabase
                    .from("flow_element")
                    .select("data")
                    .eq("id", node.id)
                    .single()
                nodeData = flowElementData?.data

                edges.push({
                    id: `${node.id}-${nextFlowElementId}`,
                    source: node.id.toString(),
                    target: nextFlowElementId?.toString()
                } as Edge)
            } else if (nodeType === NodeTypes.GATEWAY_NODE) {
                const {data} = await supabase
                    .from("gateway_element")
                    .select("*")
                    .eq("flow_element_id", node.id)
                    .single()

                const falseFlowElementId = data?.next_flow_element_false_id
                edges.push({
                    id: `${node.id}-${falseFlowElementId}`,
                    source: node.id.toString(),
                    target: falseFlowElementId?.toString() || "",
                    sourceHandle: "False"
                })
                const trueFlowElementId = data?.next_flow_element_true_id
                edges.push({
                    id: `${node.id}-${trueFlowElementId}`,
                    source: node.id.toString(),
                    target: trueFlowElementId?.toString() || "",
                    sourceHandle: "True"
                })

                const {data: flowElementData} = await supabase
                    .from("flow_element")
                    .select("data")
                    .eq("id", node.id)
                    .single()

                nodeData = flowElementData?.data
            } else if (nodeType === NodeTypes.AND_SPLIT_NODE) {
                const {data} = await supabase
                    .from("and_split_element")
                    .select("*")
                    .eq("flow_element_id", node.id)
                    .single()

                const nextFlowElementId1 = data?.next_flow_element_id_1
                edges.push({
                    id: `${node.id}-${nextFlowElementId1}`,
                    source: node.id.toString(),
                    target: nextFlowElementId1?.toString() || "",
                    sourceHandle: "1"
                })
                const nextFlowElementId2 = data?.next_flow_element_id_2
                edges.push({
                    id: `${node.id}-${nextFlowElementId2}`,
                    source: node.id.toString(),
                    target: nextFlowElementId2?.toString() || "",
                    sourceHandle: "2"
                })

                const {data: flowElementData} = await supabase
                    .from("flow_element")
                    .select("data")
                    .eq("id", node.id)
                    .single()

                nodeData = flowElementData?.data
            } else if (nodeType === NodeTypes.START_NODE) {
                const { data: startElementData } = await supabase
                    .from("start_element")
                    .select("*")
                    .eq("flow_element_id", node.id)
                    .single()
                nextFlowElementId = startElementData?.next_flow_element_id

                const { data: flowElementData } = await supabase
                    .from("flow_element")
                    .select("data")
                    .eq("id", node.id)
                    .single()
                nodeData = flowElementData?.data

                edges.push({
                    id: `${node.id}-${nextFlowElementId}`,
                    source: node.id.toString(),
                    target: nextFlowElementId?.toString()
                } as Edge)
            } else if (nodeType === NodeTypes.END_NODE) {
                // No data to load
            } else {
                const exhaustiveCheck: never = nodeType;
                throw new Error(`Unhandled nodeType case: ${exhaustiveCheck}`);
            }

            nodes.push({
                id: node.id.toString(),
                type: node.type,
                position: {x: node.position_x, y: node.position_y},
                parentId: node.parent_flow_element_id?.toString() || undefined,
                zIndex: node.z_index || undefined,
                data: {
                    ...nodeData,
                    width: node.width || 50,
                    height: node.height || 50,
                }
            } as Node)
        })).catch((error) => {
            throw error
        })

        return {nodes: nodes, edges: edges}
    }
}