import {createClient} from "@/utils/supabase/server";
import React from "react";
import {ManualTaskWithTitleDescriptionAndOutputs} from "@/types/database.types";
import TaskFrame from "@/app/[teamId]/tasks/[taskId]/TaskFrame";
import {redirect} from "next/navigation";
import getTasks from "@/actions/get-tasks";
import {getTranslations} from "next-intl/server";

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

    async function buildTaskUrl(task: ManualTaskWithTitleDescriptionAndOutputs | undefined, userId: string): Promise<string | null> {
        if (task == null) return null
        let taskUrl = task.execution_url
        taskUrl += "?"

        if (!task.data) {
            return null
        }

        // TODO URL encode values and keys in task.data to prevent errors in the URL query string (e.g. if a value contains a "+")
        taskUrl += Object.entries(task.data)
            .filter(([key, value]) =>
                key !== "gamificationOptions" &&
                key !== "gamificationType" &&
                key !== "outputs"
            )
            .concat(Object.entries((task.outputs) || {}))
            .map(([key, value]) => `${key}=${value}`).join("&")

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
