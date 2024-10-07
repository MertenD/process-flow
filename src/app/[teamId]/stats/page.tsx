import UserStatsDashboard from "@/components/stats/UserStatsDashboard";
import React from "react";
import {UserStats} from "@/model/UserStats";
import getUserStatistics from "@/actions/get-user-statistics";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

export default async function StatsPage({ params }: Readonly<{ params: { teamId: number } }>) {

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user || !userData.user?.id) {
        redirect("/authenticate")
    }

    const userStats: UserStats | null = await getUserStatistics(userData.user.id, params.teamId).catch(e => {
        console.error("Error while fetching user statistics", e, userData.user.id, params.teamId)
        return null
    })

    return userStats ? ( <div className="container mx-auto p-4 flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Deine Statistiken</h1>
        <UserStatsDashboard stats={userStats}/>
    </div> ) : <div className="w-full h-full flex justify-center items-center">No stats found</div>
}