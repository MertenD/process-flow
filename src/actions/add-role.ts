"use server"

import { prisma } from "@/lib/prisma"
import { Page } from "@/model/database/database.types"

export default async function(roleName: string, teamId: number, color: string, allowedPages: Page[]): Promise<number> {

    if (roleName === "owner" || roleName === "all" || roleName === "none") {
        throw new Error("Role name cannot be 'owner'")
    }

    const existing = await prisma.role.findFirst({
        where: { name: roleName, belongsTo: BigInt(teamId) },
    })
    if (existing) throw new Error("Role with name " + roleName + " already exists in team.")

    const role = await prisma.role.create({
        data: {
            name: roleName,
            color,
            belongsTo: BigInt(teamId),
            pages: { allowed_pages: allowedPages },
        },
    })

    return Number(role.id)
}
