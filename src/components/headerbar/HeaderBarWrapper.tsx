import React from 'react';
import {createClient} from "@/utils/supabase/server";
import getAllowedPages from "@/actions/get-allowed-pages";
import {redirect} from "next/navigation";
import {Page} from "@/model/database/database.types";
import DesktopHeaderBar from "@/components/headerbar/DesktopHeaderBar";
import MobileHeaderBar from "@/components/headerbar/MobileHeaderBar";
import {UserNav} from "@/components/headerbar/UserNav";

export type TeamWithColorSchema = {
    profileId: string,
    teamId: string,
    team: {
        name: string,
        createdBy: string,
        colorSchemeFrom: string,
        colorSchemeTo: string
    }
}

export interface HeaderBarProps {
    selectedTeamId: number
}

export default async function HeaderBarWrapper({ selectedTeamId }: Readonly<HeaderBarProps>) {

    const supabase = createClient()

    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user || !userData.user?.id) {
        redirect("/authenticate")
    }

    const { data: teams } = await supabase
        .from('profile_team')
        .select('profileId:profile_id, teamId:team_id, team ( name, createdBy: created_by, colorSchemeFrom: color_scheme->from, colorSchemeTo: color_scheme->to )')
        .eq('profile_id', userData.user?.id || "")
        .returns<TeamWithColorSchema[]>()

    const ownTeams = teams?.filter(team => team.team.createdBy === userData.user.id).map(team => ({
        label: team.team.name,
        value: team.teamId,
        colorSchema: { from: team.team.colorSchemeFrom, to: team.team.colorSchemeTo }
    })) ?? []

    const otherTeams = teams?.filter(team => team.team.createdBy !== userData.user.id).map(team => ({
        label: team.team.name,
        value: team.teamId,
        colorSchema: { from: team.team.colorSchemeFrom, to: team.team.colorSchemeTo }
    })) ?? []

    const allowedPages: Page[] = await getAllowedPages(selectedTeamId, userData.user.id)

    return <header>
        <div className="hidden lg:block">
            <DesktopHeaderBar
                selectedTeamId={selectedTeamId}
                user={userData.user}
                ownTeams={ownTeams}
                otherTeams={otherTeams}
                allowedPages={allowedPages}
            />
        </div>
        <div className="block lg:hidden">
            <MobileHeaderBar
                selectedTeamId={selectedTeamId}
                user={userData.user}
                ownTeams={ownTeams}
                otherTeams={otherTeams}
                allowedPages={allowedPages}
                userNav={<UserNav />}
            />
        </div>
    </header>
}