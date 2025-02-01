import {createClient} from "@/utils/supabase/server";
import React from "react";
import TaskFrame from "@/components/tasks/TaskFrame";
import {redirect} from "next/navigation";
import getTasks from "@/actions/get-tasks";
import {getTranslations} from "next-intl/server";
import {ManualTaskWithOutputs} from "@/model/database/database.types";

// TODO Generell middleware um zu überprüfen, ob man auf gewisse Routen zugriff hat

export default async function SelectedTasksPage({ params }: Readonly<{ params: { taskId: string, teamId: number } }>) {

    const t = await getTranslations("tasks")

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user || !userData.user.id) {
        redirect("/authenticate")
    }

    const tasks = await getTasks(params.teamId, userData.user.id)
    const currentTask = tasks?.find(task => task.id.toString() === params.taskId)

    async function buildTaskUrl(task: ManualTaskWithOutputs | undefined, userId: string): Promise<string | null> {
        if (task == null) return null
        let taskUrl = task.execution_url
        taskUrl += "?"

        if (!task.data) {
            return null
        }

        taskUrl += Object.entries(task.data)
            .filter(([key, value]) =>
                key !== "gamificationOptions" &&
                key !== "gamificationType" &&
                key !== "outputs"
            )
            .concat(Object.entries((task.outputs) || {}))
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&")

        taskUrl += `&responsePath=${encodeURIComponent(`${process.env.APP_URL}/api/instance/complete`)}`
        taskUrl += `&flowElementInstanceId=${task.id}`
        taskUrl += `&userId=${userId}`
        return taskUrl
    }

    const taskUrl: string | null = await buildTaskUrl(currentTask, userData.user.id)

    return currentTask && <>
        { currentTask && taskUrl ? (
            <TaskFrame taskId={currentTask.id.toString()} taskUrl={taskUrl}  teamId={params.teamId}/>
        ) : (
            <div>
                {t("couldNotFoundSelectedTask")}
            </div>
        ) }
    </>
}
