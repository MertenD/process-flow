import SavedNodes from "@/components/shop/saved/SavedNodes";
import {getTranslations} from "next-intl/server";
import getSavedNodeDefinitions from "@/actions/shop/get-saved-node-definitions";

export default async function AddedNodesPage({ params }: { params: { teamId: number } }) {
    const t = await getTranslations("shop.addedNodesPage")

    const savedNodes = await getSavedNodeDefinitions(params.teamId)

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h2 className="text-3xl font-bold">{ t("title") }</h2>
            <SavedNodes teamId={params.teamId} initialSavedNodes={savedNodes} />
        </div>
    )
}