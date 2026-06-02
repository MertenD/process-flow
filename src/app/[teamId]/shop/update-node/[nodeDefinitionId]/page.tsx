import { redirect } from "next/navigation"
import CreateNodePage from "@/components/shop/create-node/CreateNodePage"
import getNodeDefinition from "@/actions/shop/get-node-definition"
import { NodeDefinition } from "@/model/NodeDefinition"
import { requireSession } from "@/lib/session"

export default async function UpdateNode({ params }: { params: Promise<{ teamId: string, nodeDefinitionId: string }> }) {

    const { teamId: _teamId, nodeDefinitionId: _nodeDefinitionId } = await params
    const teamId = Number(_teamId)
    const nodeDefinitionId = Number(_nodeDefinitionId)

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    const nodeDefinition = await getNodeDefinition(nodeDefinitionId)
    const filteredNodeDefinition = {
        ...nodeDefinition,
        optionsDefinition: {
            ...nodeDefinition.optionsDefinition,
            structure: nodeDefinition.optionsDefinition.structure.slice(3)
        }
    } as NodeDefinition

    return <CreateNodePage
        teamId={teamId}
        userId={session.user.id}
        initialNodeDefinition={filteredNodeDefinition}
        nodeDefinitionId={nodeDefinitionId}
    />
}
