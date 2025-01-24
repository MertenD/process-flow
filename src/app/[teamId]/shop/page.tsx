"use client"

import React, { useState } from "react"
import SearchAndFilter from "@/components/shop/SearchAndFilter";
import NodeList from "@/components/shop/NodeList";
import {useTranslations} from "next-intl";

// Beispiel-Nodes (in einer echten Anwendung würden diese von einer API oder Datenbank kommen)
const allNodes = [
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
    {
        id: 3,
        title: "Data Transform",
        category: "process",
        description: "Transforms input data according to specified rules.",
        badge: "Process",
    },
    {
        id: 4,
        title: "Email Notification",
        category: "output",
        description: "Sends an email notification based on process outcomes.",
        badge: "Output",
    },
]

export default function Shop({ params }: { params: { teamId: number } }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")

    const t = useTranslations("shop.shopPage")

    const filteredNodes = allNodes.filter((node) => {
        const matchesSearch =
            node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "all" || node.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h2 className="text-3xl font-bold">{ t("title") }</h2>
            <SearchAndFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            <NodeList teamId={params.teamId} nodes={filteredNodes} />
        </div>
    )
}

