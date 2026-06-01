"use server"

import { prisma } from "@/lib/prisma"

export default async function(taskData: Record<string, unknown>, processInstanceId: number) {

    const result = await prisma.$queryRaw<[{ replace_with_variable_values: Record<string, unknown> }]>`
        SELECT replace_with_variable_values(${JSON.stringify(taskData)}::jsonb, ${BigInt(processInstanceId)}::bigint)
    `

    return result?.[0]?.replace_with_variable_values ?? taskData
}
