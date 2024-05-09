import React from 'react';
import Navigation from "@/components/headerbar/Navigation";
import TeamSwitcher from "@/components/TeamSwitcher";
import {UserNav} from "@/components/UserNav";
import {ThemeModeToggle} from "@/components/ui/ThemeModeToggle";
import {createClient} from "@/utils/supabase/server";

export interface HeaderBarProps {
    selectedTeamId: string
}

export default async function HeaderBar({ selectedTeamId }: Readonly<HeaderBarProps>) {

    const supabase = createClient()

    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        // TODO hide teamswitcher or something or redirect to login
    }

    const { data: teams } = await supabase
        .from('profile_role_team')
        .select('profileId:profile_id, teamId:team_id, team ( name )')
        .eq('profile_id', userData.user?.id)
        .returns<{ profileId : string, teamId: string, team: { name: string } }[]>()

    return (
        <section className="navigationBar">
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    { userData.user && <TeamSwitcher ownTeams={teams?.filter(team => team.profileId === userData.user.id).map(team => {
                        return {
                            label: team.team.name,
                            value: team.teamId
                        }
                    }) ?? []} otherTeams={teams?.filter(team => team.profileId !== userData.user.id).map(team => {
                        return {
                            label: team.team.name,
                            value: team.teamId
                        }
                    }) ?? []} userId={userData.user.id} selectedTeamId={selectedTeamId} /> }
                    { userData.user && <Navigation className="mx-6" selectedTeamId={selectedTeamId} /> }
                    <div className="ml-auto flex items-center space-x-4">
                        <UserNav/>
                        <ThemeModeToggle />
                    </div>
                </div>
            </div>
        </section>
        )
}