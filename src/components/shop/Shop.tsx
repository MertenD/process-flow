"use client"

import React, {useState} from "react";
import {useTranslations} from "next-intl";
import SearchAndFilter from "@/components/shop/SearchAndFilter";
import NodeList from "@/components/shop/NodeList";
import {NodeDefinitionPreview} from "@/model/NodeDefinition";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import Link from "next/link";

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
        <div className="flex flex-row justify-between">
            <h2 className="text-3xl font-bold">{ t("title") }</h2>
            <Link href={`/${teamId}/shop/create-node`}>
                <Button variant="default">
                    <Plus />
                    <span className="pl-2 text-center">{t("createActivity")}</span>
                </Button>
            </Link>
        </div>
        <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
        />
        <NodeList teamId={teamId} nodeDefinitions={filteredNodes} />
    </>
}