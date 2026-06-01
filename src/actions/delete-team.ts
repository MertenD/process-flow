"use server"

import { prisma } from "@/lib/prisma"

export default async function deleteTeam(teamId: number): Promise<void> {
    await prisma.team.delete({ where: { id: BigInt(teamId) } })
}
