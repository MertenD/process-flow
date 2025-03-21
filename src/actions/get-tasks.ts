"use server"

import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";
import {ManualTaskWithOutputs} from "@/model/database/database.types";

export default async function(teamId: number, userId: string): Promise<ManualTaskWithOutputs[]> {

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

    const roleIds = userRoleIds.map(role => role.roleId);

    const {data, error} = await supabase
        .rpc('get_manual_tasks_with_replaced_data', {
            team_id: teamId,
            user_role_ids: roleIds
        })

    if (error) {
        throw Error(`Error loading manual tasks: ${error.message}`);
    }

    return (data || []) as ManualTaskWithOutputs[];
}