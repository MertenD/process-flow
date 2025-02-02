"use client"

import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from "@/components/ui/sidebar";
import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuItemWithServerAction,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles} from "lucide-react";
import {createClient} from "@/utils/supabase/client";
import {Profile} from "@/model/database/database.types";
import {redirect} from "next/navigation";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useTranslations} from "next-intl";
import MiniatureLevelCard from "@/components/stats/MiniatureLevelCard";

interface UserNavProps {
    teamId: number | null
    profile: Profile | null
}

export default function SidebarUserNav({ teamId, profile }: UserNavProps) {

    const { isMobile } = useSidebar()
    const t =  useTranslations("Header.userNav")

    const signOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        return redirect('/')
    }

    return profile ? (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={profile.avatar || ""} alt={profile.username} />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{profile.username}</span>
                                <span className="truncate text-xs">{profile.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={profile.avatar || ""} alt={profile.username}/>
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{profile.username}</span>
                                    <span className="truncate text-xs">{profile.email}</span>
                                </div>
                            </div>
                            <div className="px-1 py-1.5">
                                { teamId &&
                                    <MiniatureLevelCard userId={profile.id} teamId={teamId}/>
                                }
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <Link href={"/settings"}>
                                <DropdownMenuItem>
                                    {t("settings")}
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItemWithServerAction action={signOut}>
                            {t("logout")}
                        </DropdownMenuItemWithServerAction>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    ) : (
        <Button>
            <Link
                href="/authenticate"
                className="btn-primary"
            >
                {t("login")}
            </Link>
        </Button>
    );
}