import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase/server";
import React from "react";
import {TeamsOverview} from "@/components/home/TeamsOverview";
import AuthButton from "@/components/AuthButton";
import Link from "next/link";
import {TeamInfo} from "@/model/TeamInfo";

export default async function Home() {

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/authenticate")
    }

    const { data: teams } = await supabase
        .from('profile_role_team')
        .select('profileId:profile_id, teamId:team_id, team ( ' +
            'name, colorSchemeFrom: color_scheme->from, colorSchemeTo: color_scheme->to ' +
        ')')
        .eq('profile_id', userData.user?.id)
        .returns<TeamInfo[]>()

    return <div>
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">ProcessFlow</h1>
                    <p className="text-xl text-gray-600">Die Engine für gamifizierte Businessprozesse</p>
                </div>
                { userData ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Team Dashboard</h2>
                            <AuthButton />
                        </div>
                        <TeamsOverview userId={userData.user.id} teams={teams || []} invitations={[]} />
                    </div>
                ) : (
                    <Link href={"/authenticate"}>Sign in</Link>
                ) }
            </div>
        </div>
    </div>
}