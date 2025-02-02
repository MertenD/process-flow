import React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator
} from "@/components/ui/sidebar";
import TeamSwitcher from "@/components/sidebar/TeamSwitcher";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {Page, Profile} from "@/model/database/database.types";
import getAllowedPages from "@/actions/get-allowed-pages";
import {getTranslations} from "next-intl/server";
import type {LucideIcon} from "lucide-react"
import {
    Award,
    ChartColumn,
    Database,
    Home,
    ListTodo,
    PencilRuler,
    Settings,
    ShoppingBasket,
    Users,
    Workflow
} from 'lucide-react';
import Link from "next/link";
import SidebarUserNav from "@/components/sidebar/SidebarUserNav";

export type TeamWithColorSchema = {
    profileId: string,
    teamId: string,
    team: {
        name: string,
        createdBy: string,
        colorSchemeFrom: string,
        colorSchemeTo: string
    }
}

interface NavItemProps {
    key: string
    name: string
    href: string
    icon: LucideIcon
}

interface AppSidebarProps {
    teamId: number;
    profile: Profile | null
}

export default async function AppSidebar({ teamId, profile, ...props }: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {

    const t = await getTranslations("Header.nav")
    const supabase = createClient()

    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user || !userData.user?.id) {
        redirect("/authenticate")
    }

    const navData = {
        main: [
            {
                key: "Editor",
                name: t("editor"),
                href: `/${teamId}/editor`,
                icon: Workflow
            },
            {
                key: "Tasks",
                name: t("tasks"),
                href: `/${teamId}/tasks`,
                icon: ListTodo
            },
            {
                key: "Monitoring",
                name: t("monitoring"),
                href: `/${teamId}/monitoring`,
                icon: ChartColumn
            },
            {
                key: "Team",
                name: t("team"),
                href: `/${teamId}/team`,
                icon: Users
            },
            {
                key: "Stats",
                name: t("stats"),
                href: `/${teamId}/stats`,
                icon: Award
            },
            {
                key: "Settings",
                name: t("settings"),
                href: `/${teamId}/settings`,
                icon: Settings
            }
        ] as NavItemProps[]
    }

    const { data: teams } = await supabase
        .from('profile_team')
        .select('profileId:profile_id, teamId:team_id, team ( name, createdBy: created_by, colorSchemeFrom: color_scheme->from, colorSchemeTo: color_scheme->to )')
        .eq('profile_id', userData.user?.id || "")
        .returns<TeamWithColorSchema[]>()

    const ownTeams = teams?.filter(team => team.team.createdBy === userData.user.id).map(team => ({
        label: team.team.name,
        value: team.teamId,
        colorSchema: { from: team.team.colorSchemeFrom, to: team.team.colorSchemeTo }
    })) ?? []

    const otherTeams = teams?.filter(team => team.team.createdBy !== userData.user.id).map(team => ({
        label: team.team.name,
        value: team.teamId,
        colorSchema: { from: team.team.colorSchemeFrom, to: team.team.colorSchemeTo }
    })) ?? []

    const allowedPages: Page[] = await getAllowedPages(teamId, userData.user.id)

    return <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
            <TeamSwitcher ownTeams={ownTeams} otherTeams={otherTeams} selectedTeamId={teamId}/>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={t("dashboard")}>
                            <Link href="/dashboard">
                                <Home />
                                <span>{ t("dashboard") }</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
                <SidebarGroupLabel>{ t("workspaceGroupTitle") }</SidebarGroupLabel>
                <SidebarMenu>
                    {navData.main.filter(item =>
                        item.key === "Stats" ||
                        item.key === "Settings" ||
                        allowedPages.includes(item.key as Page)
                    ).map((item) => (
                        <SidebarMenuItem key={item.key}>
                            <SidebarMenuButton asChild tooltip={item.name}>
                                <Link href={item.href}>
                                    { item.icon && <item.icon /> }
                                    <span>{item.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
                <SidebarGroupLabel>{ t("shopGroupTitle") }</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={t("shop")}>
                            <Link href={`/${teamId}/shop`}>
                                <ShoppingBasket />
                                <span>{ t("shop") }</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={t("addedNodes")}>
                            <Link href={`/${teamId}/shop/saved-nodes`}>
                                <Database />
                                <span>{ t("addedNodes") }</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={t("createNode")}>
                            <Link href={`/${teamId}/shop/create-node`}>
                                <PencilRuler />
                                <span>{ t("createNode") }</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <SidebarUserNav profile={profile} teamId={teamId}/>
        </SidebarFooter>
        <SidebarRail />
    </Sidebar>
}