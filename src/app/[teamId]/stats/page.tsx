import UserStatsDashboard from "@/components/stats/UserStatsDashboard"
import React from "react"
import { UserStats } from "@/model/UserStats"
import getUserStatistics from "@/actions/get-user-statistics"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { requireSession } from "@/lib/session"

export default async function StatsPage({ params }: Readonly<{ params: Promise<{ teamId: string }> }>) {

    const { teamId: _teamId } = await params
    const teamId = Number(_teamId)

    const t = await getTranslations("stats")

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    const userStats: UserStats | null = await getUserStatistics(session.user.id, teamId).catch(e => {
        console.error("Error while fetching user statistics", e)
        return null
    })

    return userStats ? (<div className="w-full h-full overflow-y-auto">
        <div className="container mx-auto p-4 flex flex-col space-y-6">
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <UserStatsDashboard stats={userStats}/>
        </div>
    </div>) : <div className="w-full h-full flex justify-center items-center">{t("noStats")}</div>
}
