"use client"

import {User} from "@supabase/auth-js";
import {Page} from "@/model/database/database.types";
import HomeButton from "@/components/headerbar/HomeButton";
import ResponsiveNavigation from "@/components/ResponsiveNavigation";
import ResponsiveMiniaturLevelCard from "@/components/ResponsiveMiniaturLevelCard";
import {Button} from "@/components/ui/button";
import {Menu, X} from "lucide-react";
import React, {useState} from "react";
import TeamSwitcher, {Team} from "@/components/headerbar/TeamSwitcher";
import {useTranslations} from "next-intl";

export interface MobileHeaderBarProps {
    selectedTeamId: number
    user: User
    ownTeams: Team[]
    otherTeams: Team[]
    allowedPages: Page[]
    userNav: React.ReactNode
}

export default function MobileHeaderBar({ selectedTeamId, ownTeams, otherTeams, user, allowedPages, userNav }: Readonly<MobileHeaderBarProps>) {

    const t = useTranslations("Header")
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return <div className={`mx-auto ${mobileMenuOpen ? "" : "shadow-sm border-b"}`}>
        <div className="flex justify-between h-16 px-4 w-full">
            <div className="flex w-full">
                <div className="flex-shrink-0 flex items-center">
                    <HomeButton/>
                </div>
                <div className="flex items-center w-full">
                    <TeamSwitcher
                        ownTeams={ownTeams}
                        otherTeams={otherTeams}
                        selectedTeamId={selectedTeamId}
                        className="w-full max-w-[300px]"
                    />
                </div>
            </div>
            <div className="ml-6 flex items-center">
                <Button
                    variant="ghost"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className="block h-6 w-6" aria-hidden="true"/>
                    ) : (
                        <Menu className="block h-6 w-6" aria-hidden="true"/>
                    )}
                </Button>
            </div>
        </div>

        {mobileMenuOpen && (
            <div className={`w-full pb-3 space-y-4 bg-card border-b border-gray-200 rounded-b-lg shadow-sm`}>
                <div className="pt-4 pl-1">
                    <div className="flex items-center px-4 space-x-4">
                        <div className="flex-shrink-0">
                            {userNav}
                        </div>
                        <ResponsiveMiniaturLevelCard userId={user.id} teamId={selectedTeamId}/>
                    </div>
                </div>
                <div className="px-4">
                    <ResponsiveNavigation
                        allowedPages={allowedPages}
                        selectedTeamId={selectedTeamId}
                        className="flex flex-col space-y-2"
                    />
                </div>
            </div>
        )}
    </div>
}