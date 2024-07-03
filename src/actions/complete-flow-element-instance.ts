"use server"

import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";

export default async function(flowElementInstanceId: number, outputData: any): Promise<boolean> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore, process.env.SUPABASE_SERVICE_KEY)

    let { data, error } = await supabase
        .rpc('complete_flow_element_instance', {
            flow_element_instance_id_param: flowElementInstanceId,
            output_data: outputData
        }).single<boolean>()

    if (error || !data) {
        throw Error(error?.message || "Error completing flow element instance")
    }

    return data
}