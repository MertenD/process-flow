"use client"

import {useTheme} from "next-themes";
import {createClient} from "@/utils/supabase/client";
import {useEffect} from "react";
import {Theme} from "@/model/database/database.types";

export interface ThemeSetterProps {
    userId: string
}

export default function ThemeSetter({ userId }: ThemeSetterProps) {

    const { setTheme } = useTheme()

    const supabase = createClient()

    useEffect(() => {
        supabase
            .from("profiles")
            .select("theme")
            .eq("id", userId)
            .single<{ theme: Theme }>()
            .then(({ data, error }) => {
                if (!error && data) {
                    setTheme(data.theme)
                }
            })
    }, [setTheme, supabase, userId]);

    return <></>
}