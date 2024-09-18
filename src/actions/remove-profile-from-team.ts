"use server"

import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";

export default async function(teamId: number, profileId: string): Promise<void> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    let { data, error } = await supabase
        .rpc('remove_profile_from_team', {
            team_id_param: teamId,
            profile_id_param: profileId
        }).single<number>()

    if (error) {
        throw Error(error?.message || "Error removing member from team")
    }
}