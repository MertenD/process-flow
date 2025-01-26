"use server"

import {NodeDefinitionPreview} from "@/model/NodeDefinition";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

// TODO Add Some sort of pagination and search functionality

export default async function (): Promise<NodeDefinitionPreview[]> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: result, error } = await supabase
        .from("node_definition")
        .select("id, " +
            "name: definition->name, " +
            "shortDescription: definition->shortDescription, " +
            "executionMode: definition->executionMode"
        )
        .returns<NodeDefinitionPreview[]>()

    if (error || !result) {
        throw new Error("Failed to fetch node definition previews")
    }

    return result
}