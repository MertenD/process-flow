"use server"

import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";
import {Page} from "@/types/database.types";

export default async function(roleName: string, teamId: number, color: string, allowedPages: Page[]): Promise<number> {

    if (roleName === "owner" || roleName === "all" || roleName === "none") {
        throw new Error("Role name cannot be 'owner'")
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    console.log("Adding role", roleName, teamId, color, allowedPages)

    let { data, error } = await supabase
        .rpc('add_role', {
            name_param: roleName,
            color_param: color,
            belongs_to_param: teamId,
            pages_param: {
                allowed_pages: allowedPages
            }
        }).single<number>()

    if (error || !data) {
        throw Error(error?.message || "Error adding role")
    }

    return data
}