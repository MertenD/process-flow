"use server"

import { prisma } from "@/lib/prisma"
import { UserStats } from "@/model/UserStats"

export default async function(userId: string, teamId: number): Promise<UserStats> {

    const stats = await prisma.statistics.findFirst({
        where: { profileId: userId, teamId: BigInt(teamId) },
    })

    if (!stats) throw new Error("No statistics found")

    return {
        experience: Number(stats.experience),
        experiencePerLevel: 100,
        coins: Number(stats.coins),
        badges: ((stats.badges as { badges?: string[] })?.badges ?? []),
    } as UserStats
}
