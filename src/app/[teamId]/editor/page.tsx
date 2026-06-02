import React from "react"
import { getTranslations } from "next-intl/server"
import ProcessList from "@/components/processEditor/processList/ProcessList"
import { redirect } from "next/navigation"
import { requireSession } from "@/lib/session"

export default async function EditorPage({ params }: Readonly<{ params: Promise<{ teamId: string }> }>) {

    const { teamId: _teamId } = await params
    const teamId = Number(_teamId)
    const t = await getTranslations("editor")

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    return <div className="w-full h-full overflow-y-auto">
        <ProcessList teamId={teamId} userId={session!.user.id}/>
    </div>
}
