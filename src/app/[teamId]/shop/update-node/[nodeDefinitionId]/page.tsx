import { redirect } from "next/navigation"
import CreateNodePage from "@/components/shop/create-node/CreateNodePage"
import getNodeDefinition from "@/actions/shop/get-node-definition"
import { NodeDefinition } from "@/model/NodeDefinition"
import { requireSession } from "@/lib/session"

export default async function UpdateNode({ params }: { params: { teamId: number, nodeDefinitionId: number } }) {

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    const nodeDefinition = await getNodeDefinition(params.nodeDefinitionId)
    const filteredNodeDefinition = {
        ...nodeDefinition,
        optionsDefinition: {
            ...nodeDefinition.optionsDefinition,
            structure: nodeDefinition.optionsDefinition.structure.slice(3)
        }
    } as NodeDefinition

    return <CreateNodePage
        teamId={params.teamId}
        userId={session.user.id}
        initialNodeDefinition={filteredNodeDefinition}
        nodeDefinitionId={params.nodeDefinitionId}
    />
}
