"use server"

import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";

export default async function(flowElementInstanceId: number, outputData: any, completedBy: string): Promise<boolean> {

    // TODO Das soll in eine einzelne Transaktion zusammengefasst werden

    const cookieStore = cookies()
    const supabase = createClient(cookieStore, process.env.SUPABASE_SERVICE_KEY)

    let { data, error } = await supabase
        .rpc('complete_flow_element_instance', {
            flow_element_instance_id_param: flowElementInstanceId,
            output_data: outputData,
            completed_by_param: completedBy
        }).single<boolean>()

    if (error || !data) {
        throw Error(error?.message || "Error completing flow element instance")
    }

    let { data: _ , error: gamificationOptionsError } = await supabase
        .rpc('apply_gamification', {
            "profile_id_param": completedBy,
            "flow_element_instance_id_param": flowElementInstanceId,
        }).single()

    if (gamificationOptionsError) {
        console.log(gamificationOptionsError)
        throw Error(gamificationOptionsError.message)
    }

    return data
}