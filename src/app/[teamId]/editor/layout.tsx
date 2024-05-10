import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import React from 'react';

export default async function EditorLayout({ children, params }: Readonly<{ children: React.ReactNode, params: { teamId: string } }>) {

    // TODO Check if user has permission for this process model

    const supabase = createClient()

    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/login")
    }

    return (
        <main>
            { children }
        </main>
    );
}