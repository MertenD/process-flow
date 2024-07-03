"use server"

import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";

export default async function(processModelId: number): Promise<{processInstanceId: number}> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    let { data, error } = await supabase
        .rpc('create_process_instance', {
            process_model_id_param: processModelId
        }).single<number>()

    if (error || !data) {
        throw Error(error?.message || "Error creating process instance")
    }

    return {
        processInstanceId: data,
    }
}