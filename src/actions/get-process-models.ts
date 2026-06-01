"use server"

import { prisma } from "@/lib/prisma"
import { ProcessModel } from "@/model/database/database.types"

export default async function(teamId: number): Promise<ProcessModel[]> {

    const models = await prisma.processModel.findMany({
        where: { belongsTo: BigInt(teamId) },
        orderBy: { createdAt: "desc" },
    })

    return models.map((m) => ({
        id: Number(m.id),
        created_at: m.createdAt.toISOString(),
        name: m.name,
        description: m.description,
        created_by: m.createdBy,
        updated_by: m.updatedBy,
        updated_at: m.updatedAt?.toISOString() ?? null,
        belongs_to: Number(m.belongsTo),
    }))
}
