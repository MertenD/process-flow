"use server"

import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function(profileId: string, newName: string, newAvatar: string): Promise<void> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {data: _, error} = await supabase
        .from('profiles')
        .update({username: newName, avatar: newAvatar})
        .eq('id', profileId)

    if (error) {
        console.error(error)
        throw new Error("Failed to update profile settings")
    }
}