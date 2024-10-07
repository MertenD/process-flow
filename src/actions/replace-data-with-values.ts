"use server"

import { createClient } from "@/utils/supabase/server";
import {cookies} from "next/headers";

export default async function(taskData: any, processInstanceId: number) {

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
        .rpc('replace_with_variable_values', {
            data: taskData,
            process_instance_id: processInstanceId
        });

    if (error) {
        throw new Error(`Error replacing task data: ${error.message}`);
    }

    return data;
}