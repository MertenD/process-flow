"use client"

import React, {useEffect} from 'react';

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {Dialog,} from "@/components/ui/dialog";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Check, ChevronsUpDown} from "lucide-react";

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
    const groups = [
        {
            label: "Your Teams",
            teams: ownTeams
        },
        {
            label: "Other Teams",
            teams: otherTeams
        }
    ]

    const [open, setOpen] = React.useState(false);
    const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
    const [selectedTeam, setSelectedTeam] = React.useState<Team>(
        [...ownTeams, ...otherTeams].find(team => team.value.toString() === selectedTeamId?.toString()) || ownTeams[0] // TODO ownTeams[0] ist hier suboptimal, aber es darf eigentlich nicht eintreten
    );

    useEffect(() => {
        console.log("Selected team", selectedTeam)
    }, [selectedTeam]);

    return (
        <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Select a team"
                        className={cn("w-[200px] justify-between", className)}
                    >
                        <div className={`mr-2 h-5 w-5 rounded-full shrink-0 bg-gradient-to-br ${selectedTeam.colorSchema.from} ${selectedTeam.colorSchema.to}`} />
                        {selectedTeam.label}
                        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandList>
                            <CommandInput placeholder="Search team..." />
                            <CommandEmpty>No team found.</CommandEmpty>
                            {groups.map((group) => (
                                <CommandGroup key={group.label} heading={group.label}>
                                    {group.teams.map((team) => (
                                        <CommandItem
                                            key={team.value}
                                            onSelect={() => {
                                                setSelectedTeam(team);
                                                setOpen(false);
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
                </PopoverContent>
            </Popover>
        </Dialog>
    )
}