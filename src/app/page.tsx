import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase/server";
import React from "react";
import {TeamsOverview} from "@/components/home/TeamsOverview";
import AuthButton from "@/components/AuthButton";
import Link from "next/link";
import {TeamInfo} from "@/model/TeamInfo";
import {InvitationWithTeam} from "@/types/database.types";
import getTeams from "@/actions/get-teams";
import getInvitations from "@/actions/get-invitations";

export default async function Home() {

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/authenticate")
    }

    const teams: TeamInfo[] = await getTeams(userData.user.id)
    const invitations: InvitationWithTeam[] = await getInvitations(userData.user.email || "")

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
                        <TeamsOverview
                            userId={userData.user.id}
                            userEmail={userData.user.email || ""}
                            initialTeams={teams || []}
                            initialInvitations={invitations || []} />
                    </div>
                ) : (
                    <Link href={"/authenticate"}>Sign in</Link>
                ) }
            </div>
        </div>
    </div>
}