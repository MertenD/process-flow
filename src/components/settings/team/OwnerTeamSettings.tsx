import OwnerDangerZoneSettings from "@/components/settings/team/owner/OwnerDangerZoneSettings";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export interface OwnerTeamSettingsProps {
    teamId: number
}

export default async function OwnerTeamSettings({ teamId }: Readonly<OwnerTeamSettingsProps>) {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: team, error: teamError } = await supabase
        .from("team")
        .select("name")
        .eq("id", teamId)
        .single<{ name: string }>()

    if (teamError || !team) {
        return <div>Einstellungen konnten nicht geladen werden</div>
    }

    return <OwnerDangerZoneSettings teamId={teamId} teamName={team.name} />
}