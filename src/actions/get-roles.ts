"use server"

import {RoleWithAllowedPages} from "@/model/database/database.types";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function(teamId: number): Promise<RoleWithAllowedPages[]> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {data: roles, error: tasksError} = await supabase
        .from("role")
        .select(`*, allowed_pages: pages->allowed_pages`)
        .eq("belongs_to", teamId)
        .returns<RoleWithAllowedPages[]>()

    if (tasksError || !roles) {
        throw Error(tasksError.message)
    }

    return roles.filter(role => role.name !== "owner").map(role => {
        if (!role.allowed_pages) {
            return {
                ...role,
                allowed_pages: []
            }
        }
        return role
    })
}