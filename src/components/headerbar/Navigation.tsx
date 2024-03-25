import Link from "next/link";
import React from "react";
import '@/styles/navigation.css';

export default function Navigation() {
    return (
        <nav>
            <ul>
                <li>
                    <Link href="/editor" legacyBehavior passHref>
                        <a>Editor</a>
                    </Link>
                </li>
                <li>
                    <Link href="/monitoring" legacyBehavior passHref>
                        <a>Monitoring</a>
                    </Link>
                </li>
                <li>
                    <Link href="/tasks" legacyBehavior passHref>
                        <a>Tasks</a>
                    </Link>
                </li>
                <li>
                    <Link href="/stats" legacyBehavior passHref>
                        <a>Stats</a>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}