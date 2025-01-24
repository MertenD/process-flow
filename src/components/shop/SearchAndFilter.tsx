"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {useTranslations} from "next-intl";

interface SearchAndFilterProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    selectedCategory: string
    setSelectedCategory: (category: string) => void
}

export default function SearchAndFilter({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
}: SearchAndFilterProps) {

    const t = useTranslations("shop.search")

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t("searchPlaceholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{ t("allCategories") }</SelectItem>
                        <SelectItem value="input">Input Nodes</SelectItem>
                        <SelectItem value="process">Process Nodes</SelectItem>
                        <SelectItem value="decision">Decision Nodes</SelectItem>
                        <SelectItem value="output">Output Nodes</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

