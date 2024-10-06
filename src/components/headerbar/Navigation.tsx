"use client"

import Link from "next/link";
import React from "react";
import {cn} from "@/lib/utils";
import { usePathname } from 'next/navigation'
import {Page} from "@/types/database.types";

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
    className?: string;
    allowedPages: Page[];
    selectedTeamId?: number;
}

export default function Navigation({ className, allowedPages, selectedTeamId } : Readonly<NavigationProps>) {

    // TODO Owner soll alles sehen können

    const pathname = usePathname()

    const editorPath = `/${selectedTeamId}/editor`
    const monitoringPath = `/${selectedTeamId}/monitoring`
    const teamPath = `/${selectedTeamId}/team`
    const tasksPath = `/${selectedTeamId}/tasks`
    const statsPath = `/${selectedTeamId}/stats`

    return <nav
        className={cn("flex items-center space-x-4 lg:space-x-6", className)}
    >
        { allowedPages.includes("Tasks") && <Link
            href={tasksPath}
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith(tasksPath) ? "text-primary" : "text-muted-foreground"}`}
        >
            Tasks
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
            Monitoring
        </Link> }
        { allowedPages.includes("Team") && <Link
            href={teamPath}
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith(teamPath) ? "text-primary" : "text-muted-foreground"}`}
        >
            Team
        </Link> }
        <Link
            href={statsPath}
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith(statsPath) ? "text-primary" : "text-muted-foreground"}`}
        >
            Stats
        </Link>
    </nav>
}