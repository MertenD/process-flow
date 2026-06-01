"use server"

import { prisma } from "@/lib/prisma"

export default async function(creatorId: string, teamName: string, colorScheme: { from: string; to: string }): Promise<number> {

    if (!creatorId || !teamName) {
        throw new Error("Invalid form data, requires creatorId as string and teamName as string")
    }

    if (teamName.length < 3) {
        throw new Error("Team name must be at least 3 characters long")
    }

    const existing = await prisma.team.findFirst({
        where: { name: teamName, createdBy: creatorId },
    })
    if (existing) throw new Error("Team with name " + teamName + " already exists")

    const team = await prisma.$transaction(async (tx) => {
        const newTeam = await tx.team.create({
            data: { name: teamName, createdBy: creatorId, colorScheme },
        })

        const ownerRole = await tx.role.create({
            data: {
                name: "owner",
                belongsTo: newTeam.id,
                color: "#000000",
                pages: { allowed_pages: ["Editor", "Monitoring", "Tasks", "Team", "Stats"] },
            },
        })

        await tx.profileRoleTeam.create({
            data: { profileId: creatorId, roleId: ownerRole.id, teamId: newTeam.id },
        })

        await tx.profileTeam.create({
            data: { profileId: creatorId, teamId: newTeam.id },
        })

        await tx.statistics.create({
            data: { profileId: creatorId, teamId: newTeam.id },
        })

        return newTeam
    })

    return Number(team.id)
}
