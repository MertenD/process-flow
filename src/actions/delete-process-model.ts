"use server"

import { prisma } from "@/lib/prisma"

export default async function deleteProcessModel(processModelId: number): Promise<void> {
    await prisma.processModel.delete({ where: { id: BigInt(processModelId) } })
}
