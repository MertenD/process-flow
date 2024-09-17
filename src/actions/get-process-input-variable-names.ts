"use server"

import {createClient} from "@/utils/supabase/server";
import {NodeTypes} from "@/model/NodeTypes";

export default async function(processModelId: number): Promise<string[]> {

    const supabase = createClient()

    const { data, error } = await supabase
        .from("flow_element")
        .select("inputVariableNames: data->outputs")
        .eq("type", NodeTypes.START_NODE)
        .eq("model_id", processModelId)
        .single<{ inputVariableNames: { [key: string]: string }}>()

    if (error || !data) {
        throw Error(error?.message || "Error fetching process model")
    }

    return Object.values(data.inputVariableNames)
}