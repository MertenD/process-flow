"use client"

import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import useStore from "@/stores/store"
import { useReactFlow } from "reactflow"
import { toast } from "@/components/ui/use-toast"
import saveProcessModelToDatabase from "@/actions/save-process-model-to-database"
import { useTranslations } from "next-intl"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

export interface SaveButtonProps {
    processModelId: number
}

export default function SaveButton({ processModelId }: SaveButtonProps) {
    const t = useTranslations("editor.save")
    const nodes = useStore((state) => state.nodes)
    const edges = useStore((state) => state.edges)
    const reactFlowInstance = useReactFlow()

    const handleSave = async () => {
        try {
            const oldNewIdMapping = await saveProcessModelToDatabase(nodes, edges, processModelId)

            // Update react flow if any new ids were assigned
            reactFlowInstance.setNodes(
                nodes.map((node) => ({
                    ...node,
                    id: oldNewIdMapping.get(node.id)?.toString() ?? node.id,
                    parentId: node.parentId ? oldNewIdMapping.get(node.parentId)?.toString() : undefined,
                })),
            )
            reactFlowInstance.setEdges(
                edges.map((edge) => ({
                    ...edge,
                    source: oldNewIdMapping.get(edge.source)?.toString() ?? edge.source,
                    target: oldNewIdMapping.get(edge.target)?.toString() ?? edge.target,
                })),
            )

            toast({
                title: t("saveSuccessTitle"),
                description: t("saveSuccessDescription"),
                variant: "success",
            })
        } catch (error) {
            console.error("Error saving Process Model", error)
            toast({
                title: t("saveErrorTitle"),
                description: t("saveErrorDescription"),
                variant: "destructive",
            })
        }
    }

    return <TooltipProvider delayDuration={250}>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={handleSave}
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onMouseEnter={() => console.log("Mouse entered SaveButton")}
                    onMouseLeave={() => console.log("Mouse left SaveButton")}
                >
                    <Save className="h-4 w-4" />
                    <span className="sr-only">{t("saveButton")}</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{t("saveButton")}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
}

