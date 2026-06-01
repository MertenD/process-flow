"use server"

import { prisma } from "@/lib/prisma"

export default async function(teamId: number, nodeDefinitionId: number): Promise<void> {

    await prisma.teamsNodeDefinitions.create({
        data: { teamId: BigInt(teamId), nodeDefinitionId: BigInt(nodeDefinitionId) },
    })
}
