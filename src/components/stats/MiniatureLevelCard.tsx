"use client"

import {LevelProgressBar} from "@/components/stats/LevelProgressBar";
import React, {useState} from "react";

export interface MiniatureLevelBarProps {
    experience: number
    experiencePerLevel: number
}

export default function MiniatureLevelCard({ experience, experiencePerLevel }: MiniatureLevelBarProps) {

    const [level, setLevel] = useState<number>(Math.floor(experience / experiencePerLevel) + 1)

    return <div className="w-32 flex flex-col space-y-1">
        <div className="flex flex-row justify-between">
            <p className="text-xs font-semibold">Level { level }</p>
            <p className="text-xs font-semibold">{ experience } / { experiencePerLevel * (Math.ceil(experience / experiencePerLevel)) } XP</p>
        </div>
        <LevelProgressBar
            experience={experience}
            experiencePerLevel={experiencePerLevel}
            color="bg-green-500"
            setLevel={setLevel}
            className="h-2"
        />
    </div>
}