"use server"

import { prisma } from "@/lib/prisma"
import { ManualTaskWithOutputs } from "@/model/database/database.types"

export default async function(teamId: number, userId: string): Promise<ManualTaskWithOutputs[]> {

    const userRoles = await prisma.profileRoleTeam.findMany({
        where: { profileId: userId, teamId: BigInt(teamId) },
        select: { roleId: true },
    })

    const roleIds = userRoles.map((r) => r.roleId)

    if (roleIds.length === 0) return []

    const result = await prisma.$queryRaw<[{ get_manual_tasks_with_replaced_data: ManualTaskWithOutputs[] | null }]>`
        SELECT get_manual_tasks_with_replaced_data(${BigInt(teamId)}::bigint, ${roleIds}::bigint[])
    `

    return (result?.[0]?.get_manual_tasks_with_replaced_data ?? []) as ManualTaskWithOutputs[]
}
