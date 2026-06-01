"use server"

import { prisma } from "@/lib/prisma"
import { NodeDefinitionPreview } from "@/model/NodeDefinition"

export default async function(creatorId: string, teamId: number): Promise<NodeDefinitionPreview[]> {

    const results = await prisma.nodeDefinition.findMany({
        where: { createdBy: creatorId, teamId: BigInt(teamId) },
        select: { id: true, definition: true },
    })

    return results.map((r) => {
        const def = r.definition as Record<string, unknown>
        return {
            id: Number(r.id),
            name: def.name as string,
            icon: def.icon as string,
            shortDescription: def.shortDescription as string,
            executionMode: def.executionMode as string,
        } as NodeDefinitionPreview
    })
}
