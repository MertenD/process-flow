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
                const { data } = await supabase
                    .from("gateway_element")
                    .select("*")
                    .eq("flow_element_id", node.id)
                    .single()
                const falseFlowElementId = data?.next_flow_element_false_id

                // TODO Better handling of undefined / null values

                nodeData = {
                    value1: data?.value1,
                    comparison: data?.comparison,
                    value2: data?.value2
                }

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