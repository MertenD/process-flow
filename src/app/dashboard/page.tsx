import { redirect } from "next/navigation"
import React from "react"
import { TeamsOverview } from "@/components/dashboard/TeamsOverview"
import { TeamInfo } from "@/model/TeamInfo"
import { InvitationWithTeam } from "@/model/database/database.types"
import getTeams from "@/actions/get-teams"
import getInvitations from "@/actions/get-invitations"
import { getTranslations } from "next-intl/server"
import { UserNav } from "@/components/dashboard/UserNav"
import { requireSession } from "@/lib/session"

export default async function Home() {
    const t = await getTranslations("Homepage")

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    const { user } = session
    const teams: TeamInfo[] = await getTeams(user.id)
    const invitations: InvitationWithTeam[] = await getInvitations(user.email)

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">{t("title")}</h1>
                    <p className="text-xl">{t("titleDescription")}</p>
                </div>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">{t("teamDashboardTitle")}</h2>
                        <div className="flex items-center gap-4">
                            Hey, {user.name}!
                            <UserNav />
                        </div>
                    </div>
                    <TeamsOverview
                        userId={user.id}
                        userEmail={user.email}
                        initialTeams={teams}
                        initialInvitations={invitations}
                    />
                </div>
            </div>
        </div>
    )
}
