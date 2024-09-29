"use client"

import React, {useEffect, useState} from "react";
import {Progress} from "@/components/ui/progress";

export interface LevelProgressBarProps {
    experience: number,
    experiencePerLevel: number,
    color: string,
    setLevel?: (newLevel: number) => void
    className?: string
}

export function LevelProgressBar({ color, experience, experiencePerLevel, setLevel, className }: LevelProgressBarProps) {

    const [oldExperience, setOldExperience] = useState(experience)
    const [showingExperience, setShowingExperience] = useState(0)
    const [disableEasing, setDisableEasing] = useState(false)

    useEffect(() => {
        if (experience !== undefined) {
            const isLevelUp = Math.floor(experience / experiencePerLevel) > Math.floor(oldExperience / experiencePerLevel)
            setOldExperience(experience)
            if (isLevelUp) {
                // TODO Irgendeine Animation bei einem Level Up
                setShowingExperience(100)
                setTimeout(() => {
                    if (setLevel) {
                        setLevel(Math.floor(experience / experiencePerLevel) + 1)
                    }
                    setDisableEasing(true)
                    setShowingExperience(0)
                }, 1000)
                setTimeout(() => {
                    setDisableEasing(false)
                    setShowingExperience(experience % experiencePerLevel)
                }, 1100)
            } else {
                if (setLevel) {
                    setLevel(Math.floor(experience / experiencePerLevel) + 1)
                }
                setShowingExperience(experience % experiencePerLevel)
            }
        }
    }, [experience, experiencePerLevel])

    return <>
        <Progress
            isEasingDisabled={disableEasing}
            value={showingExperience}
            className={`w-full ${className || ""}`}
            indicatorColor={color}
        />
    </>
}