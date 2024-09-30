"use server"

import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function(profileId: string, newLanguage: string, newIsDarkModeEnabled: boolean): Promise<void> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {data: _, error} = await supabase
        .from('profiles')
        .update({language: newLanguage, is_dark_mode_enabled: newIsDarkModeEnabled})
        .eq('id', profileId)

    if (error) {
        console.error(error)
        throw new Error("Failed to update appearance settings")
    }
}