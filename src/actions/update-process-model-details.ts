"use server"

import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function(processModelId: number, newName: string, newDescription: string): Promise<void> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {data: _, error} = await supabase
        .from('process_model')
        .update({name: newName, description: newDescription})
        .eq('id', processModelId)

    if (error) {
        console.error(error)
        throw new Error("Failed to update appearance settings")
    }
}