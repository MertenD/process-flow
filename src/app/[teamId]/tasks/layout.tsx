import React from "react";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import TaskList from "@/components/tasks/TaskList";

export default async function TasksLayout({ children, params }: Readonly<{ children: React.ReactNode, params: { teamId: number, taskId: string } }>) {

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/authenticate")
    }

    return <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20}>
            <TaskList teamId={params.teamId} userId={userData.user.id} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
            { children }
        </ResizablePanel>
    </ResizablePanelGroup>
}