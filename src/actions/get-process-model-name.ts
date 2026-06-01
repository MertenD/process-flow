"use server"

import { prisma } from "@/lib/prisma"

export default async function getProcessModelName(processModelId: number): Promise<string | null> {
    const model = await prisma.processModel.findUnique({
        where: { id: BigInt(processModelId) },
        select: { name: true },
    })
    return model?.name ?? null
}
