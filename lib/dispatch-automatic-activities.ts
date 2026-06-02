import { prisma } from "@/lib/prisma"

type PendingActivity = {
    id: bigint
    execution_url: string
    data: Record<string, unknown> | null
}

export async function dispatchAutomaticActivities(processInstanceId: bigint): Promise<void> {
    const pending = await prisma.$queryRaw<PendingActivity[]>`
        SELECT fei.id, nd.definition->>'executionUrl' AS execution_url,
               replace_with_variable_values(fe.data, fei.is_part_of) AS data
        FROM flow_element_instance fei
        JOIN flow_element fe ON fei.instance_of = fe.id
        JOIN node_definition nd ON (fe.data->>'nodeDefinitionId')::bigint = nd.id
        WHERE fei.is_part_of = ${processInstanceId}
          AND fei.status = 'In Progress'
          AND (nd.definition->>'executionMode') = 'Automatic'
    `

    // INTERNAL_APP_URL is the Docker-internal address activity containers use for callbacks.
    // Falls back to APP_URL for local dev without Docker.
    const appUrl = process.env.INTERNAL_APP_URL || process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || ""

    await Promise.allSettled(
        pending.map(async (task) => {
            if (!task.execution_url) return

            const payload = {
                responsePath: `${appUrl}/api/instance/complete`,
                errorResponsePath: `${appUrl}/api/instance/error`,
                flowElementInstanceId: task.id.toString(),
                data: task.data ?? {},
            }

            try {
                await fetch(task.execution_url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                    signal: AbortSignal.timeout(120_000),
                })
            } catch (err) {
                console.error(`Failed to dispatch automatic activity ${task.id}:`, err)
                await prisma.$executeRaw`
                    SELECT fail_flow_element_instance(${task.id}::bigint, ${"Failed to dispatch: " + String(err)}::text)
                `
            }
        })
    )
}
