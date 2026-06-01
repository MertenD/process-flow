"use server"

import { prisma } from "@/lib/prisma"
import { RoleWithAllowedPages } from "@/model/database/database.types"

export default async function(teamId: number): Promise<RoleWithAllowedPages[]> {

    const roles = await prisma.role.findMany({
        where: { belongsTo: BigInt(teamId) },
    })

    return roles
        .filter((r) => r.name !== "owner")
        .map((r) => ({
            id: Number(r.id),
            created_at: r.createdAt.toISOString(),
            name: r.name,
            belongs_to: Number(r.belongsTo),
            color: r.color,
            pages: r.pages as { allowed_pages: string[] },
            allowed_pages: ((r.pages as { allowed_pages?: string[] })?.allowed_pages ?? []) as any[],
        })) as RoleWithAllowedPages[]
}
