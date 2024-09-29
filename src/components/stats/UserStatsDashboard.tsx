import React from 'react'
import LevelCard from "@/components/stats/LevelCard";
import CoinsCard from "@/components/stats/CoinsCard";
import {UserStats} from "@/model/UserStats";
import BadgesCard from "@/components/stats/BadgesCard";


interface UserStatsDashboardProps {
    stats: UserStats;
}

export default function UserStatsDashboard({stats}: UserStatsDashboardProps) {

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <LevelCard
                    experience={stats.experience}
                    experiencePerLevel={stats.experiencePerLevel}
                />
                <CoinsCard coins={stats.coins}/>
            </div>
            <BadgesCard badges={stats.badges}/>
        </div>
    )
}