"use server"

import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function(teamId: number, nodeDefinitionId: number): Promise<void> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
        .from("teams_node_definitions")
        .insert({
            team_id: teamId,
            node_definition_id: nodeDefinitionId
        })

    if (error) {
        throw Error("Error while adding node to team: " + error.message)
    }

    return
}