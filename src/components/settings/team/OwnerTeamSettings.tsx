import OwnerDangerZoneSettings from "@/components/settings/team/owner/OwnerDangerZoneSettings";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";
import {getTranslations} from "next-intl/server";

export interface OwnerTeamSettingsProps {
    teamId: number
}

export default async function OwnerTeamSettings({ teamId }: Readonly<OwnerTeamSettingsProps>) {

    const t = await getTranslations("settings.teamSettings")

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: team, error: teamError } = await supabase
        .from("team")
        .select("name")
        .eq("id", teamId)
        .single<{ name: string }>()

    if (teamError || !team) {
        return <div>{t("couldNotLoadTeam")}</div>
    }

    return <OwnerDangerZoneSettings teamId={teamId} teamName={team.name} />
}