"use client"

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import ProfileSettings from "@/components/settings/ProfileSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import {Profile} from "@/model/database/database.types";
import {createClient} from "@/utils/supabase/client";
import {useEffect, useState} from "react";
import {LoadingSpinner} from "@/components/ui/loadingSpinner";

export interface SettingsDashboardProps {
    userId: string
}

export function SettingsDashboard({ userId }: Readonly<SettingsDashboardProps>) {

    const supabase = createClient()
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single<Profile>()
            .then(({ data, error }) => {
                if (!error && data) {
                    setProfile(data)
                }
            })
    }, [supabase, userId]);

    useEffect(() => {
        if (!profile) return

        const subscription = supabase
            .channel("profile_updates")
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "profiles",
                filter: `id=eq.${profile.id}`
            }, (payload) => {
                setProfile({
                    avatar: profile.avatar,
                    ...payload.new
                } as Profile)
            })
            .subscribe()

        return () => {
            subscription.unsubscribe().then()
        }
    }, [profile, supabase]);

    return profile ? (
        <div className="grid md:grid-cols-2 w-full gap-4">
            <ProfileSettings profile={profile}/>
            <AppearanceSettings profile={profile} />
        </div>
    ) : <div className="w-full h-full flex flex-col justify-center items-center">
        <LoadingSpinner/>
    </div>
}