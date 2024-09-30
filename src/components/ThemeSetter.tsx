"use client"

import {useTheme} from "next-themes";
import {createClient} from "@/utils/supabase/client";
import {useEffect} from "react";

export interface ThemeSetterProps {
    userId: string
}

export default function ThemeSetter({ userId }: ThemeSetterProps) {

    const { setTheme } = useTheme()

    const supabase = createClient()

    useEffect(() => {
        supabase
            .from("profiles")
            .select("is_dark_mode_enabled")
            .eq("id", userId)
            .single<{ is_dark_mode_enabled: boolean }>()
            .then(({ data, error }) => {
                if (!error && data) {
                    setTheme(data.is_dark_mode_enabled ? 'dark' : 'light')
                }
            })
    }, [supabase, userId]);

    return <></>
}