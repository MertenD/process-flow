"use server"

import { prisma } from "@/lib/prisma"

export default async function isNodeSavedInTeam(teamId: number, nodeDefinitionId: number): Promise<boolean> {
    const count = await prisma.teamsNodeDefinitions.count({
        where: { teamId: BigInt(teamId), nodeDefinitionId: BigInt(nodeDefinitionId) },
    })
    return count > 0
}
