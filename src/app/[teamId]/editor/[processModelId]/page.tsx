import BpmnEditor from "@/components/processEditor/BpmnEditor";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import React from "react";

// TODO Generell middleware um zu überprüfen, ob man auf gewisse Routen zugriff hat

export default async function EditorProcessPage({ params }: Readonly<{ params: { processModelId: number, teamId: number } }>) {

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/authenticate")
    }

    const { data: processModel } = await supabase
        .from('process_model')
        .select('belongs_to, name')
        .eq('id', params.processModelId)
        .single<{ belongs_to: number, name: string }>()

    if (params.teamId != processModel?.belongs_to) {
        redirect(`/${params.teamId}/editor`)
    }

    return <div className="w-full h-full">
        <BpmnEditor processModelId={params.processModelId} teamId={params.teamId} /> : <div>Select a process model to edit</div>
    </div>
}
