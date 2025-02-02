'use client';

import React, {useEffect, useState} from 'react';
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator,} from '@/components/ui/breadcrumb';
import {usePathname} from 'next/navigation';
import {useTranslations} from 'next-intl';
import Link from "next/link";
import {createClient} from "@/utils/supabase/client";
import getTasks from "@/actions/get-tasks";

interface BreadcrumbModel {
    name: string;
    href: string;
}

interface AppBreadcrumbsProps {
    teamId: number;
    userId: string;
}

export default function AppBreadcrumbs({ teamId, userId }: AppBreadcrumbsProps) {
    const pathname = usePathname();
    const t = useTranslations('Header.nav');
    const supabase = createClient()

    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbModel[]>([]);

    useEffect(() => {
        async function fetchBreadcrumbs() {
            const tasksPath = `/${teamId}/tasks`;
            const editorPath = `/${teamId}/editor`;
            const monitoringPath = `/${teamId}/monitoring`
            const teamPath = `/${teamId}/team`
            const statsPath = `/${teamId}/stats`;
            const shopPath = `/${teamId}/shop`
            const shopSavedNodesPath = `/${teamId}/shop/saved-nodes`
            const shopCreateNodePath = `/${teamId}/shop/create-node`

            const newBreadcrumbs: BreadcrumbModel[] = [];

            if (!pathname) {
                setBreadcrumbs(newBreadcrumbs);
                return;
            }

            if (pathname.startsWith(tasksPath)) {
                newBreadcrumbs.push({
                    name: t('tasks'),
                    href: tasksPath
                });
                // Extrahiere taskId aus der URL, z. B. /{teamId}/tasks/123
                const parts = pathname.split('/');
                const taskId = Number(parts[3] || null);
                if (taskId) {
                    const tasks = await getTasks(teamId, userId)
                    const task = tasks.find(task => task.id === taskId)

                    if (task) {
                        newBreadcrumbs.push({
                            name: task.name,
                            href: `${tasksPath}/${taskId}`
                        })
                    }
                }
            } else if (pathname.startsWith(editorPath)) {
                newBreadcrumbs.push({
                    name: t('editor'),
                    href: editorPath
                });
                const parts = pathname.split('/');
                const modelId = Number(parts[3] || null);
                if (modelId) {
                    const {data: model} = await supabase
                        .from('process_model')
                        .select('name')
                        .eq('id', modelId)
                        .single<{ name: string }>()

                    if (model && model.name) {
                        newBreadcrumbs.push({
                            name: model.name,
                            href: `${editorPath}/${modelId}`
                        })
                    }
                }
            } else if (pathname.startsWith(monitoringPath)) {
                newBreadcrumbs.push({
                    name: t('monitoring'),
                    href: monitoringPath
                });
            } else if (pathname.startsWith(teamPath)) {
                newBreadcrumbs.push({
                    name: t('team'),
                    href: teamPath
                });
            } else if (pathname.startsWith(statsPath)) {
                newBreadcrumbs.push({
                    name: t('stats'),
                    href: statsPath
                });
            } else if (pathname.startsWith(shopPath)) {
                newBreadcrumbs.push({
                    name: t('shop'),
                    href: shopPath
                });
                if (pathname.startsWith(shopSavedNodesPath)) {
                    newBreadcrumbs.push({
                        name: t('addedNodes'),
                        href: shopSavedNodesPath
                    });
                } else if (pathname.startsWith(shopCreateNodePath)) {
                    newBreadcrumbs.push({
                        name: t('createNode'),
                        href: shopCreateNodePath
                    })
                }
            }

            setBreadcrumbs(newBreadcrumbs);
        }

        fetchBreadcrumbs();
    }, [pathname, teamId, t, userId, supabase]);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={`${breadcrumb.name}-${index}`}>
                        <BreadcrumbItem className="hidden md:block">
                            <Link href={breadcrumb.href}>
                                {breadcrumb.name}
                            </Link>
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && (
                            <BreadcrumbSeparator className="hidden md:block" />
                        )}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
