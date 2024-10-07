"use server"

import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";
import {Theme} from "@/types/database.types";

export default async function(profileId: string, newLanguage: string, theme: Theme): Promise<void> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {data: _, error} = await supabase
        .from('profiles')
        .update({language: newLanguage, theme: theme})
        .eq('id', profileId)

    if (error) {
        console.error(error)
        throw new Error("Failed to update appearance settings")
    }
}