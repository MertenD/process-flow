import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import React from 'react';
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import ProcessList from "@/components/processList/ProcessList";

export default async function EditorLayout({ children, params }: Readonly<{ children: React.ReactNode, params: { teamId: number } }>) {

    // TODO Check if user has permission for this process model

    const supabase = createClient()

    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/authenticate")
    }

    return (
        <main className="h-[calc(100vh-64px)] overflow-y-hidden">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={15}>
                    <ProcessList teamId={params.teamId} userId={userData.user.id} />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={85}>
                    { children }
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    );
}