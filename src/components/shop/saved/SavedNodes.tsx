"use client"

import { NodeDefinitionPreview } from "@/model/NodeDefinition"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import removeNodeFromTeam from "@/actions/shop/remove-node-from-team"
import { Button } from "@/components/ui/button"

export interface AddedNodesProps {
    teamId: number
    initialSavedNodes: NodeDefinitionPreview[]
}

export default function SavedNodes({ teamId, initialSavedNodes }: Readonly<AddedNodesProps>) {
    const t = useTranslations("shop")
    const [savedNodes, setSavedNodes] = useState<NodeDefinitionPreview[]>(initialSavedNodes)

    if (savedNodes.length === 0) {
        return <div className="text-center text-muted-foreground">{t("addedNodesPage.noNodes")}</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {savedNodes.map((node: NodeDefinitionPreview) => (
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
                            <Link href={`/${teamId}/shop/node/${node.id}`} className="inline-flex items-center text-sm text-primary hover:underline">
                                {t("node.viewDetails")}
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    if (node.id) {
                                        removeNodeFromTeam(teamId, node.id).then(() =>
                                            setSavedNodes(prev => prev.filter(n => n.id !== node.id))
                                        )
                                    }
                                }}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove node</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
