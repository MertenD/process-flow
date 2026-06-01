"use server"

import { prisma } from "@/lib/prisma"

export default async function(roleId: number): Promise<void> {
    await prisma.role.delete({ where: { id: BigInt(roleId) } })
}
