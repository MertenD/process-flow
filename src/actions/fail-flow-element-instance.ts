"use server"

import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";

export default async function(flowElementInstanceId: number, errorMessage: string): Promise<void> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore, process.env.SUPABASE_SERVICE_KEY)

    let { data, error } = await supabase
        .rpc('fail_flow_element_instance', {
            flow_element_instance_id_param: flowElementInstanceId,
            error_message: errorMessage
        }).single()

    if (error) {
        throw Error(error?.message || "Error failing flow element instance")
    }
}