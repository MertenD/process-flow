"use client"

import Link from "next/link";
import React from "react";
import {cn} from "@/lib/utils";
import { usePathname } from 'next/navigation'

export default function Navigation({
    className
}: Readonly<React.HTMLAttributes<HTMLElement>>) {

    const pathname = usePathname()

    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
        >
            <Link
                href="/editor"
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/editor") ? "text-primary" : "text-muted-foreground"}`}
            >
                Editor
            </Link>
            <Link
                href="/monitoring"
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/monitoring") ? "text-primary" : "text-muted-foreground"}`}
            >
                Monitoring
            </Link>
            <Link
                href="/tasks"
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/tasks") ? "text-primary" : "text-muted-foreground"}`}
            >
                Tasks
            </Link>
            <Link
                href="/stats"
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/stats") ? "text-primary" : "text-muted-foreground"}`}
            >
                Stats
            </Link>
        </nav>
    )
}