import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {SettingsDashboard} from "@/components/settings/SettingsDashboard";
import OwnerTeamSettings from "@/components/settings/team/OwnerTeamSettings";
import MemberTeamSettings from "@/components/settings/team/MemberTeamSettings";
import {getTranslations} from "next-intl/server";

export default async function SettingsPage({ params }: Readonly<{ params: { teamId: number }}>) {

    const t = await getTranslations("settings")

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {data: userData, error: userError} = await supabase.auth.getUser()
    if (userError || !userData.user || !userData.user?.id) {
        redirect("/authenticate")
    }

    const {data: userRoles, error: roleError} = await supabase
        .from("profile_role_team")
        .select("role ( name )")
        .eq("team_id", params.teamId)
        .eq("profile_id", userData.user.id)
        .returns<{ role: { name: string } }[]>()

    const isUserOwner = userRoles?.some(role => role.role.name === "owner")

    return <div className="container mx-auto p-4 flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">{t("generalSettings")}</h1>
        <SettingsDashboard userId={userData.user.id}/>
        <h1 className="text-3xl font-bold">{t("teamSettingsTitle")}</h1>
        { isUserOwner ?
            <OwnerTeamSettings teamId={params.teamId} />
            :
            <MemberTeamSettings teamId={params.teamId} userId={userData.user.id} />
        }
    </div>
}