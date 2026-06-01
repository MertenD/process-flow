"use server"

import { prisma } from "@/lib/prisma"
import { NodeDefinition } from "@/model/NodeDefinition"
import { NodeDefinitionVisibility } from "@/model/database/database.types"

export default async function(nodeDefinition: NodeDefinition, creatorId: string, teamId: number, visibility: NodeDefinitionVisibility): Promise<number> {

    const nd = await prisma.nodeDefinition.create({
        data: {
            definition: nodeDefinition as any,
            createdBy: creatorId,
            teamId: BigInt(teamId),
            visibility: visibility as any,
        },
    })

    return Number(nd.id)
}
