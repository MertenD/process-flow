"use server"

import { prisma } from "@/lib/prisma"

export default async function(teamId: number, profileId: string): Promise<void> {

    await prisma.$transaction([
        prisma.profileTeam.deleteMany({
            where: { profileId, teamId: BigInt(teamId) },
        }),
        prisma.profileRoleTeam.deleteMany({
            where: { profileId, teamId: BigInt(teamId) },
        }),
    ])
}
