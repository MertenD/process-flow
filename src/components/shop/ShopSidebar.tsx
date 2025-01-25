"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Database, Home, PencilRuler, PlusCircle} from "lucide-react";
import {useTranslations} from "next-intl";

export interface ShopSidebarProps {
    teamId: number
}

export default function ShopSidebar({ teamId }: Readonly<ShopSidebarProps>) {
    const pathname = usePathname()
    const t = useTranslations("shop.sidebar")

    const navItems = [
        { href: `/${teamId}/shop`, icon: Home, label: t("shopNavLabel") },
        { href: `/${teamId}/shop/added-nodes`, icon: Database, label: t("addedNodesNavLabel") },
        { href: `/${teamId}/shop/create-node`, icon: PencilRuler, label: t("createNodeNavLabel") },
    ]

    return (
        <div className="flex h-screen w-64 flex-col bg-background border-r">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">{ t("title") }</h1>
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Button variant="ghost" className={cn("w-full justify-start", pathname === item.href && "bg-muted")}>
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.label}
                            </Button>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    )
}

