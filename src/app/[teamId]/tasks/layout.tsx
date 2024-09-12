import React from "react";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import TaskList from "@/components/taskList/TaskList";

export default async function TasksLayout({ children, params }: Readonly<{ children: React.ReactNode, params: { teamId: string, taskId: string } }>) {

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/authenticate")
    }

    return <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={15}>
            <TaskList teamId={params.teamId} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={85}>
            { children }
        </ResizablePanel>
    </ResizablePanelGroup>
}