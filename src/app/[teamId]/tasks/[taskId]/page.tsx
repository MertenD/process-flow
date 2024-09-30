import {createClient} from "@/utils/supabase/server";
import React from "react";
import {ManualTaskWithOutputs} from "@/types/database.types";
import TaskFrame from "@/app/[teamId]/tasks/[taskId]/TaskFrame";
import {redirect} from "next/navigation";

// TODO Generell middleware um zu überprüfen, ob man auf gewisse Routen zugriff hat

export default async function SelectedTasksPage({ params }: Readonly<{ params: { taskId: string, teamId: string } }>) {

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user || !userData.user.id) {
        redirect("/authenticate")
    }

    const {data: tasks, error: tasksError} = await supabase
        .from("manual_task")
        .select(`*, outputs: data->outputs`)
        .eq("belongs_to", params.teamId)
        .returns<ManualTaskWithOutputs[]>()

    const task = tasks?.find(task => task.id.toString() === params.taskId)

    function buildTaskUrl(task: ManualTaskWithOutputs | undefined, userId: string): string | null {
        if (task == null) return null
        let taskUrl = task.execution_url
        taskUrl += "?"
        if (task.data) {
            // TODO URL encode values and keys in task.data to prevent errors in the URL query string (e.g. if a value contains a "+")
            taskUrl += Object.entries(task.data)
                .filter(([key, value]) => key !== "gamificationOptions" && key !== "gamificationType" && key !== "outputs")
                .concat(Object.entries((task.outputs) || {}))
                .map(([key, value]) => `${key}=${value}`).join("&")
        }
        taskUrl += `&responsePath=${encodeURIComponent(`${process.env.APP_URL}/api/instance/complete`)}`
        taskUrl += `&flowElementInstanceId=${task.id}`
        taskUrl += `&userId=${userId}`
        return taskUrl
    }

    const taskUrl = buildTaskUrl(task, userData.user.id)

    return tasks && <>
        { task && taskUrl ? (
            <TaskFrame taskId={task.id.toString()} taskUrl={taskUrl}  teamId={params.teamId}/>
        ) : (
            <div>
                Could not find selected task
            </div>
        ) }
    </>
}
