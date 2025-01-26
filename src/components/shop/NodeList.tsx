"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {getTranslations} from "next-intl/server";
import {useTranslations} from "next-intl";
import {NodeDefinitionPreview} from "@/model/NodeDefinition";

interface Node {
    id: number
    title: string
    category: string
    description: string
    badge: string
}

interface NodeListProps {
    teamId: number
    nodeDefinitions: NodeDefinitionPreview[]
}

export default function NodeList({ teamId, nodeDefinitions }: NodeListProps) {
    const t =  useTranslations("shop")

    if (nodeDefinitions.length === 0) {
        return <div className="text-center text-muted-foreground">{ t("search.noActivitiesFound") }</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {nodeDefinitions.map((definition) => (
                <Card key={definition.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-lg">{definition.name}</CardTitle>
                                <CardDescription>{definition.shortDescription}</CardDescription>
                            </div>
                            <Badge variant="secondary">{definition.executionMode}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Link href={`/${teamId}/shop/node/${definition.id}`} className="inline-flex items-center text-sm text-primary hover:underline">
                            { t("node.viewDetails") }
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

