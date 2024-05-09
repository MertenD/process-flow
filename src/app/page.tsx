import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase/server";
import React from "react";

export default async function Home() {

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/login")
    }

    const { data: teams } = await supabase
        .from('profile_role_team')
        .select('profileId:profile_id, teamId:team_id, team ( name )')
        .eq('profile_id', userData.user?.id)
        .returns<{ profileId : string, teamId: string, team: { name: string } }[]>()

    async function handleTeamClicked(teamId: string) {
        "use server"

        redirect(`/${teamId}/editor`)
    }

    return <div>
        <h1>Select a Team</h1>
        <form>
            {teams?.map((team, index) => {
                return <button
                    key={`${team.teamId}`}
                    className={`w-full p-4 bg-amber-50 rounded-2`}
                    formAction={handleTeamClicked.bind(null, team.teamId)}
                >
                    { team.team.name }
                </button>
            })}
        </form>
        { /* TODO Create new Team option */ }
    </div>
}