"use server"

import {ManualTask, ManualTaskWithTitleAndDescription} from "@/types/database.types";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function(teamId: string): Promise<ManualTaskWithTitleAndDescription[]> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {data: tasks, error: tasksError} = await supabase
        .from("manual_task")
        .select(`*, name: data->task, description: data->description`)
        .eq("belongs_to", teamId)
        .returns<ManualTaskWithTitleAndDescription[]>()

    if (tasksError || !tasks) {
        throw Error(tasksError.message)
    }

    return tasks
}