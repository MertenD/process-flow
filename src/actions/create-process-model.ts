"use server"

import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";

export default async function(teamId: string, name: string, description: string, creatorId: string): Promise<number> {

    if (!name) {
        throw new Error("Invalid form data, requires name as string")
    }

    if (name.length < 3) {
        throw new Error("Process name must be at least 3 characters long")
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    let { data, error } = await supabase
        .rpc('create_process_model', {
            belongs_to_param: teamId,
            name_param: name,
            description_param: description,
            created_by_param: creatorId
        })

    if (error) {
        throw Error(error.message)
    }

    return data
}