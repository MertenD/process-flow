"use client"

import React from 'react';
import useStore from "../../../store";
import {onExport} from "../../../util/ImportExportUtils";
import {saveProcessModelToDatabase} from "@/components/processEditor/util/DatabaseUtils";
import {SupabaseClient} from "@supabase/supabase-js";
import {useReactFlow} from "reactflow";

export interface ControlsToolbarProps {
    supabase: SupabaseClient<any, "public", any>
    processModelId: string
}

export default function ControlsToolbar({ supabase, processModelId }: Readonly<ControlsToolbarProps>) {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const getChildren = useStore((state) => state.getChildren)
    const getNodeById = useStore((state) => state.getNodeById)

    const reactFlowInstance = useReactFlow();

    return (
        <aside>
            <div style={{
                borderRadius: 10,
                padding: 16,
                background: "white",
                border: "1px solid black",
                display: "flex",
                flexDirection: "column",
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <button style={{width: "100%", marginBottom: 10}} onClick={_ =>
                    saveProcessModelToDatabase(nodes, edges, processModelId, supabase, reactFlowInstance)
                }>
                    Save process
                </button>
                <button style={{width: "100%"}} onClick={_ => onExport(nodes, edges, getChildren, getNodeById)}>
                    Export for Engine (.bpmn)
                    <a id="downloadExport" style={{display: "none"}}></a>
                </button>
            </div>
        </aside>
    );
};