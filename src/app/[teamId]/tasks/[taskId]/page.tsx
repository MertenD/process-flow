import {createClient} from "@/utils/supabase/server";
import React from "react";
import {ManualTaskWithOutputs} from "@/types/database.types";
import TaskFrame from "@/app/[teamId]/tasks/[taskId]/TaskFrame";
import {redirect} from "next/navigation";

// TODO Generell middleware um zu überprüfen, ob man auf gewisse Routen zugriff hat

// TODO Ändern vom Prozess modell hat aktuell auswirkungen auf die tasks, da die tasks anhand des prozess modells erstellt werden

export default async function SelectedTasksPage({ params }: Readonly<{ params: { taskId: string, teamId: string } }>) {

    // TODO Live Update der tasks, wenn sich eine task in der db updated. Dadurch möchte ich erkennen, sobald eine Aufgabe abgeschlossen worden ist und sie schließen, falls die offen ist. Gerne auhc mit schöner Asbchluss animation

    // TODO Completed tasks handeln

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/authenticate")
    }

    const {data: tasks, error: tasksError} = await supabase
        .from("manual_task")
        .select(`*, outputs: data->outputs`)
        .eq("belongs_to", params.teamId)
        .returns<ManualTaskWithOutputs[]>()

    const task = tasks?.find(task => task.id.toString() === params.taskId)

    function buildTaskUrl(task: ManualTaskWithOutputs | undefined): string | null {
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
        // TODO Nicht host hardcoden
        taskUrl += `&responsePath=${encodeURIComponent("http://localhost:3000/api/instance/complete")}`
        taskUrl += `&flowElementInstanceId=${task.id}`
        return taskUrl
    }

    const taskUrl = buildTaskUrl(task)

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
