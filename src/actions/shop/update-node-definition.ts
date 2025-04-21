"use server"

import {NodeDefinition} from "@/model/NodeDefinition";
import {Json, NodeDefinitionVisibility} from "@/model/database/database.types";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function(id: number, nodeDefinition: NodeDefinition, creatorId: string, teamId: number, visibility: NodeDefinitionVisibility): Promise<void> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore, process.env.SUPABASE_SERVICE_KEY)

    let { data, error } = await supabase
        .from("node_definition")
        .update({
            definition: nodeDefinition as unknown as Json,
            created_by: creatorId,
            team_id: teamId,
            visibility: visibility,
        })
        .eq("id", id)
        .select()

    if (error || !data) {
        throw Error(error?.message || "Error creating node definition")
    }

    return
}