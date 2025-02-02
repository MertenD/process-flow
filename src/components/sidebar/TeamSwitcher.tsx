"use client"

import React from 'react';

import {cn} from "@/lib/utils";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {PopoverTrigger,} from "@/components/ui/popover";
import {Check, ChevronsUpDown} from "lucide-react";
import {useTranslations} from "next-intl";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from "@/components/ui/sidebar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

export type Team = {
    label: string;
    value: string;
    colorSchema: { from: string, to: string }
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
    typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {
    ownTeams: Team[]
    otherTeams: Team[]
    selectedTeamId?: number
}

export default function TeamSwitcher({ className, ownTeams, otherTeams, selectedTeamId }: Readonly<TeamSwitcherProps>) {

    const { isMobile } = useSidebar()
    const t = useTranslations("Header.TeamSwitcher");

    const groups = [
        {
            label: t("ownTeams"),
            teams: ownTeams
        },
        {
            label: t("otherTeams"),
            teams: otherTeams
        }
    ]

    const [selectedTeam, setSelectedTeam] = React.useState<Team>(
        [...ownTeams, ...otherTeams].find(team => team.value.toString() === selectedTeamId?.toString()) || ownTeams[0] // TODO ownTeams[0] ist hier suboptimal, aber es darf eigentlich nicht eintreten
    );

    return <SidebarMenu>
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                        size="lg"
                        role="combobox"
                        aria-label="Select a team"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        tooltip={t("tooltip")}
                    >
                        <div
                            className={`flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br ${selectedTeam.colorSchema.from} ${selectedTeam.colorSchema.to} text-sidebar-primary-foreground`}>
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                                {selectedTeam.label}
                            </span>
                        </div>
                        <ChevronsUpDown className="ml-auto"/>
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align="end"
                    sideOffset={4}
                >
                    <Command>
                        <CommandList>
                            <CommandInput placeholder={t("search")}/>
                            <CommandEmpty>{t("noTeamsFound")}</CommandEmpty>
                            {groups.map((group) => (
                                <CommandGroup key={group.label} heading={group.label}>
                                    {group.teams.map((team) => (
                                        <CommandItem
                                            key={team.value}
                                            onSelect={() => {
                                                setSelectedTeam(team);
                                                window.location.href = window.location.href.replace(/\/\d+\//, `/${team.value}/`)
                                            }}
                                            className="text-sm"
                                        >
                                            <div className={`mr-2 h-5 w-5 rounded-full bg-gradient-to-br ${team.colorSchema.from} ${team.colorSchema.to}`}/>
                                            {team.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto h-4 w-4",
                                                    selectedTeam.value === team.value
                                                        ? "opacity-100"
                                                        : "opacity-0",
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ))}
                        </CommandList>
                    </Command>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    </SidebarMenu>
}