"use server"

import { prisma } from "@/lib/prisma"
import { TeamInfo } from "@/model/TeamInfo"

export default async function(userId: string): Promise<TeamInfo[]> {

    const profileTeams = await prisma.profileTeam.findMany({
        where: { profileId: userId },
        include: {
            team: {
                select: {
                    id: true,
                    createdBy: true,
                    name: true,
                    colorScheme: true,
                },
            },
        },
    })

    return profileTeams.map((pt) => ({
        profileId: pt.profileId,
        teamId: Number(pt.teamId),
        team: {
            createdBy: pt.team.createdBy,
            name: pt.team.name,
            colorSchemeFrom: (pt.team.colorScheme as { from?: string } | null)?.from ?? null,
            colorSchemeTo: (pt.team.colorScheme as { to?: string } | null)?.to ?? null,
        },
    })) as unknown as TeamInfo[]
}
