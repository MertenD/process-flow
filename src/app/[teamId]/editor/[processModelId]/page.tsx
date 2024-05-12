import BpmnEditor from "@/components/processEditor/modules/flow/BpmnEditor";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import ProcessList from "@/components/processList/ProcessList";
import React from "react";

// TODO Generell middleware um zu überprüfen, ob man auf gewisse Routen zugriff hat

export default async function EditorProcessPage({ params }: Readonly<{ params: { processModelId: string, teamId: string } }>) {

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/login")
    }

    const { data: processModel } = await supabase
        .from('process_model')
        .select('belongs_to')
        .eq('id', params.processModelId)
        .single<{ belongs_to: string }>()

    if (params.teamId != processModel?.belongs_to) {
        redirect(`/${params.teamId}/editor`)
    }

    return <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={10}>
            <ProcessList teamId={params.teamId} selectedProcessId={params.processModelId} userId={userData.user.id} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={90}>
            <div className="w-full h-full">
                <BpmnEditor processModelId={params.processModelId}/> : <div>Select a process model to edit</div>
            </div>
        </ResizablePanel>
    </ResizablePanelGroup>
}
