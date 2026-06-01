import React from "react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarSeparator } from "@/components/ui/sidebar"
import TeamSwitcher from "@/components/sidebar/TeamSwitcher"
import { redirect } from "next/navigation"
import { Page, Profile } from "@/model/database/database.types"
import getAllowedPages from "@/actions/get-allowed-pages"
import { getTranslations } from "next-intl/server"
import { BookOpenText, BookUser, LucideIcon } from "lucide-react"
import { Award, ChartColumn, Home, ListTodo, PencilRuler, Settings, ShoppingBasket, Users, Workflow } from 'lucide-react'
import Link from "next/link"
import SidebarUserNav from "@/components/sidebar/SidebarUserNav"
import { requireSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export type TeamWithColorSchema = {
    profileId: string
    teamId: string
    team: { name: string; createdBy: string; colorSchemeFrom: string; colorSchemeTo: string }
}

interface NavItemProps { key: string; name: string; href: string; icon: LucideIcon }
interface AppSidebarProps { teamId: number; profile: Profile | null }

export default async function AppSidebar({ teamId, profile, ...props }: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {

    const t = await getTranslations("Header.nav")

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    const navData = {
        main: [
            { key: "Editor", name: t("editor"), href: `/${teamId}/editor`, icon: Workflow },
            { key: "Tasks", name: t("tasks"), href: `/${teamId}/tasks`, icon: ListTodo },
            { key: "Monitoring", name: t("monitoring"), href: `/${teamId}/monitoring`, icon: ChartColumn },
            { key: "Team", name: t("team"), href: `/${teamId}/team`, icon: Users },
            { key: "Stats", name: t("stats"), href: `/${teamId}/stats`, icon: Award },
            { key: "Settings", name: t("settings"), href: `/${teamId}/settings`, icon: Settings },
        ] as NavItemProps[]
    }

    const profileTeams = await prisma.profileTeam.findMany({
        where: { profileId: session.user.id },
        include: { team: { select: { id: true, name: true, createdBy: true, colorScheme: true } } },
    })

    const ownTeams = profileTeams
        .filter(pt => pt.team.createdBy === session.user.id)
        .map(pt => ({ label: pt.team.name, value: pt.teamId.toString(), colorSchema: { from: (pt.team.colorScheme as any)?.from, to: (pt.team.colorScheme as any)?.to } }))

    const otherTeams = profileTeams
        .filter(pt => pt.team.createdBy !== session.user.id)
        .map(pt => ({ label: pt.team.name, value: pt.teamId.toString(), colorSchema: { from: (pt.team.colorScheme as any)?.from, to: (pt.team.colorScheme as any)?.to } }))

    const allowedPages: Page[] = await getAllowedPages(teamId, session.user.id)

    return <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
            <TeamSwitcher ownTeams={ownTeams} otherTeams={otherTeams} selectedTeamId={teamId}/>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={t("dashboard")}>
                            <Link href="/dashboard"><Home /><span>{t("dashboard")}</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
                <SidebarGroupLabel>{t("workspaceGroupTitle")}</SidebarGroupLabel>
                <SidebarMenu>
                    {navData.main.filter(item => item.key === "Stats" || item.key === "Settings" || allowedPages.includes(item.key as Page)).map((item) => (
                        <SidebarMenuItem key={item.key}>
                            <SidebarMenuButton asChild tooltip={item.name}>
                                <Link href={item.href}>{item.icon && <item.icon />}<span>{item.name}</span></Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
                <SidebarGroupLabel>{t("shopGroupTitle")}</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem><SidebarMenuButton asChild tooltip={t("shop")}><Link href={`/${teamId}/shop`}><ShoppingBasket /><span>{t("shop")}</span></Link></SidebarMenuButton></SidebarMenuItem>
                    <SidebarMenuItem><SidebarMenuButton asChild tooltip={t("createNode")}><Link href={`/${teamId}/shop/create-node`}><PencilRuler /><span>{t("createNode")}</span></Link></SidebarMenuButton></SidebarMenuItem>
                    <SidebarMenuItem><SidebarMenuButton asChild tooltip={t("ownNodes")}><Link href={`/${teamId}/shop/own-nodes`}><BookUser /><span>{t("ownNodes")}</span></Link></SidebarMenuButton></SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
                <SidebarGroupLabel>{t("docsGroupTitle")}</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem><SidebarMenuButton asChild tooltip={t("docs")}><Link href={`/${teamId}/docs`}><BookOpenText /><span>{t("docs")}</span></Link></SidebarMenuButton></SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <SidebarUserNav profile={profile} teamId={teamId}/>
        </SidebarFooter>
        <SidebarRail />
    </Sidebar>
}
