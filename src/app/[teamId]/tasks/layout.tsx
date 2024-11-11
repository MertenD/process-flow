import React from "react";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import Worklist from "@/components/tasks/Worklist";

export default async function TasksLayout({ children, params }: Readonly<{ children: React.ReactNode, params: { teamId: number, taskId: string } }>) {

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/authenticate")
    }

    return <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} minSize={20}>
            <div className="flex flex-col h-full">
                <h1 className="text-3xl font-bold p-4">Aufgaben</h1>
                <div className="flex-1 overflow-auto">
                    <Worklist teamId={params.teamId} userId={userData.user.id}/>
                </div>
            </div>
        </ResizablePanel>
        <ResizableHandle/>
        <ResizablePanel defaultSize={50}>
            { children }
        </ResizablePanel>
    </ResizablePanelGroup>
}