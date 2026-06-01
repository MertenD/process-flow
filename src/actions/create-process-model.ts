"use server"

import { prisma } from "@/lib/prisma"

export default async function(teamId: number, name: string, description: string, creatorId: string): Promise<number> {

    if (!name) {
        throw new Error("Invalid form data, requires name as string")
    }

    if (name.length < 3) {
        throw new Error("Process name must be at least 3 characters long")
    }

    const model = await prisma.processModel.create({
        data: {
            name,
            description,
            createdBy: creatorId,
            belongsTo: BigInt(teamId),
        },
    })

    return Number(model.id)
}
