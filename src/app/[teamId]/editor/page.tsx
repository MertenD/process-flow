import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import ProcessList from "@/components/processList/ProcessList";
import React from "react";
import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase/server";

export default async function EditorPage({ params }: Readonly<{ params: { teamId: string } }>) {

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/login")
    }

    return <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={15}>
            <ProcessList teamId={params.teamId} userId={userData.user.id} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={85}>
            <div className="w-full h-full flex flex-col justify-center items-center bg-accent">
                Select a process model to edit
            </div>
        </ResizablePanel>
    </ResizablePanelGroup>
}