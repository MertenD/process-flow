"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {useTranslations} from "next-intl";

interface Node {
    id: number
    title: string
    category: string
    description: string
    badge: string
}

const initialNodes: Node[] = [
    {
        id: 1,
        title: "Single Choice Node",
        category: "input",
        description: "Presents users with a single choice selection from multiple options.",
        badge: "Input",
    },
    {
        id: 2,
        title: "Conditional Branch",
        category: "decision",
        description: "Creates a decision point in the process based on conditions.",
        badge: "Decision",
    },
]

export interface AddedNodesProps {
    teamId: number
}

export default function AddedNodes({ teamId }: Readonly<AddedNodesProps>) {
    const t =  useTranslations("shop")

    const [addedNodes, setAddedNodes] = useState<Node[]>(initialNodes)

    const removeNode = (id: number) => {
        setAddedNodes(addedNodes.filter((node) => node.id !== id))
    }

    if (addedNodes.length === 0) {
        return <div className="text-center text-muted-foreground">{ t("addedNodesPage.noNodes") }</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {addedNodes.map((node) => (
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
                        <div className="flex items-center justify-between">
                            <Link href={`/${teamId}/shop/node/${node.id}`} className="inline-flex items-center text-sm text-primary hover:underline">
                                { t("node.viewDetails") }
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeNode(node.id)}
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

