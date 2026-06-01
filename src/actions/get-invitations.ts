"use server"

import { prisma } from "@/lib/prisma"
import { InvitationWithTeam } from "@/model/database/database.types"

export default async function(userEmail: string): Promise<InvitationWithTeam[]> {

    const invitations = await prisma.invitation.findMany({
        where: { email: userEmail },
        include: { team: true },
    })

    return invitations.map((inv) => ({
        id: Number(inv.id),
        created_at: inv.createdAt.toISOString(),
        email: inv.email,
        team_id: Number(inv.teamId),
        team: {
            id: Number(inv.team.id),
            created_at: inv.team.createdAt.toISOString(),
            name: inv.team.name,
            created_by: inv.team.createdBy,
            color_scheme: inv.team.colorScheme as { from: string; to: string } | null,
        },
    }))
}
