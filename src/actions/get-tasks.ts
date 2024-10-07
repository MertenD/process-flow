"use server"

import {ManualTaskWithTitleAndDescription} from "@/types/database.types";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function(teamId: number, userId: string): Promise<ManualTaskWithTitleAndDescription[]> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // TODO Convert into rpc function call

    const { data: userRoleIds, error: userRolesError } = await supabase
        .from("profile_role_team")
        .select(`roleId: role_id`)
        .eq("profile_id", userId)
        .eq("team_id", teamId)
        .returns<{ roleId: number }[]>()

    if (userRolesError || !userRoleIds) {
        throw Error(userRolesError?.message)
    }

    const {data: tasks, error: tasksError} = await supabase
        .from("manual_task")
        .select(`*, name: data->task, description: data->description`)
        .eq("belongs_to", teamId)
        .filter("assigned_role", "in", `(${userRoleIds.map(role => `"${role.roleId}"`).join(",")})`)
        .returns<ManualTaskWithTitleAndDescription[]>()

    if (tasksError) {
        throw Error(tasksError?.message)
    }

    return tasks || []
}