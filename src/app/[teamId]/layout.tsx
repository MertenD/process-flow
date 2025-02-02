import React from "react";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/AppSidebar";
import {Separator} from "@/components/ui/separator";
import AppBreadcrumbs from "@/components/sidebar/AppBreadcrumbs";
import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {Profile} from "@/model/database/database.types";
import MiniatureLevelCard from "@/components/stats/MiniatureLevelCard";

export default async function TeamLayout({ children, params }: Readonly<{ children: React.ReactNode, params: { teamId: number } }>) {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/authenticate")
    }

    const {data: profile} = await supabase
        .from('profiles')
        .select('id, username, email, avatar')
        .eq('id', userData.user.id || "")
        .single<Profile>()

    return <SidebarProvider>
        <AppSidebar teamId={params.teamId} profile={profile} />
        <SidebarInset>
            <header
                className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16"
            >
                <div className="w-full flex flex-row justify-between px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator orientation="vertical" className="mr-2 h-4"/>
                        <AppBreadcrumbs teamId={params.teamId} userId={userData.user.id} />
                    </div>
                    { profile && <div className="w-52">
                        <MiniatureLevelCard userId={profile.id} teamId={params.teamId}/>
                    </div> }
                </div>
            </header>
            {children}
        </SidebarInset>
    </SidebarProvider>
}