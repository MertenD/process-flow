import React from "react"
import Shop from "@/components/shop/Shop";
import getNodeDefinitionPreviews from "@/actions/shop/get-node-definition-previews";

export default async function ShopPage({ params }: { params: Promise<{ teamId: string }> }) {

    const { teamId: _teamId } = await params
    const teamId = Number(_teamId)

    const nodeDefinitions = await getNodeDefinitionPreviews()

    return <Shop teamId={teamId} nodeDefinitions={nodeDefinitions} />
}

