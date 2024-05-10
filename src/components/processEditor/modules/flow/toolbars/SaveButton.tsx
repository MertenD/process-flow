"use client"

import { Button } from "@/components/ui/button"
import {Save} from "lucide-react";
import useStore from "@/components/processEditor/store";
import {useReactFlow} from "reactflow";
import {saveProcessModelToDatabase} from "@/components/processEditor/util/DatabaseUtils";
import {createClient} from "@/utils/supabase/client";
import {toast} from "@/components/ui/use-toast";

export interface SaveButtonProps {
    processModelId: string
}

export default function SaveButton({ processModelId }: Readonly<SaveButtonProps>) {

    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const reactFlowInstance = useReactFlow();
    const supabase = createClient()

    return <Button onClick={() => {
        saveProcessModelToDatabase(nodes, edges, processModelId, supabase, reactFlowInstance).then(() => {
            toast({
                title: "Process Model saved",
                description: "Your changes have been saved to the database",
                variant: "success"
            })
        }).catch((error) => {
            toast({
                title: "Error saving Process Model",
                description: error.message,
                variant: "destructive"
            })
        })
    }}>
        <Save className="mr-2 h-4 w-4" /> Save Model
    </Button>
}