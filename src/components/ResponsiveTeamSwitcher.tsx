"use client"

import React, { useState } from 'react'
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"

export type Team = {
    label: string
    value: string
    colorSchema: { from: string; to: string }
}

interface TeamSwitcherProps extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {
    ownTeams: Team[]
    otherTeams: Team[]
    selectedTeamId?: number
}

export default function ResponsiveTeamSwitcher({ className, ownTeams, otherTeams, selectedTeamId }: Readonly<TeamSwitcherProps>) {
    const t = useTranslations("Header.TeamSwitcher")
    const [open, setOpen] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState<Team>(
        [...ownTeams, ...otherTeams].find(team => team.value === selectedTeamId?.toString()) || ownTeams[0]
    )

    const groups = [
        { label: t("ownTeams"), teams: ownTeams },
        { label: t("otherTeams"), teams: otherTeams }
    ]

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label={t("selectTeam")}
                    className={cn("justify-between", className)}
                >
                    <div className={`mr-2 h-5 w-5 rounded-full shrink-0 bg-gradient-to-br ${selectedTeam.colorSchema.from} ${selectedTeam.colorSchema.to}`} />
                    <span className="truncate">{selectedTeam.label}</span>
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={t("search")} />
                    <CommandList>
                        <CommandEmpty>{t("noTeamsFound")}</CommandEmpty>
                        {groups.map((group) => (
                            <CommandGroup key={group.label} heading={group.label}>
                                {group.teams.map((team) => (
                                    <CommandItem
                                        key={team.value}
                                        onSelect={() => {
                                            setSelectedTeam(team)
                                            setOpen(false)
                                            window.location.href = window.location.href.replace(/\/\d+\//, `/${team.value}/`)
                                        }}
                                        className="text-sm"
                                    >
                                        <div className={`mr-2 h-5 w-5 rounded-full bg-gradient-to-br ${team.colorSchema.from} ${team.colorSchema.to}`}/>
                                        {team.label}
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                selectedTeam.value === team.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}