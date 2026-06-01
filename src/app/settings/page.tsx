import { SettingsDashboard } from "@/components/settings/SettingsDashboard"
import { redirect } from "next/navigation"
import BackButton from "@/components/BackButton"
import { getTranslations } from "next-intl/server"
import { requireSession } from "@/lib/session"

export default async function SettingsPage() {
    const t = await getTranslations("settings.teamSettings")

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    return <div className="container mx-auto py-10">
        <div className="flex items-center mb-6">
            <BackButton className="px-2 mr-2" />
            <h1 className="text-3xl font-bold">{t("title")}</h1>
        </div>
        <SettingsDashboard userId={session.user.id} />
    </div>
}
