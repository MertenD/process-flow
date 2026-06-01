import MemberDangerZoneSettings from "@/components/settings/team/member/MemberDangerZoneSettings"
import { getTranslations } from "next-intl/server"
import getTeam from "@/actions/get-team"

export interface OwnerTeamSettingsProps {
    teamId: number
    userId: string
}

export default async function MemberTeamSettings({ teamId, userId }: Readonly<OwnerTeamSettingsProps>) {

    const t = await getTranslations("settings.teamSettings")
    const team = await getTeam(teamId)

    if (!team) {
        return <div>{t("couldNotLoadTeam")}</div>
    }

    return <MemberDangerZoneSettings teamId={teamId} teamName={team.name} userId={userId} />
}
