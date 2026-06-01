"use server"

import { prisma } from "@/lib/prisma"

export default async function(teamId: number, profileId: string, roleIds: number[]): Promise<void> {

    await prisma.$transaction(async (tx) => {
        // Remove roles not in the new list
        await tx.profileRoleTeam.deleteMany({
            where: {
                teamId: BigInt(teamId),
                profileId,
                roleId: { notIn: roleIds.map(BigInt) },
            },
        })

        // Add new roles (ignore conflicts)
        await Promise.all(
            roleIds.map((roleId) =>
                tx.profileRoleTeam.upsert({
                    where: {
                        unique_profile_role_team: {
                            profileId,
                            roleId: BigInt(roleId),
                            teamId: BigInt(teamId),
                        },
                    },
                    create: { profileId, roleId: BigInt(roleId), teamId: BigInt(teamId) },
                    update: {},
                })
            )
        )
    })
}
