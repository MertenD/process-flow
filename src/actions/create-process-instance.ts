"use server"

import { prisma } from "@/lib/prisma"
import { dispatchAutomaticActivities } from "@/lib/dispatch-automatic-activities"

type InputsType = { [key: string]: string }

export default async function(processModelId: number, inputs: InputsType): Promise<{ processInstanceId: number }> {

    const result = await prisma.$queryRaw<[{ create_process_instance: bigint }]>`
        SELECT create_process_instance(${processModelId}::bigint, ${JSON.stringify(inputs)}::jsonb)
    `

    if (!result?.[0]) {
        throw new Error("Error creating process instance")
    }

    const processInstanceId = Number(result[0].create_process_instance)

    await dispatchAutomaticActivities(BigInt(processInstanceId))

    return { processInstanceId }
}
