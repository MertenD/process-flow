"use client"

import { LevelProgressBar } from "@/components/stats/LevelProgressBar"
import React, { useEffect, useState } from "react"
import { UserStats } from "@/model/UserStats"
import getUserStatistics from "@/actions/get-user-statistics"

export interface MiniatureLevelCardProps {
    userId: string
    teamId: number
}

export default function MiniatureLevelCard({ userId, teamId }: MiniatureLevelCardProps) {

    const [userStats, setUserStats] = useState<UserStats | undefined>(undefined)
    const [level, setLevel] = useState<number>(1)
    const [pointsToReachNextLevel, setPointsToReachNextLevel] = useState<number>(100)

    useEffect(() => {
        getUserStatistics(userId, teamId).then(setUserStats).catch((error) => {
            console.error("Error fetching user statistics", error)
        })
    }, [teamId, userId])

    useEffect(() => {
        if (userStats) {
            setPointsToReachNextLevel(userStats.experiencePerLevel * (Math.floor(userStats.experience / userStats.experiencePerLevel) + 1))
        }
    }, [level, userStats])

    return userStats && <div className="w-full flex flex-col space-y-1">
        <div className="flex flex-row justify-between">
            <p className="text-xs font-semibold">Level {level}</p>
            <p className="text-xs font-semibold">{userStats.experience} / {pointsToReachNextLevel} XP</p>
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
