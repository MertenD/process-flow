"use server"

import { prisma } from "@/lib/prisma"
import { Page } from "@/model/database/database.types"

export default async function updateRole(roleId: number, name: string, color: string, allowedPages: Page[]): Promise<void> {
    await prisma.role.update({
        where: { id: BigInt(roleId) },
        data: { name, color, pages: { allowed_pages: allowedPages } },
    })
}
