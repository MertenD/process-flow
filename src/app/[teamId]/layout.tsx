import React from "react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/sidebar/AppSidebar"
import { Separator } from "@/components/ui/separator"
import AppBreadcrumbs from "@/components/sidebar/AppBreadcrumbs"
import { redirect } from "next/navigation"
import MiniatureLevelCard from "@/components/stats/MiniatureLevelCard"
import { requireSession } from "@/lib/session"
import getProfile from "@/actions/get-profile"

export default async function TeamLayout({ children, params }: Readonly<{ children: React.ReactNode, params: Promise<{ teamId: string }> }>) {

    const { teamId: _teamId } = await params
    const teamId = Number(_teamId)

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    const profile = await getProfile(session.user.id)

    return <SidebarProvider>
        <AppSidebar teamId={teamId} profile={profile} />
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16">
                <div className="w-full flex flex-row justify-between px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator orientation="vertical" className="mr-2 h-4"/>
                        <AppBreadcrumbs teamId={teamId} userId={session.user.id} />
                    </div>
                    {profile && <div className="w-52">
                        <MiniatureLevelCard userId={profile.id} teamId={teamId}/>
                    </div>}
                </div>
            </header>
            {children}
        </SidebarInset>
    </SidebarProvider>
}
