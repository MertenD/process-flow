"use server"

import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function(creatorId: string, teamName: string, colorScheme: { from: string, to: string }): Promise<number> {

    if (!creatorId || !teamName) {
        throw new Error("Invalid form data, requires creatorId as string and teamName as string")
    }

    if (teamName.length < 3) {
        throw new Error("Team name must be at least 3 characters long")
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    let { data, error } = await supabase
        .rpc('create_team_and_add_creator_as_admin', {
            creator_profile_id: creatorId,
            team_name: teamName,
            color_scheme: colorScheme
        })

    if (error || !data) {
        console.error("error", error)
        throw Error(error?.message)
    }

    return data
}
