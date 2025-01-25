import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {MarkdownContent} from "@/components/MarkdownContent";
import BackButton from "@/components/BackButton";
import {NodeDefinition} from "@/model/NodeDefinition";
import getNodeDefinition from "@/actions/get-node-definition";
import {getTranslations} from "next-intl/server";
import PreviewDynamicOptions from "@/components/shop/details/PreviewDynamicOptions";
import AddOrRemoveNodeButton from "@/components/shop/details/AddOrRemoveNodeButton";

export default async function NodeDetails({ params }: { params: { nodeId: string } }) {

    const t = await getTranslations("shop.node.details")

    const nodeDefinition: NodeDefinition = await getNodeDefinition()

    return (
        <div className="container mx-auto px-4 py-6">
            <BackButton className="pl-2 mb-4" title={ t("back") }/>

            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{nodeDefinition.name}</h1>
                        <p className="text-muted-foreground">{nodeDefinition.shortDescription}</p>
                    </div>

                    <AddOrRemoveNodeButton nodeId={params.nodeId} />

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl">{ t("documentationTitle") }</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MarkdownContent content={nodeDefinition.markdownDocumentation} />
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <h2 className="text-xl sm:text-2xl font-semibold">{ t("nodePreview") }</h2>
                    <Card className="mb-6 pt-4">
                        <CardContent>
                            <PreviewDynamicOptions optionsDefinition={nodeDefinition.optionsDefinition} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

