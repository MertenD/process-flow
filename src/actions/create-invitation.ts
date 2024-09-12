"use server"

import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function(email: string, teamId: number): Promise<number> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error} = await supabase
        .rpc('create_invitation', {
            email_param: email,
            team_id_param: teamId
        }).single<number>()

    if (error || !data) {
        throw Error(error?.message || "Error creating invitation")
    }

    return data
}