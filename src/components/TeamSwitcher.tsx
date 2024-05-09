"use client"

import React from 'react';

import {cn} from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Check, ChevronsUpDown, CirclePlus} from "lucide-react";
import createTeamAndAddCreatorAsAdmin from "@/actions/create-team-and-add-creator-as-admin";
import { useToast } from "@/components/ui/use-toast"

export type Team = {
    label: string;
    value: string;
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
    typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {
    userId: string
    ownTeams: Team[]
    otherTeams: Team[]
    selectedTeamId?: string
}

export default function TeamSwitcher({ className, userId, ownTeams, otherTeams, selectedTeamId }: Readonly<TeamSwitcherProps>) {
    const { toast } = useToast()

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
        [...ownTeams, ...otherTeams].find(team => team.value.toString() === selectedTeamId?.toString()) ?? {
            label: "Select a team",
            value: ""
        }
    );

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
                        <Avatar className="mr-2 h-5 w-5">
                            <AvatarImage
                                src={`https://avatar.vercel.sh/${selectedTeam.value}.png`}
                                alt={selectedTeam.label}
                                className="grayscale"
                            />
                            <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
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
                                            <Avatar className="mr-2 h-5 w-5">
                                                <AvatarImage
                                                    src={`https://avatar.vercel.sh/${team.value}.png`}
                                                    alt={team.label}
                                                    className="grayscale"
                                                />
                                                <AvatarFallback>SC</AvatarFallback>
                                            </Avatar>
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
                        <CommandSeparator />
                        <CommandList>
                            <CommandGroup>
                                <DialogTrigger asChild>
                                    <CommandItem
                                        onSelect={() => {
                                            setOpen(false);
                                            setShowNewTeamDialog(true);
                                        }}
                                    >
                                        <CirclePlus className="mr-2 h-5 w-5" />
                                        Create Team
                                    </CommandItem>
                                </DialogTrigger>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create team</DialogTitle>
                    <DialogDescription>
                        Add a new team to manage products and customers.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div className="space-y-4 py-2 pb-4">
                        <div className="space-y-2">
                            <Label htmlFor="team-name">Team name</Label>
                            <Input id="team-name" placeholder="Acme Inc." />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={() => {
                        const teamName = (document.getElementById("team-name") as HTMLInputElement).value;
                        createTeamAndAddCreatorAsAdmin(userId, teamName).then((createdTeamId) => {
                            setShowNewTeamDialog(false);
                            const createdTeam = { label: teamName, value: createdTeamId.toString() } as Team;
                            ownTeams.push(createdTeam)
                            setSelectedTeam(createdTeam)
                            window.location.href = window.location.href.replace(/\/\d+\//, `/${createdTeamId}/`)
                        }).catch((error) => {
                            toast({
                                variant: "destructive",
                                title: "Something went wrong!",
                                description: error.message,
                            })
                        })
                    }}>Continue</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}