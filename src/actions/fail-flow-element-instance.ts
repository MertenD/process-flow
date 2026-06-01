"use server"

import { prisma } from "@/lib/prisma"

export default async function(flowElementInstanceId: number, errorMessage: string): Promise<void> {
    await prisma.$executeRaw`
        SELECT fail_flow_element_instance(${BigInt(flowElementInstanceId)}::bigint, ${errorMessage}::text)
    `
}
