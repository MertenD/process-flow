"use server"

import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";

export default async function(roleName: string, teamId: number, color: string): Promise<number> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    let { data, error } = await supabase
        .rpc('add_role', {
            name_param: roleName,
            color_param: color,
            belongs_to_param: teamId
        }).single<number>()

    if (error || !data) {
        throw Error(error?.message || "Error adding role")
    }

    return data
}