"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"
import { authClient } from "@/lib/auth-client"

export default function ThemeSetter() {
    const { setTheme } = useTheme()
    const { data: session } = authClient.useSession()

    useEffect(() => {
        if (session?.user) {
            const isDark = (session.user as any).isDarkModeEnabled
            setTheme(isDark ? "dark" : "light")
        }
    }, [session, setTheme])

    return <></>
}
