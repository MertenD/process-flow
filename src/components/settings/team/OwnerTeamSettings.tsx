import OwnerDangerZoneSettings from "@/components/settings/team/owner/OwnerDangerZoneSettings"
import { getTranslations } from "next-intl/server"
import getTeam from "@/actions/get-team"

export interface OwnerTeamSettingsProps {
    teamId: number
}

export default async function OwnerTeamSettings({ teamId }: Readonly<OwnerTeamSettingsProps>) {

    const t = await getTranslations("settings.teamSettings")
    const team = await getTeam(teamId)

    if (!team) {
        return <div>{t("couldNotLoadTeam")}</div>
    }

    return <OwnerDangerZoneSettings teamId={teamId} teamName={team.name} />
}
