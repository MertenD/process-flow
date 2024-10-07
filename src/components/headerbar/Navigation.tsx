"use client"

import Link from "next/link";
import React from "react";
import {cn} from "@/lib/utils";
import { usePathname } from 'next/navigation'
import {Page} from "@/types/database.types";
import {useTranslations} from "next-intl";

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
    className?: string;
    allowedPages: Page[];
    selectedTeamId?: number;
}

export default function Navigation({ className, allowedPages, selectedTeamId } : Readonly<NavigationProps>) {

    const t = useTranslations("Header.nav")

    const pathname = usePathname()

    const editorPath = `/${selectedTeamId}/editor`
    const monitoringPath = `/${selectedTeamId}/monitoring`
    const teamPath = `/${selectedTeamId}/team`
    const tasksPath = `/${selectedTeamId}/tasks`
    const statsPath = `/${selectedTeamId}/stats`
    const settingsPath = `/${selectedTeamId}/settings`

    return <nav
        className={cn("flex items-center space-x-4 lg:space-x-6", className)}
    >
        { allowedPages.includes("Tasks") && <Link
            href={tasksPath}
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith(tasksPath) ? "text-primary" : "text-muted-foreground"}`}
        >
            {t("tasks")}
        </Link> }
        { allowedPages.includes("Editor") && <Link
            href={editorPath}
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith(editorPath) ? "text-primary" : "text-muted-foreground"}`}
        >
            Editor
        </Link> }
        { allowedPages.includes("Monitoring") && <Link
            href={monitoringPath}
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith(monitoringPath) ? "text-primary" : "text-muted-foreground"}`}
        >
            {t("monitoring")}
        </Link> }
        { allowedPages.includes("Team") && <Link
            href={teamPath}
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith(teamPath) ? "text-primary" : "text-muted-foreground"}`}
        >
            {t("team")}
        </Link> }
        <Link
            href={statsPath}
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith(statsPath) ? "text-primary" : "text-muted-foreground"}`}
        >
            {t("stats")}
        </Link>
        <Link
            href={settingsPath}
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith(settingsPath) ? "text-primary" : "text-muted-foreground"}`}
        >
            {t("settings")}
        </Link>
    </nav>
}