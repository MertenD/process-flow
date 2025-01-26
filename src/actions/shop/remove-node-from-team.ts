"use server"

import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function(teamId: number, nodeDefinitionId: number): Promise<void> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const response = await supabase
        .from("teams_node_definitions")
        .delete()
        .eq("team_id", teamId)
        .eq("node_definition_id", nodeDefinitionId)

    if (response.error) {
        throw Error("Error while deleting node to team: " + response.error.message)
    }

    return
}