"use server"

import { prisma } from "@/lib/prisma"
import { Page } from "@/model/database/database.types"

export default async function(teamId: number, profileId: string): Promise<Page[]> {

    const profileRoleTeams = await prisma.profileRoleTeam.findMany({
        where: { teamId: BigInt(teamId), profileId },
        include: { role: { select: { pages: true } } },
    })

    const allPages = profileRoleTeams
        .flatMap((prt) => ((prt.role.pages as { allowed_pages?: string[] })?.allowed_pages ?? []))

    return Array.from(new Set(allPages)) as Page[]
}
