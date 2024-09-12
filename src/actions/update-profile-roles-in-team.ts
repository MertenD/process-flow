"use server"

import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";

export default async function(teamId: number, profileId: string, roleIds: number[]): Promise<void> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase
        .rpc('update_profiles_roles_in_team', {
            team_id_param: teamId,
            profile_id_param: profileId,
            role_ids_param: roleIds
        }).single()

    if (error) {
        throw Error(error.message)
    }
}