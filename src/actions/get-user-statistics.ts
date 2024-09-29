"use server"

import {UserStats} from "@/model/UserStats";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";
import {Statistics} from "@/types/database.types";

export default async function(userId: string, teamId: number): Promise<UserStats> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: stats, error } = await supabase
        .from("statistics")
        .select("*, profile_team ( profile_id, team_id )")
        .eq("profile_team.profile_id", userId)
        .eq("profile_team.team_id", teamId)
        .single<Statistics & { profile_team: { profile_id: string, team_id: number } }>()

    if (error) {
        throw error
    }

    if (!stats) {
        throw new Error("No statistics found")
    }

    // TODO Add Badges

    return {
        experience: stats.experience,
        experiencePerLevel: 100,
        coins: stats.coins,
        badges: []
    } as UserStats
}