"use server"

import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";
import {NodeDefinitionPreview} from "@/model/NodeDefinition";

export default async function(creatorId: string, teamId: number): Promise<NodeDefinitionPreview[]> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore, process.env.SUPABASE_SERVICE_KEY)

    let { data, error } = await supabase
        .from("node_definition")
        .select("id, " +
            "name: definition->name, " +
            "icon: definition->icon, " +
            "shortDescription: definition->shortDescription, " +
            "executionMode: definition->executionMode"
        )
        .eq("created_by", creatorId)
        .eq("team_id", teamId)
        .returns<NodeDefinitionPreview[]>()

    if (error || !data) {
        throw Error(error?.message || "Error getting node definitions for user")
    }

    return data
}