"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {getTranslations} from "next-intl/server";
import {useTranslations} from "next-intl";

interface Node {
    id: number
    title: string
    category: string
    description: string
    badge: string
}

interface NodeListProps {
    teamId: number
    nodes: Node[]
}

export default function NodeList({ teamId, nodes }: NodeListProps) {
    const t =  useTranslations("shop")

    if (nodes.length === 0) {
        return <div className="text-center text-muted-foreground">{ t("search.noActivitiesFound") }</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {nodes.map((node) => (
                <Card key={node.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-lg">{node.title}</CardTitle>
                                <CardDescription>{node.description}</CardDescription>
                            </div>
                            <Badge variant="secondary">{node.badge}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Link href={`/${teamId}/shop/node/${node.id}`} className="inline-flex items-center text-sm text-primary hover:underline">
                            { t("node.viewDetails") }
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

