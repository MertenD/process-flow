import { redirect } from "next/navigation"
import React from 'react'
import { requireSession } from "@/lib/session"

export default async function EditorLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    return <main className="h-full overflow-y-hidden">
        {children}
    </main>
}
