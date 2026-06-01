"use server"

import { prisma } from "@/lib/prisma"
import { NodeDefinitionPreview } from "@/model/NodeDefinition"

export default async function(teamId: number): Promise<NodeDefinitionPreview[]> {

    const records = await prisma.teamsNodeDefinitions.findMany({
        where: { teamId: BigInt(teamId) },
        include: { nodeDefinition: { select: { id: true, definition: true } } },
    })

    return records
        .filter((r) => r.nodeDefinition != null)
        .map((r) => {
            const def = r.nodeDefinition!.definition as Record<string, unknown>
            return {
                id: Number(r.nodeDefinition!.id),
                name: def.name as string,
                icon: def.icon as string,
                shortDescription: def.shortDescription as string,
                executionMode: def.executionMode as string,
            } as NodeDefinitionPreview
        })
}
