import HomeButton from "@/components/headerbar/HomeButton";
import TeamSwitcher, {Team} from "@/components/headerbar/TeamSwitcher";
import Navigation from "@/components/headerbar/Navigation";
import MiniatureLevelCard from "@/components/stats/MiniatureLevelCard";
import {UserNav} from "@/components/headerbar/UserNav";
import React from "react";
import {User} from "@supabase/auth-js";
import {Page} from "@/model/database/database.types";

export interface DesktopHeaderBarProps {
    selectedTeamId: number
    user: User
    ownTeams: Team[]
    otherTeams: Team[]
    allowedPages: Page[]
}

export default function DesktopHeaderBar({ selectedTeamId, user, ownTeams, otherTeams, allowedPages }: Readonly<DesktopHeaderBarProps>) {

    return <div className="border-b shadow-sm">
        <div className="flex h-16 items-center px-4">
            <HomeButton/>
            <TeamSwitcher
                ownTeams={ownTeams} otherTeams={otherTeams} selectedTeamId={selectedTeamId}/>
            <Navigation
                allowedPages={allowedPages}
                className="mx-6" selectedTeamId={selectedTeamId}
            />
            <div className="ml-auto flex items-center space-x-6">
                <div className="hidden lg:block">
                    <MiniatureLevelCard userId={user.id} teamId={selectedTeamId}/>
                </div>
                <UserNav selectedTeamId={selectedTeamId} />
            </div>
        </div>
    </div>
}