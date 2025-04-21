"use server"

import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function(nodeDefinitionId: number): Promise<void> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const response = await supabase
        .from("node_definition")
        .delete()
        .eq("id", nodeDefinitionId)

    if (response.error) {
        throw Error("Error while deleting node to team: " + response.error.message)
    }

    return
}