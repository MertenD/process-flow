"use client"

import React, {useState} from "react";
import {useTranslations} from "next-intl";
import SearchAndFilter from "@/components/shop/SearchAndFilter";
import NodeList from "@/components/shop/NodeList";
import {NodeDefinitionPreview} from "@/model/NodeDefinition";

interface ShopProps {
    teamId: number
    nodeDefinitions: NodeDefinitionPreview[]
}

export default function Shop({ teamId, nodeDefinitions }: Readonly<ShopProps>) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")

    const t = useTranslations("shop.shopPage")

    const filteredNodes = nodeDefinitions.filter((definition) => {
        const matchesSearch =
            definition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            definition.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "all" || definition.executionMode === selectedCategory
        return matchesSearch && matchesCategory
    })

    return <>
        <h2 className="text-3xl font-bold">{ t("title") }</h2>
        <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
        />
        <NodeList teamId={teamId} nodeDefinitions={filteredNodes} />
    </>
}