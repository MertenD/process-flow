import BpmnEditor from "@/components/processEditor/BpmnEditor"
import { redirect } from "next/navigation"
import React from "react"
import { NodeDefinitionPreview } from "@/model/NodeDefinition"
import getSavedNodeDefinitions from "@/actions/shop/get-saved-node-definitions"
import { requireSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export default async function EditorProcessPage({ params }: Readonly<{ params: Promise<{ processModelId: string, teamId: string }> }>) {

    const { processModelId: _processModelId, teamId: _teamId } = await params
    const processModelId = Number(_processModelId)
    const teamId = Number(_teamId)

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    const processModel = await prisma.processModel.findUnique({
        where: { id: BigInt(processModelId) },
        select: { belongsTo: true, name: true },
    })

    if (Number(processModel?.belongsTo) !== Number(teamId)) {
        redirect(`/${teamId}/editor`)
    }

    const nodeDefinitionPreviews: NodeDefinitionPreview[] = await getSavedNodeDefinitions(teamId)

    return <div className="w-full h-full">
        <BpmnEditor
            processModelId={processModelId}
            teamId={teamId}
            nodeDefinitionPreviews={nodeDefinitionPreviews}
        />
    </div>
}
