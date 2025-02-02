import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import React from 'react';

export default async function EditorLayout({ children, params }: Readonly<{ children: React.ReactNode, params: { teamId: number } }>) {

    const supabase = createClient()

    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/authenticate")
    }

    return <main className="h-full overflow-y-hidden">
        { children }
    </main>
}