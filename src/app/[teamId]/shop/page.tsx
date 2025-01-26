import React from "react"
import Shop from "@/components/shop/Shop";
import getNodeDefinitionPreviews from "@/actions/shop/get-node-definition-previews";

export default async function ShopPage({ params }: { params: { teamId: number } }) {

    const nodeDefinitions = await getNodeDefinitionPreviews()

    console.log(nodeDefinitions)

    return <div className="container mx-auto p-4 space-y-6">
        <Shop teamId={params.teamId} nodeDefinitions={nodeDefinitions} />
    </div>
}

