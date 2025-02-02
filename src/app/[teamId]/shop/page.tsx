import React from "react"
import Shop from "@/components/shop/Shop";
import getNodeDefinitionPreviews from "@/actions/shop/get-node-definition-previews";

export default async function ShopPage({ params }: { params: { teamId: number } }) {

    const nodeDefinitions = await getNodeDefinitionPreviews()

    return <Shop teamId={params.teamId} nodeDefinitions={nodeDefinitions} />
}

