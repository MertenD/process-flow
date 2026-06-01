import BpmnEditor from "@/components/processEditor/BpmnEditor"
import { redirect } from "next/navigation"
import React from "react"
import { NodeDefinitionPreview } from "@/model/NodeDefinition"
import getSavedNodeDefinitions from "@/actions/shop/get-saved-node-definitions"
import { requireSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export default async function EditorProcessPage({ params }: Readonly<{ params: { processModelId: number, teamId: number } }>) {

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    const processModel = await prisma.processModel.findUnique({
        where: { id: BigInt(params.processModelId) },
        select: { belongsTo: true, name: true },
    })

    if (Number(processModel?.belongsTo) !== Number(params.teamId)) {
        redirect(`/${params.teamId}/editor`)
    }

    const nodeDefinitionPreviews: NodeDefinitionPreview[] = await getSavedNodeDefinitions(params.teamId)

    return <div className="w-full h-full">
        <BpmnEditor
            processModelId={params.processModelId}
            teamId={params.teamId}
            nodeDefinitionPreviews={nodeDefinitionPreviews}
        />
    </div>
}
