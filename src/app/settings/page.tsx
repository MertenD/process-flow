import {SettingsDashboard} from "@/components/settings/SettingsDashboard";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import BackButton from "@/components/settings/BackButton";

export default async function SettingsPage() {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user || !userData.user.id) {
        redirect("/authenticate")
    }

    return <div className="container mx-auto py-10">
        <div className="flex items-center mb-6">
            <BackButton />
            <h1 className="text-3xl font-bold">Einstellungen</h1>
        </div>
        <SettingsDashboard userId={userData.user.id} />
    </div>
}