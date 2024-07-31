"use server"

import {ProcessModel} from "@/types/database.types";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function(teamId: number): Promise<ProcessModel[]> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: processModels, error } = await supabase
        .from("process_model")
        .select("*")
        .eq("belongs_to", teamId)
        .returns<ProcessModel[]>()

    if (error) {
        throw Error(error.message)
    } else if (!processModels) {
        throw Error("Error while fetching process models.")
    }

    return processModels
}