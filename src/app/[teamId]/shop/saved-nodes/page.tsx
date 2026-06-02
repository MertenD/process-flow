import SavedNodes from "@/components/shop/saved/SavedNodes";
import {getTranslations} from "next-intl/server";
import getSavedNodeDefinitions from "@/actions/shop/get-saved-node-definitions";

export default async function AddedNodesPage({ params }: { params: Promise<{ teamId: string }> }) {

    const { teamId: _teamId } = await params
    const teamId = Number(_teamId)
    const t = await getTranslations("shop.addedNodesPage")

    const savedNodes = await getSavedNodeDefinitions(teamId)

    return <>
        <h2 className="text-3xl font-bold">{ t("title") }</h2>
        <SavedNodes teamId={teamId} initialSavedNodes={savedNodes} />
    </>
}