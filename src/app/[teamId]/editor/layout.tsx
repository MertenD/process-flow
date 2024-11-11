import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import React from 'react';
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import ProcessList from "@/components/processEditor/processList/ProcessList";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {getTranslations} from "next-intl/server";

export default async function EditorLayout({ children, params }: Readonly<{ children: React.ReactNode, params: { teamId: number } }>) {

    const t = await getTranslations("editor")
    const supabase = createClient()

    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/authenticate")
    }

    return (
        <main className="h-[calc(100vh-64px)] overflow-y-hidden">
            <div className="hidden md:block h-full">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={15} minSize={10}>
                        <div className="flex flex-col h-full">
                            <h1 className="text-3xl font-bold p-3">{t("title")}</h1>
                            <div className="flex-1 overflow-y-auto">
                                <ProcessList teamId={params.teamId} userId={userData.user.id}/>
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle/>
                    <ResizablePanel defaultSize={85}>
                        { children }
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
            <div className="flex flex-col md:hidden h-full">
                <h1 className="text-3xl font-bold p-4">{t("title")}</h1>
                <Card className="m-4 border-amber-500 bg-amber-100 h-min">
                    <CardHeader>
                        <CardTitle>{t("cannotEditProcessesDialogTitle")}</CardTitle>
                        <CardDescription>{t("cannotEditProcessesDialogDescription")}</CardDescription>
                    </CardHeader>
                </Card>
                <div className="flex-1 overflow-y-auto">
                    <ProcessList teamId={params.teamId} userId={userData.user.id} isMobile/>
                </div>
            </div>
        </main>
);
}