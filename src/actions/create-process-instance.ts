"use server"

import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";

export default async function(processModelId: string): Promise<number> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    let { data, error } = await supabase
        .rpc('create_process_instance', {
            process_model_id_param: processModelId
        })

    if (error) {
        throw Error(error.message)
    }

    return data
}