"use server"

import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";

export default async function(roleId: number): Promise<void> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    let { data, error } = await supabase
        .rpc('remove_role', {
            role_id: roleId,
        }).single<number>()

    if (error) {
        throw Error(error?.message || "Error removing role")
    }
}