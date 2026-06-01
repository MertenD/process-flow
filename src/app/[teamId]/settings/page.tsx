import { redirect } from "next/navigation"
import { SettingsDashboard } from "@/components/settings/SettingsDashboard"
import OwnerTeamSettings from "@/components/settings/team/OwnerTeamSettings"
import MemberTeamSettings from "@/components/settings/team/MemberTeamSettings"
import { getTranslations } from "next-intl/server"
import { requireSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export default async function SettingsPage({ params }: Readonly<{ params: { teamId: number }}>) {

    const t = await getTranslations("settings")

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    const userRoles = await prisma.profileRoleTeam.findMany({
        where: { teamId: BigInt(params.teamId), profileId: session.user.id },
        include: { role: { select: { name: true } } },
    })
    const isUserOwner = userRoles.some(r => r.role.name === "owner")

    return <div className="container mx-auto p-4 flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">{t("generalSettings")}</h1>
        <SettingsDashboard userId={session.user.id}/>
        <h1 className="text-3xl font-bold">{t("teamSettingsTitle")}</h1>
        {isUserOwner ?
            <OwnerTeamSettings teamId={params.teamId} />
            :
            <MemberTeamSettings teamId={params.teamId} userId={session.user.id} />
        }
    </div>
}
