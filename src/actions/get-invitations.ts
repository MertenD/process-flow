"use server"

import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";
import {InvitationWithTeam} from "@/model/database/database.types";

export default async function(userEmail: string): Promise<InvitationWithTeam[]> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: invitations, error } = await supabase
        .from('invitation')
        .select("*, team:team_id ( *, colorSchemeFrom: color_scheme->from, colorSchemeTo: color_scheme->to )")
        .eq('email', userEmail)
        .returns<InvitationWithTeam[]>()

    if (error) {
        throw Error(error?.message || "Error loading invitations")
    }

    return invitations || []
}