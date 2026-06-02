import React from "react"
import { redirect } from "next/navigation"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import Worklist from "@/components/tasks/Worklist"
import { requireSession } from "@/lib/session"

export default async function TasksLayout({ children, params }: Readonly<{ children: React.ReactNode, params: Promise<{ teamId: string }> }>) {

    const { teamId: _teamId } = await params
    const teamId = Number(_teamId)

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    return <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} minSize={20}>
            <div className="flex flex-col h-full">
                <h1 className="text-3xl font-bold p-4">Aufgaben</h1>
                <div className="flex-1 overflow-auto">
                    <Worklist teamId={teamId} userId={session.user.id}/>
                </div>
            </div>
        </ResizablePanel>
        <ResizableHandle/>
        <ResizablePanel defaultSize={50}>
            {children}
        </ResizablePanel>
    </ResizablePanelGroup>
}
