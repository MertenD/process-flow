"use server"

import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";

type InputsType = {
    [key: string]: string
};

export default async function(processModelId: number, inputs: InputsType): Promise<{processInstanceId: number}> {

    const cookieStore = cookies()
    // TODO Den Key vom User bei der Anfrage verwenden wenn es über die API aufgerufen wird
    const supabase = createClient(cookieStore, process.env.SUPABASE_SERVICE_KEY)

    let { data, error } = await supabase
        .rpc('create_process_instance', {
            process_model_id_param: processModelId,
            inputs_param: inputs
        }).single<number>()

    if (error || !data) {
        throw Error(error?.message || "Error creating process instance")
    }

    return {
        processInstanceId: data,
    }
}