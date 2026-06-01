"use server"

import { prisma } from "@/lib/prisma"
import { InvitationWithTeam } from "@/model/database/database.types"

export default async function acceptInvite(invitationWithTeam: InvitationWithTeam, userId: string): Promise<void> {

    const invitation = await prisma.invitation.findUnique({
        where: { id: BigInt(invitationWithTeam.id) },
    })
    if (!invitation) throw new Error("Invitation does not exist.")

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || user.email !== invitation.email) {
        throw new Error("Email does not match invitation.")
    }

    const alreadyMember = await prisma.profileTeam.findFirst({
        where: { profileId: userId, teamId: invitation.teamId },
    })
    if (alreadyMember) throw new Error("Already a member of this team.")

    await prisma.$transaction(async (tx) => {
        await tx.profileTeam.create({
            data: { profileId: userId, teamId: invitation.teamId },
        })
        await tx.statistics.create({
            data: { profileId: userId, teamId: invitation.teamId },
        })
        await tx.invitation.delete({ where: { id: invitation.id } })
    })
}
