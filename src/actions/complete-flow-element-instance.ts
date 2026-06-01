"use server"

import { prisma } from "@/lib/prisma"
import { dispatchAutomaticActivities } from "@/lib/dispatch-automatic-activities"

export default async function(
    flowElementInstanceId: number,
    outputData: Record<string, unknown>,
    completedBy: string | undefined
): Promise<boolean> {

    const result = await prisma.$queryRaw<[{ complete_flow_element_instance: boolean }]>`
        SELECT complete_flow_element_instance(
            ${flowElementInstanceId}::bigint,
            ${JSON.stringify(outputData)}::jsonb,
            ${completedBy ?? null}::uuid
        )
    `

    if (!result?.[0]?.complete_flow_element_instance) {
        throw new Error("Error completing flow element instance")
    }

    if (completedBy) {
        try {
            await prisma.$executeRaw`
                SELECT apply_gamification(${completedBy}::uuid, ${flowElementInstanceId}::bigint)
            `
        } catch (err) {
            console.error("apply_gamification error:", err)
        }
    }

    // Dispatch any automatic activities that were created as a result of completion
    const instance = await prisma.flowElementInstance.findUnique({
        where: { id: BigInt(flowElementInstanceId) },
        select: { isPartOf: true },
    })
    if (instance) {
        await dispatchAutomaticActivities(instance.isPartOf)
    }

    return true
}
