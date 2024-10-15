import React from 'react';
import Navigation from "@/components/headerbar/Navigation";
import TeamSwitcher from "@/components/headerbar/TeamSwitcher";
import {UserNav} from "@/components/headerbar/UserNav";
import {createClient} from "@/utils/supabase/server";
import HomeButton from "@/components/headerbar/HomeButton";
import getAllowedPages from "@/actions/get-allowed-pages";
import {redirect} from "next/navigation";
import MiniatureLevelCard from "@/components/stats/MiniatureLevelCard";
import {Page} from "@/model/database/database.types";

export interface HeaderBarProps {
    selectedTeamId: number
}

export default async function HeaderBar({ selectedTeamId }: Readonly<HeaderBarProps>) {

    const supabase = createClient()

    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user || !userData.user?.id) {
        redirect("/authenticate")
    }

    const { data: teams } = await supabase
        .from('profile_team')
        .select('profileId:profile_id, teamId:team_id, team ( name, createdBy: created_by, colorSchemeFrom: color_scheme->from, colorSchemeTo: color_scheme->to )')
        .eq('profile_id', userData.user?.id || "")
        .returns<{ profileId : string, teamId: string, team: { name: string, createdBy: string, colorSchemeFrom: string, colorSchemeTo: string } }[]>()

    const allowedPages: Page[] = await getAllowedPages(selectedTeamId, userData.user.id)

    return (
        <section className="navigationBar">
            <div className="border-b">
                <div className="flex h-16 items-center px-4">

                    <HomeButton />
                    { userData.user && <TeamSwitcher ownTeams={teams?.filter(team => team.team.createdBy === userData.user.id).map(team => {
                        return {
                            label: team.team.name,
                            value: team.teamId,
                            colorSchema: { from: team.team.colorSchemeFrom, to: team.team.colorSchemeTo }
                        }
                    }) ?? []} otherTeams={teams?.filter(team => team.team.createdBy !== userData.user.id).map(team => {
                        return {
                            label: team.team.name,
                            value: team.teamId,
                            colorSchema: { from: team.team.colorSchemeFrom, to: team.team.colorSchemeTo }
                        }
                    }) ?? []} selectedTeamId={selectedTeamId} /> }
                    <Navigation
                        allowedPages={allowedPages}
                        className="mx-6" selectedTeamId={selectedTeamId}
                    />
                    <div className="ml-auto flex items-center space-x-6">
                        <MiniatureLevelCard userId={userData.user.id} teamId={selectedTeamId} />
                        <UserNav/>
                    </div>
                </div>
            </div>
        </section>
    )
}