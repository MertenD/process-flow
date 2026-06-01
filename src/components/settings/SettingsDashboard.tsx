"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileSettings from "@/components/settings/ProfileSettings"
import AppearanceSettings from "@/components/settings/AppearanceSettings"
import { Profile } from "@/model/database/database.types"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/ui/loadingSpinner"
import getProfile from "@/actions/get-profile"

export interface SettingsDashboardProps {
    userId: string
}

export function SettingsDashboard({ userId }: Readonly<SettingsDashboardProps>) {

    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        getProfile(userId).then(setProfile)
    }, [userId])

    return profile ? (
        <div className="grid md:grid-cols-2 w-full gap-4">
            <ProfileSettings profile={profile}/>
            <AppearanceSettings profile={profile} />
        </div>
    ) : <div className="w-full h-full flex flex-col justify-center items-center">
        <LoadingSpinner/>
    </div>
}
