"use server"

import {ManualTask} from "@/types/database.types";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function(teamId: string): Promise<ManualTask[]> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {data: tasks, error: tasksError} = await supabase
        .from("manual_task")
        .select(`*`)
        .eq("belongs_to", teamId)
        .returns<ManualTask[]>()

    if (tasksError || !tasks) {
        throw Error(tasksError.message)
    }

    return tasks
}