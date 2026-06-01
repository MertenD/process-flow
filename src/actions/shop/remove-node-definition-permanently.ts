"use server"

import { prisma } from "@/lib/prisma"

export default async function(nodeDefinitionId: number): Promise<void> {
    await prisma.nodeDefinition.delete({ where: { id: BigInt(nodeDefinitionId) } })
}
