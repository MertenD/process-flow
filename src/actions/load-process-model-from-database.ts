"use server"

import { Edge, Node } from "reactflow"
import { NodeTypes } from "@/model/NodeTypes"
import { prisma } from "@/lib/prisma"

export default async function(processModelId: number): Promise<{ nodes: Node[]; edges: Edge[] } | undefined> {

    const flowElements = await prisma.flowElement.findMany({
        where: { modelId: BigInt(processModelId) },
        include: {
            activityElement: true,
            startElement: true,
            endElement: true,
            gatewayElement: true,
            andSplitElement: true,
            andJoinElement: true,
        },
    })

    if (!flowElements) return undefined

    const nodes: Node[] = []
    const edges: Edge[] = []

    for (const el of flowElements) {
        const nodeType = el.type as unknown as NodeTypes
        const nodeData = (el.data ?? {}) as Record<string, unknown>

        if (nodeType === NodeTypes.ACTIVITY_NODE) {
            const ae = el.activityElement
            if (ae?.nextFlowElementId) {
                edges.push({
                    id: `${el.id}-${ae.nextFlowElementId}`,
                    source: el.id.toString(),
                    target: ae.nextFlowElementId.toString(),
                    targetHandle: ae.nextFlowElementHandle ?? undefined,
                } as Edge)
            }
        } else if (nodeType === NodeTypes.GATEWAY_NODE) {
            const ge = el.gatewayElement
            if (ge) {
                if (ge.nextFlowElementFalseId) {
                    edges.push({
                        id: `${el.id}-${ge.nextFlowElementFalseId}`,
                        source: el.id.toString(),
                        target: ge.nextFlowElementFalseId.toString(),
                        sourceHandle: "False",
                        targetHandle: ge.nextFlowElementFalseHandle ?? undefined,
                    })
                }
                if (ge.nextFlowElementTrueId) {
                    edges.push({
                        id: `${el.id}-${ge.nextFlowElementTrueId}`,
                        source: el.id.toString(),
                        target: ge.nextFlowElementTrueId.toString(),
                        sourceHandle: "True",
                        targetHandle: ge.nextFlowElementTrueHandle ?? undefined,
                    })
                }
            }
        } else if (nodeType === NodeTypes.AND_SPLIT_NODE) {
            const ase = el.andSplitElement
            if (ase) {
                if (ase.nextFlowElementId1) {
                    edges.push({
                        id: `${el.id}-${ase.nextFlowElementId1}`,
                        source: el.id.toString(),
                        target: ase.nextFlowElementId1.toString(),
                        sourceHandle: "1",
                        targetHandle: ase.nextFlowElementHandle1 ?? undefined,
                    })
                }
                if (ase.nextFlowElementId2) {
                    edges.push({
                        id: `${el.id}-${ase.nextFlowElementId2}`,
                        source: el.id.toString(),
                        target: ase.nextFlowElementId2.toString(),
                        sourceHandle: "2",
                        targetHandle: ase.nextFlowElementHandle2 ?? undefined,
                    })
                }
            }
        } else if (nodeType === NodeTypes.AND_JOIN_NODE) {
            const aje = el.andJoinElement
            if (aje?.nextFlowElementId) {
                edges.push({
                    id: `${el.id}-${aje.nextFlowElementId}`,
                    source: el.id.toString(),
                    target: aje.nextFlowElementId.toString(),
                    targetHandle: aje.nextFlowElementHandle ?? undefined,
                })
            }
        } else if (nodeType === NodeTypes.START_NODE) {
            const se = el.startElement
            if (se?.nextFlowElementId) {
                edges.push({
                    id: `${el.id}-${se.nextFlowElementId}`,
                    source: el.id.toString(),
                    target: se.nextFlowElementId.toString(),
                    targetHandle: se.nextFlowElementHandle ?? undefined,
                } as Edge)
            }
        }

        nodes.push({
            id: el.id.toString(),
            type: el.type,
            position: { x: el.positionX, y: el.positionY },
            parentId: el.parentFlowElementId?.toString() ?? undefined,
            zIndex: el.zIndex ? Number(el.zIndex) : undefined,
            data: {
                ...nodeData,
                width: el.width ?? 50,
                height: el.height ?? 50,
            },
        } as Node)
    }

    return { nodes, edges }
}
