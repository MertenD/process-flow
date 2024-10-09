"use client"

import useStore from "@/components/processEditor/stores/store";
import {shallow} from "zustand/shallow";
import {FileDown} from "lucide-react";
import {Button} from "@/components/ui/button";
import React from "react";
import {onExport} from "@/components/processEditor/util/ExportUtils";
import {useTranslations} from "next-intl";

const selector = (state: any) => ({
    nodes: state.nodes,
    edges: state.edges,
    getChildren: state.getChildren,
    getNodeById: state.getNodeById,
});

export default function ExportButton() {

    const t = useTranslations("editor.export")

    const { nodes, edges, getChildren, getNodeById } = useStore(selector, shallow);

    return <Button onClick={() => {
        onExport(nodes, edges, getChildren, getNodeById)
    }}>
        <FileDown className="mr-2 h-4 w-4"/> {t("exportButton")}
        <a id="downloadExport" style={{display: "none"}}></a>
    </Button>
}