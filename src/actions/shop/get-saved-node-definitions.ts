"use server"

import {NodeDefinitionPreview} from "@/model/NodeDefinition";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

// TODO Add Some sort of pagination and search functionality

export default async function (teamId: number): Promise<NodeDefinitionPreview[]> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: result, error } = await supabase
        .from("teams_node_definitions")
        .select("team_id, node_definition(" +
            "id, " +
            "name: definition->name, " +
            "shortDescription: definition->shortDescription, " +
            "executionMode: definition->executionMode)"
        )
        .eq("team_id", teamId)
        .returns<{ team_id: number, node_definition: NodeDefinitionPreview}[]>()

    if (error || result == null) {
        throw new Error("Failed to fetch node definition previews")
    }

    return result.map(r => r.node_definition)
}