"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React, {useEffect, useState} from "react";
import {LevelProgressBar} from "@/components/stats/LevelProgressBar";

export interface LevelCardProps {
    experience: number;
    experiencePerLevel: number;
}

export default function LevelCard({ experience, experiencePerLevel }: LevelCardProps) {

    const [level, setLevel] = useState<number>(Math.floor(experience / experiencePerLevel) + 1)

    return <Card>
        <CardHeader>
            <CardTitle>Fortschritt</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold mb-2">Level {level}</div>
            <LevelProgressBar
                experience={experience}
                experiencePerLevel={experiencePerLevel}
                setLevel={setLevel}
                color="bg-green-500"
            />
            <div className="text-sm text-muted-foreground mt-2">
                {experience} / {experiencePerLevel * (Math.ceil(experience / experiencePerLevel))} XP
            </div>
        </CardContent>
    </Card>
}