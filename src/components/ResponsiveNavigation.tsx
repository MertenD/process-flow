"use client"

import Link from "next/link"
import React from "react"
import { useTranslations } from "next-intl"
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Page } from "@/model/database/database.types"

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
    allowedPages: Page[]
    selectedTeamId?: number
}

export default function ResponsiveNavigation({ className, allowedPages, selectedTeamId }: Readonly<NavigationProps>) {
    const t = useTranslations("Header.nav")
    const pathname = usePathname()

    const navItems = [
        { page: "Tasks", path: `/${selectedTeamId}/tasks`, label: t("tasks") },
        { page: "Editor", path: `/${selectedTeamId}/editor`, label: "Editor" },
        { page: "Monitoring", path: `/${selectedTeamId}/monitoring`, label: t("monitoring") },
        { page: "Team", path: `/${selectedTeamId}/team`, label: t("team") },
        { page: "Stats", path: `/${selectedTeamId}/stats`, label: t("stats") },
        { page: "Settings", path: `/${selectedTeamId}/settings`, label: t("settings") },
        { page: "Shop", path: `/${selectedTeamId}/shop`, label: t("shop") }
    ]

    return (
        <nav className={cn("flex", className)}>
            {navItems.map((item) => (
                (allowedPages.includes(item.page as Page) || item.page === "Stats" || item.page === "Settings" ) && (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md",
                            pathname.startsWith(item.path) ? "text-primary bg-primary/10" : "text-muted-foreground"
                        )}
                    >
                        {item.label}
                    </Link>
                )
            ))}
        </nav>
    )
}