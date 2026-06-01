"use server"

import { prisma } from "@/lib/prisma"

export default async function(teamId: number, nodeDefinitionId: number): Promise<void> {

    await prisma.teamsNodeDefinitions.deleteMany({
        where: { teamId: BigInt(teamId), nodeDefinitionId: BigInt(nodeDefinitionId) },
    })
}
