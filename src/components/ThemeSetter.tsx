"use client"

import {useTheme} from "next-themes";
import {createClient} from "@/utils/supabase/client";
import {useEffect, useState} from "react";
import {Theme} from "@/model/database/database.types";


export default function ThemeSetter() {

    const { setTheme } = useTheme()

    const supabase = createClient()
    const [userId, setUserId] = useState<string>("")

    useEffect(() => {
        async function fetchUser() {
            const {data: userData, error} = await supabase.auth.getUser()
            if (error || !userData.user || !userData.user.id) {
                return
            }
            setUserId(userData.user.id)
        }

        fetchUser().then()
    }, [supabase, setUserId]);

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