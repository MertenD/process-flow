import React from "react"
import TaskFrame from "@/components/tasks/TaskFrame"
import { redirect } from "next/navigation"
import getTasks from "@/actions/get-tasks"
import { getTranslations } from "next-intl/server"
import { ManualTaskWithOutputs } from "@/model/database/database.types"
import { requireSession } from "@/lib/session"

export default async function SelectedTasksPage({ params }: Readonly<{ params: { taskId: string, teamId: number } }>) {

    const t = await getTranslations("tasks")

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    const tasks = await getTasks(params.teamId, session.user.id)
    const currentTask = tasks?.find(task => task.id.toString() === params.taskId)

    if (currentTask && currentTask.status && currentTask?.status !== "Todo") {
        redirect(`/${params.teamId}/tasks`)
    }

    async function buildTaskUrl(task: ManualTaskWithOutputs | undefined, userId: string): Promise<string | null> {
        if (task == null) return null
        let taskUrl = task.execution_url
        taskUrl += "?"
        if (!task.data) return null
        taskUrl += Object.entries(task.data as Record<string, string>)
            .filter(([key]) => key !== "gamificationOptions" && key !== "gamificationType" && key !== "outputs")
            .concat(Object.entries((task.outputs) || {}))
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&")
        taskUrl += `&responsePath=${encodeURIComponent(`${process.env.APP_URL}/api/instance/complete`)}`
        taskUrl += `&flowElementInstanceId=${task.id}`
        taskUrl += `&userId=${userId}`
        return taskUrl
    }

    const taskUrl: string | null = await buildTaskUrl(currentTask, session.user.id)

    return currentTask && <>
        {currentTask && taskUrl ? (
            <TaskFrame taskId={currentTask.id.toString()} taskUrl={taskUrl} teamId={params.teamId}/>
        ) : (
            <div>{t("couldNotFoundSelectedTask")}</div>
        )}
    </>
}
