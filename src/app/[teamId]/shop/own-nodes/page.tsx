import getNodeDefinitionsFromUser from "@/actions/shop/get-node-definition-previews-from-user"
import { redirect } from "next/navigation"
import { NodeDefinitionPreview } from "@/model/NodeDefinition"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import removeNodeDefinitionPermanently from "@/actions/shop/remove-node-definition-permanently"
import { requireSession } from "@/lib/session"

export default async function OwnNodesPage({ params }: { params: { teamId: number } }) {

    const t = await getTranslations("shop")

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    const nodeDefinitions = await getNodeDefinitionsFromUser(session.user.id, params.teamId)

    async function handleRemoveNode(nodeId: number) {
        "use server"
        await removeNodeDefinitionPermanently(nodeId)
    }

    return <>
        <h2 className="text-3xl font-bold">{t("node.own-nodes")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {nodeDefinitions.map((node: NodeDefinitionPreview) => (
                <Card key={node.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-lg">{node.name}</CardTitle>
                                <CardDescription>{node.shortDescription}</CardDescription>
                            </div>
                            <Badge variant="secondary">{node.executionMode}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <Link href={`/${params.teamId}/shop/node/${node.id}`}
                                  className="inline-flex items-center text-sm text-primary hover:underline">
                                {t("node.viewDetails")}
                                <ArrowRight className="ml-1 h-4 w-4"/>
                            </Link>
                            <div className="flex flex-row space-x-2">
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger>
                                        <Link href={`/${params.teamId}/shop/update-node/${node.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-secondary">
                                                <Pencil className="h-4 w-4"/>
                                                <span className="sr-only">{t("node.editNode")}</span>
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>{t("node.editNodeDescription")}</TooltipContent>
                                </Tooltip>
                                {node.id && <form action={handleRemoveNode.bind(null, node.id)} method="POST">
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger>
                                            <Button variant="ghost" size="icon" type="submit"
                                                className="h-8 w-8 text-muted-foreground hover:bg-destructive transition-colors">
                                                <Trash2 className="h-4 w-4"/>
                                                <span className="sr-only">Remove node</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{t("node.removeNodePermanently")}</TooltipContent>
                                    </Tooltip>
                                </form>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </>
}
