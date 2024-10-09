import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";
import MemberDangerZoneSettings from "@/components/settings/team/member/MemberDangerZoneSettings";
import {getTranslations} from "next-intl/server";

export interface OwnerTeamSettingsProps {
    teamId: number
    userId: string
}

export default async function MemberTeamSettings({ teamId, userId }: Readonly<OwnerTeamSettingsProps>) {

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

    return <MemberDangerZoneSettings teamId={teamId} teamName={team.name} userId={userId} />
}