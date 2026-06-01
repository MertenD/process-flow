"use server"

import { prisma } from "@/lib/prisma"

export default async function(email: string, teamId: number): Promise<number> {

    // Check if user is already in team
    const alreadyInTeam = await prisma.profileTeam.findFirst({
        where: {
            teamId: BigInt(teamId),
            profile: { email },
        },
    })
    if (alreadyInTeam) throw new Error("Email " + email + " is already in the team.")

    // Check if already invited
    const existing = await prisma.invitation.findFirst({
        where: { email, teamId: BigInt(teamId) },
    })
    if (existing) throw new Error("Email " + email + " is already invited.")

    const invitation = await prisma.invitation.create({
        data: { email, teamId: BigInt(teamId) },
    })

    return Number(invitation.id)
}
