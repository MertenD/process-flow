"use server"

import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";
import {InvitationWithTeam} from "@/types/database.types";

export default async function(invitationWithTeam: InvitationWithTeam, userId: string): Promise<void> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    let { error } = await supabase
        .from("invitation")
        .delete()
        .eq("id", invitationWithTeam.id)

    if (error) {
        throw Error(error.message)
    }
}