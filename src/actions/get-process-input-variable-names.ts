"use server"

import { prisma } from "@/lib/prisma"
import { NodeTypes } from "@/model/NodeTypes"

export default async function(processModelId: number): Promise<string[]> {

    const startElement = await prisma.flowElement.findFirst({
        where: { modelId: BigInt(processModelId), type: NodeTypes.START_NODE as any },
        select: { data: true },
    })

    if (!startElement?.data) return []

    const data = startElement.data as Record<string, unknown>
    const outputs = data.outputs as Record<string, string> | undefined

    return Object.values(outputs ?? {})
}
