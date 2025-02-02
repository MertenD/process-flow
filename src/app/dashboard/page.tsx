import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase/server";
import React from "react";
import {TeamsOverview} from "@/components/dashboard/TeamsOverview";
import Link from "next/link";
import {TeamInfo} from "@/model/TeamInfo";
import {InvitationWithTeam, Profile} from "@/model/database/database.types";
import getTeams from "@/actions/get-teams";
import getInvitations from "@/actions/get-invitations";
import {getTranslations} from "next-intl/server";
import {UserNav} from "@/components/dashboard/UserNav";

export default async function Home() {

    const t = await getTranslations("Homepage")

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user || !userData.user.id) {
        console.error("User is not authenticated")
        redirect("/authenticate")
    }

    const { data: profile, error: usernameError } = await supabase
        .from("profiles")
        .select("id, username, email, avatar")
        .eq("id", userData.user.id)
        .single<Profile>()

    const teams: TeamInfo[] = await getTeams(userData.user.id)
    const invitations: InvitationWithTeam[] = await getInvitations(userData.user.email || "")

    return <div>
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">{t("title")}</h1>
                    <p className="text-xl">{t("titleDescription")}</p>
                </div>
                { userData ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">{t("teamDashboardTitle")}</h2>
                            <div className="flex items-center gap-4">
                                Hey{ profile ? `, ${profile.username}` : "" }!
                                <UserNav />
                            </div>
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