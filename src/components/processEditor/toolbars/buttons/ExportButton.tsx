"use client"

import useStore from "@/stores/store"
import { shallow } from "zustand/shallow"
import { FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { onExport } from "@/utils/editor/ExportUtils"
import { useTranslations } from "next-intl"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

const selector = (state: any) => ({
    nodes: state.nodes,
    edges: state.edges,
    getNodeById: state.getNodeById,
})

export default function ExportButton() {
    const t = useTranslations("editor.export")
    const { nodes, edges, getNodeById } = useStore(selector, shallow)

    return <TooltipProvider delayDuration={250}>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => onExport(nodes, edges, getNodeById)}>
                    <FileDown className="h-4 w-4" />
                    <span className="sr-only">{t("exportButton")}</span>
                    <a id="downloadExport" style={{ display: "none" }}></a>
                </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-primary">
                <p>{t("exportButton")}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
}

