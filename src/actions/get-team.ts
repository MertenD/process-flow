"use server"

import { prisma } from "@/lib/prisma"

export default async function getTeam(teamId: number): Promise<{ id: number; name: string } | null> {
    const team = await prisma.team.findUnique({
        where: { id: BigInt(teamId) },
        select: { id: true, name: true },
    })
    if (!team) return null
    return { id: Number(team.id), name: team.name }
}
