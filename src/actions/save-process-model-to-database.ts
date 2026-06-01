"use server"

import { Edge, Node } from "reactflow"
import { NodeTypes } from "@/model/NodeTypes"
import { prisma } from "@/lib/prisma"

export default async function(nodes: Node[], edges: Edge[], processModelId: number): Promise<Map<string, number>> {

    const existingNodeIds: bigint[] = []
    const oldNewIdMapping = new Map<string, number>()

    // Upsert base flow elements
    await Promise.all(nodes.map(async (node) => {
        const hasNumericId = !node.id.toString().includes("-")
        const id = hasNumericId ? BigInt(node.id) : undefined

        const upserted = await prisma.flowElement.upsert({
            where: { id: id ?? BigInt(0) },
            create: {
                ...(id ? { id } : {}),
                modelId: BigInt(processModelId),
                type: node.type as any,
                positionX: node.position.x,
                positionY: node.position.y,
                width: node.data.width ?? null,
                height: node.data.height ?? null,
                parentFlowElementId: node.parentId ? BigInt(node.parentId) : null,
                zIndex: node.zIndex ? BigInt(node.zIndex) : null,
                data: node.data ?? {},
            },
            update: {
                type: node.type as any,
                positionX: node.position.x,
                positionY: node.position.y,
                width: node.data.width ?? null,
                height: node.data.height ?? null,
                parentFlowElementId: node.parentId ? BigInt(node.parentId) : null,
                zIndex: node.zIndex ? BigInt(node.zIndex) : null,
                data: node.data ?? {},
            },
        })

        oldNewIdMapping.set(node.id, Number(upserted.id))
        existingNodeIds.push(upserted.id)
    }))

    // Upsert type-specific elements
    await Promise.all(nodes.map(async (node) => {
        const dbId = BigInt(oldNewIdMapping.get(node.id)!)
        const nodeType = node.type as NodeTypes

        if (nodeType === NodeTypes.ACTIVITY_NODE) {
            const out = edges.find((e) => e.source === node.id)
            const nextId = out ? BigInt(oldNewIdMapping.get(out.target)!) : null
            await prisma.activityElement.upsert({
                where: { flowElementId: dbId },
                create: { flowElementId: dbId, nextFlowElementId: nextId, nextFlowElementHandle: out?.targetHandle ?? null },
                update: { nextFlowElementId: nextId, nextFlowElementHandle: out?.targetHandle ?? null },
            })
        } else if (nodeType === NodeTypes.GATEWAY_NODE) {
            const outEdges = edges.filter((e) => e.source === node.id)
            const falseEdge = outEdges.find((e) => e.sourceHandle === "False")
            const trueEdge = outEdges.find((e) => e.sourceHandle === "True")
            await prisma.gatewayElement.upsert({
                where: { flowElementId: dbId },
                create: {
                    flowElementId: dbId,
                    nextFlowElementFalseId: falseEdge ? BigInt(oldNewIdMapping.get(falseEdge.target)!) : null,
                    nextFlowElementFalseHandle: falseEdge?.targetHandle ?? null,
                    nextFlowElementTrueId: trueEdge ? BigInt(oldNewIdMapping.get(trueEdge.target)!) : null,
                    nextFlowElementTrueHandle: trueEdge?.targetHandle ?? null,
                },
                update: {
                    nextFlowElementFalseId: falseEdge ? BigInt(oldNewIdMapping.get(falseEdge.target)!) : null,
                    nextFlowElementFalseHandle: falseEdge?.targetHandle ?? null,
                    nextFlowElementTrueId: trueEdge ? BigInt(oldNewIdMapping.get(trueEdge.target)!) : null,
                    nextFlowElementTrueHandle: trueEdge?.targetHandle ?? null,
                },
            })
        } else if (nodeType === NodeTypes.AND_SPLIT_NODE) {
            const outEdges = edges.filter((e) => e.source === node.id)
            const [e1, e2] = outEdges
            await prisma.andSplitElement.upsert({
                where: { flowElementId: dbId },
                create: {
                    flowElementId: dbId,
                    nextFlowElementId1: e1 ? BigInt(oldNewIdMapping.get(e1.target)!) : null,
                    nextFlowElementHandle1: e1?.targetHandle ?? null,
                    nextFlowElementId2: e2 ? BigInt(oldNewIdMapping.get(e2.target)!) : null,
                    nextFlowElementHandle2: e2?.targetHandle ?? null,
                },
                update: {
                    nextFlowElementId1: e1 ? BigInt(oldNewIdMapping.get(e1.target)!) : null,
                    nextFlowElementHandle1: e1?.targetHandle ?? null,
                    nextFlowElementId2: e2 ? BigInt(oldNewIdMapping.get(e2.target)!) : null,
                    nextFlowElementHandle2: e2?.targetHandle ?? null,
                },
            })
        } else if (nodeType === NodeTypes.AND_JOIN_NODE) {
            const outEdge = edges.find((e) => e.source === node.id)
            const inEdge1 = edges.filter((e) => e.target === node.id).find((e) => e.targetHandle === "1")
            const inEdge2 = edges.filter((e) => e.target === node.id).find((e) => e.targetHandle === "2")
            await prisma.andJoinElement.upsert({
                where: { flowElementId: dbId },
                create: {
                    flowElementId: dbId,
                    nextFlowElementId: outEdge ? BigInt(oldNewIdMapping.get(outEdge.target)!) : null,
                    nextFlowElementHandle: outEdge?.targetHandle ?? null,
                    previousFlowElementId1: inEdge1 ? BigInt(oldNewIdMapping.get(inEdge1.source)!) : null,
                    previousFlowElementId2: inEdge2 ? BigInt(oldNewIdMapping.get(inEdge2.source)!) : null,
                },
                update: {
                    nextFlowElementId: outEdge ? BigInt(oldNewIdMapping.get(outEdge.target)!) : null,
                    nextFlowElementHandle: outEdge?.targetHandle ?? null,
                    previousFlowElementId1: inEdge1 ? BigInt(oldNewIdMapping.get(inEdge1.source)!) : null,
                    previousFlowElementId2: inEdge2 ? BigInt(oldNewIdMapping.get(inEdge2.source)!) : null,
                },
            })
        } else if (nodeType === NodeTypes.START_NODE) {
            const out = edges.find((e) => e.source === node.id)
            const nextId = out ? BigInt(oldNewIdMapping.get(out.target)!) : null
            await prisma.startElement.upsert({
                where: { flowElementId: dbId },
                create: { flowElementId: dbId, nextFlowElementId: nextId, nextFlowElementHandle: out?.targetHandle ?? null },
                update: { nextFlowElementId: nextId, nextFlowElementHandle: out?.targetHandle ?? null },
            })
        } else if (nodeType === NodeTypes.END_NODE) {
            await prisma.endElement.upsert({
                where: { flowElementId: dbId },
                create: { flowElementId: dbId },
                update: {},
            })
        } else {
            const exhaustiveCheck: never = nodeType
            throw new Error(`Unhandled nodeType case: ${exhaustiveCheck}`)
        }
    }))

    // Delete removed flow elements
    await prisma.flowElement.deleteMany({
        where: {
            modelId: BigInt(processModelId),
            id: { notIn: existingNodeIds },
        },
    })

    return oldNewIdMapping
}
