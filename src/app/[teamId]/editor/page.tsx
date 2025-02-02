import React from "react";
import {getTranslations} from "next-intl/server";
import ProcessList from "@/components/processEditor/processList/ProcessList";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

export default async function EditorPage({ params }: Readonly<{ params: { teamId: number } }>) {

    // TODO Wenn ein neuer Prozess erstellt wurde, auf die monitoring seite gewechselt wird und dann wieder auf die editor seite, dann wird der Prozess in der Prozessliste nicht angezeigt

    const t = await getTranslations("editor")

    const supabase = createClient()

    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/authenticate")
    }

    return <div className="w-full h-full overflow-y-auto">
        <ProcessList teamId={params.teamId} userId={userData.user.id}/>
    </div>
}