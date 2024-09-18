"use server"

import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";
import {TeamInfo} from "@/model/TeamInfo";

export default async function(userId: string): Promise<TeamInfo[]> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: teams, error } = await supabase
        .from('profile_team')
        .select('profileId:profile_id, teamId:team_id, team ( createdBy: created_by, ' +
            'name, colorSchemeFrom: color_scheme->from, colorSchemeTo: color_scheme->to ' +
            ')')
        .eq('profile_id', userId)
        .returns<TeamInfo[]>()

    if (error || !teams) {
        throw Error(error?.message || "Error loading teams")
    }

    return teams
}