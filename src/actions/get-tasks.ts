"use server"

import {ManualTask, ManualTaskWithTitleAndDescription, ProfilesWithRoles} from "@/types/database.types";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function(teamId: number, userId: string): Promise<ManualTaskWithTitleAndDescription[]> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // TODO Convert into rpc function call

    const { data: userRoles, error: userRolesError } = await supabase
        .from("profiles_with_roles")
        .select(`roleName: role_name`)
        .eq("profile_id", userId)
        .eq("team_id", teamId)
        .returns<{ roleName: string }[]>()

    if (userRolesError || !userRoles) {
        throw Error(userRolesError?.message)
    }

    const {data: tasks, error: tasksError} = await supabase
        .from("manual_task")
        .select(`*, name: data->task, description: data->description`)
        .eq("belongs_to", teamId)
        .filter("assigned_role", "in", `(${userRoles.map(role => `"${role.roleName}"`).join(",")})`)
        .returns<ManualTaskWithTitleAndDescription[]>()

    if (tasksError || !tasks) {
        throw Error(tasksError?.message)
    }

    return tasks
}