"use server"

import { prisma } from "@/lib/prisma"

export default async function(processModelId: number, newName: string, newDescription: string): Promise<void> {

    await prisma.processModel.update({
        where: { id: BigInt(processModelId) },
        data: { name: newName, description: newDescription },
    })
}
