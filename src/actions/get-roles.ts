"use server"

import {ManualTask, ManualTaskWithTitleAndDescription, Role} from "@/types/database.types";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function(teamId: number): Promise<Role[]> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {data: roles, error: tasksError} = await supabase
        .from("role")
        .select(`*`)
        .eq("belongs_to", teamId)
        .returns<Role[]>()

    if (tasksError || !roles) {
        throw Error(tasksError.message)
    }

    return roles.filter(role => role.name !== "owner")
}