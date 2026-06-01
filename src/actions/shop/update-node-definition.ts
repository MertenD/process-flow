"use server"

import { prisma } from "@/lib/prisma"
import { NodeDefinition } from "@/model/NodeDefinition"
import { NodeDefinitionVisibility } from "@/model/database/database.types"

export default async function(id: number, nodeDefinition: NodeDefinition, creatorId: string, teamId: number, visibility: NodeDefinitionVisibility): Promise<void> {

    await prisma.nodeDefinition.update({
        where: { id: BigInt(id) },
        data: {
            definition: nodeDefinition as any,
            createdBy: creatorId,
            teamId: BigInt(teamId),
            visibility: visibility as any,
        },
    })
}
