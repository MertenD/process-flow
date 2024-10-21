"use server"

import {UserStats} from "@/model/UserStats";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";
import {Statistics} from "@/model/database/database.types";

export default async function(userId: string, teamId: number): Promise<UserStats> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // TODO Hier werden manchmal zwei Ergebnisse zurückgegeben
    const { data: stats, error } = await supabase
        .from("statistics")
        .select("*, badgeNames: badges->badges")
        .eq("profile_id", userId)
        .eq("team_id", teamId)
        .single<Statistics & { badgeNames: string[] }>()

    if (error) {
        throw error
    }

    if (!stats) {
        throw new Error("No statistics found")
    }

    return {
        experience: stats.experience,
        experiencePerLevel: 100,
        coins: stats.coins,
        badges: stats.badgeNames
    } as UserStats
}