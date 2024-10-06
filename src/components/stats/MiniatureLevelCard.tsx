"use client"

import {LevelProgressBar} from "@/components/stats/LevelProgressBar";
import React, {useEffect, useState} from "react";
import {UserStats} from "@/model/UserStats";
import getUserStatistics from "@/actions/get-user-statistics";
import {createClient} from "@/utils/supabase/client";

export interface MiniatureLevelCardProps {
    userId: string,
    teamId: number
}

export default function MiniatureLevelCard({ userId, teamId }: MiniatureLevelCardProps) {

    const [userStats, setUserStats] = useState<UserStats | undefined>(undefined)
    const [level, setLevel] = useState<number>(1)
    const [pointsToReachNextLevel, setPointsToReachNextLevel] = useState<number>(100)

    const supabase = createClient()

    useEffect(() => {
        getUserStatistics(userId, teamId).then(setUserStats).catch((error) => {
            console.error("Error fetching user statistics", error)
        })
    }, [teamId, userId]);
    
    useEffect(() => {
        const updateSubscription = supabase
            .channel("miniature_level_card_update")
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "statistics",
                filter: `profile_id=eq.${userId}`
            }, (payload) => {
                getUserStatistics(userId, teamId).then(setUserStats)
            })
            .subscribe()

        return () => {
            updateSubscription.unsubscribe().then()
        }

    }, [supabase, userId, teamId]);

    useEffect(() => {
        if (userStats) {
            setPointsToReachNextLevel(userStats.experiencePerLevel * (Math.floor(userStats.experience / userStats.experiencePerLevel) + 1))
        }
    }, [level, userStats]);

    return userStats && <div className="w-32 flex flex-col space-y-1">
        <div className="flex flex-row justify-between">
            <p className="text-xs font-semibold">Level { level }</p>
            <p className="text-xs font-semibold">{ userStats.experience } / { pointsToReachNextLevel } XP</p>
        </div>
        <LevelProgressBar
            experience={userStats.experience}
            experiencePerLevel={userStats.experiencePerLevel}
            color="bg-green-600"
            setLevel={setLevel}
            className="h-2"
        />
    </div>
}