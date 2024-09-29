import UserStatsDashboard from "@/components/stats/UserStatsDashboard";
import React from "react";
import {UserStats} from "@/model/UserStats";

export default function StatsPage() {

    const exampleStats: UserStats = {
        experience: 220,
        experiencePerLevel: 100,
        coins: 1234,
        badges: ["Fleißige Biene", "Teamplayer", "Früher Vogel"]
    }

    return <div className="container mx-auto p-4 flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Deine Statistiken</h1>
        <UserStatsDashboard stats={exampleStats}/>
    </div>
}