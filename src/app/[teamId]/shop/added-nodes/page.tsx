import AddedNodes from "@/components/shop/AddedNodes";
import {getTranslations} from "next-intl/server";

export default async function AddedNodesPage({ params }: { params: { teamId: number } }) {
    const t = await getTranslations("shop.addedNodesPage")

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h2 className="text-3xl font-bold">{ t("title") }</h2>
            <AddedNodes teamId={params.teamId} />
        </div>
    )
}