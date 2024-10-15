"use server"

import {getRequestConfig} from 'next-intl/server';
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";
import {Profile} from "@/model/database/database.types";

const defaultLocale: string = 'de';

export default getRequestConfig(async () => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {data: userData, error: userError} = await supabase.auth.getUser()
    if (userError || !userData.user || !userData.user.id) {
        return {
            locale: defaultLocale,
            messages: (await import(`../../messages/${defaultLocale}.json`)).default
        }
    }

    const {data: profile, error: profileError} = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single<Profile>()

    const locale = profile?.language || defaultLocale

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});