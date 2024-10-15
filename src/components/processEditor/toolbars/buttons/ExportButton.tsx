"use client"

import useStore from "@/stores/store";
import {shallow} from "zustand/shallow";
import {FileDown} from "lucide-react";
import {Button} from "@/components/ui/button";
import React from "react";
import {onExport} from "@/utils/editor/ExportUtils";
import {useTranslations} from "next-intl";

const selector = (state: any) => ({
    nodes: state.nodes,
    edges: state.edges,
    getChildren: state.getChildren,
    getNodeById: state.getNodeById,
});

export default function ExportButton() {

    const t = useTranslations("editor.export")

    const { nodes, edges, getNodeById } = useStore(selector, shallow);

    return <Button onClick={() => {
        onExport(nodes, edges, getNodeById)
    }}>
        <FileDown className="mr-2 h-4 w-4"/> {t("exportButton")}
        <a id="downloadExport" style={{display: "none"}}></a>
    </Button>
}