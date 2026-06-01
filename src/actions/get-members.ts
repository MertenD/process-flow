"use server"

import { prisma } from "@/lib/prisma"
import { Member } from "@/components/team/MemberManagement"

export default async function(teamId: number): Promise<Member[]> {

    type ProfileWithRolesRow = {
        profile_id: string
        email: string
        username: string | null
        team_id: bigint
        role_id: bigint | null
        role_name: string | null
        role_color: string | null
    }

    const rows = await prisma.$queryRaw<ProfileWithRolesRow[]>`
        SELECT profile_id, email, username, team_id, role_id, role_name, role_color
        FROM profiles_with_roles
        WHERE team_id = ${BigInt(teamId)}
    `

    const memberMap = new Map<string, Member>()

    for (const row of rows) {
        if (!row.profile_id || !row.username || !row.email) continue

        if (!memberMap.has(row.profile_id)) {
            memberMap.set(row.profile_id, {
                id: row.profile_id,
                name: row.username,
                email: row.email,
                roles: [],
            })
        }

        if (row.role_id && row.role_name) {
            memberMap.get(row.profile_id)!.roles.push({
                id: Number(row.role_id),
                name: row.role_name,
            })
        }
    }

    return Array.from(memberMap.values())
}
