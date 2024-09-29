"use server"

import {Page} from "@/types/database.types";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function(teamId: number, profileId: string): Promise<Page[]> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: allowedPages } = await supabase
        .from('profile_role_team')
        .select('role ( allowed_pages: pages->allowed_pages )')
        .eq('team_id', teamId)
        .eq('profile_id', profileId)
        .returns<{ role: { allowed_pages: string[] } }[]>()

    const allowedPagesForUser = Array.from(new Set(allowedPages?.map(pages => pages.role.allowed_pages).flat()));

    return allowedPagesForUser as Page[]
}