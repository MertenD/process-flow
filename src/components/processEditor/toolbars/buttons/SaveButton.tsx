"use client"

import {Button} from "@/components/ui/button"
import {Save} from "lucide-react";
import useStore from "@/stores/store";
import {Edge, Node, useReactFlow} from "reactflow";
import {toast} from "@/components/ui/use-toast";
import saveProcessModelToDatabase from "@/actions/save-process-model-to-database";
import {useTranslations} from "next-intl";

export interface SaveButtonProps {
    processModelId: number
}

export default function SaveButton({ processModelId }: Readonly<SaveButtonProps>) {

    const t = useTranslations("editor.save")

    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const reactFlowInstance = useReactFlow();

    return <Button onClick={() => {
        saveProcessModelToDatabase(nodes, edges, processModelId).then((oldNewIdMapping: Map<string, number>) => {

            // Update react flow if any new ids were assigned
            reactFlowInstance.setNodes(nodes.map(node => {
                return {
                    ...node,
                    id: oldNewIdMapping.get(node.id)?.toString() ?? node.id,
                    parentId: node.parentId ? oldNewIdMapping.get(node.parentId)?.toString() : undefined
                } as Node
            }))
            reactFlowInstance.setEdges(edges.map(edge => {
                return {
                    ...edge,
                    source: oldNewIdMapping.get(edge.source)?.toString() ?? edge.source,
                    target: oldNewIdMapping.get(edge.target)?.toString() ?? edge.target,
                } as Edge
            }))

            toast({
                title: t("saveSuccessTitle"),
                description: t("saveSuccessDescription"),
                variant: "success"
            })
        }).catch((error) => {
            console.error("Error saving Process Model", error)
            toast({
                title: t("saveErrorTitle"),
                description: t("saveErrorDescription"),
                variant: "destructive"
            })
        })
    }}>
        <Save className="mr-2 h-4 w-4" /> {t("saveButton")}
    </Button>
}