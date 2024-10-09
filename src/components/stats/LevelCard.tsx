"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React, {useEffect, useState} from "react";
import {LevelProgressBar} from "@/components/stats/LevelProgressBar";
import {useTranslations} from "next-intl";

export interface LevelCardProps {
    experience: number;
    experiencePerLevel: number;
}

export default function LevelCard({ experience, experiencePerLevel }: LevelCardProps) {

    const t = useTranslations("stats.levelCard")

    const [level, setLevel] = useState<number>(Math.floor(experience / experiencePerLevel) + 1)

    return <Card>
        <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold mb-2">{t("level", { level: level })}</div>
            <LevelProgressBar
                experience={experience}
                experiencePerLevel={experiencePerLevel}
                setLevel={setLevel}
                color="bg-green-600"
            />
            <div className="text-sm text-muted-foreground mt-2">
                {t("xpToNextLevel", { xp: experience, xpToNextLevel: experiencePerLevel * (Math.ceil(experience / experiencePerLevel)) })}
            </div>
        </CardContent>
    </Card>
}