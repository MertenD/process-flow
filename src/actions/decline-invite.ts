"use server"

import { prisma } from "@/lib/prisma"
import { InvitationWithTeam } from "@/model/database/database.types"

export default async function(invitationWithTeam: InvitationWithTeam, userId: string): Promise<void> {
    await prisma.invitation.delete({ where: { id: BigInt(invitationWithTeam.id) } })
}
