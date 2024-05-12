"use client"

import Link from "next/link";
import React from "react";
import {cn} from "@/lib/utils";
import { usePathname } from 'next/navigation'

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
    className?: string;
    selectedTeamId?: string;
}

export default function Navigation({ className, selectedTeamId } : Readonly<NavigationProps>) {

    const pathname = usePathname()

    const editorPath = `/${selectedTeamId}/editor`
    const monitoringPath = `/${selectedTeamId}/monitoring`
    const teamPath = `/${selectedTeamId}/team`
    const tasksPath = `/${selectedTeamId}/tasks`
    const statsPath = `/${selectedTeamId}/stats`

    return <nav
        className={cn("flex items-center space-x-4 lg:space-x-6", className)}
    >
        <Link
            href={editorPath}
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith(editorPath) ? "text-primary" : "text-muted-foreground"}`}
        >
            Editor
        </Link>
        <Link
            href={monitoringPath}
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith(monitoringPath) ? "text-primary" : "text-muted-foreground"}`}
        >
            Monitoring
        </Link>
        <Link
            href={teamPath}
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith(teamPath) ? "text-primary" : "text-muted-foreground"}`}
        >
            Team
        </Link>
        <Link
            href={tasksPath}
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith(tasksPath) ? "text-primary" : "text-muted-foreground"}`}
        >
            Tasks
        </Link>
        <Link
            href={statsPath}
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith(statsPath) ? "text-primary" : "text-muted-foreground"}`}
        >
            Stats
        </Link>
    </nav>
}