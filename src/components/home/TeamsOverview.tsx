'use client'

import React, {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {CheckIcon, PlusCircleIcon, XIcon} from 'lucide-react'
import {TeamInfo} from "@/model/TeamInfo";
import Link from 'next/link'
import createTeamAndAddCreatorAsAdmin from "@/actions/create-team-and-add-creator-as-admin";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {InvitationWithTeam} from "@/model/database/database.types";
import acceptInvite from "@/actions/accept-invite";
import {createClient} from "@/utils/supabase/client";
import getTeams from "@/actions/get-teams";
import getInvitations from "@/actions/get-invitations";
import declineInvite from "@/actions/decline-invite";
import {useTranslations} from "next-intl";

export interface TeamsOverviewProps {
    userId: string
    userEmail: string
    initialTeams: TeamInfo[]
    initialInvitations: InvitationWithTeam[]
}

export function TeamsOverview({userId, userEmail, initialTeams, initialInvitations}: TeamsOverviewProps) {

    const t = useTranslations("Homepage")

    const supabase = createClient()

    const teamColorSchemes = [
        { name: t("colors.blue"), from: 'from-blue-400', to: 'to-indigo-500' },
        { name: t("colors.green"), from: 'from-green-400', to: 'to-teal-500' },
        { name: t("colors.yellow"), from: 'from-yellow-400', to: 'to-orange-500' },
        { name: t("colors.pink"), from: 'from-pink-400', to: 'to-purple-500' },
        { name: t("colors.red"), from: 'from-red-400', to: 'to-rose-500' },
    ]

    const [newTeamName, setNewTeamName] = useState<string>("")
    const [selectedColorScheme, setSelectedColorScheme] = useState(teamColorSchemes[0])

    const [teams, setTeams] = useState<TeamInfo[]>(initialTeams)
    const [invitations, setInvitations] = useState<InvitationWithTeam[]>(initialInvitations)

    const router = useRouter()

    useEffect(() => {
        const subscription = supabase
            .channel("teams_overview_teams_update")
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "profile_team"
            }, () => {
                getTeams(userId).then(setTeams).catch((error) => {
                    console.error("Error loading teams in TeamsOverview", error.message)
                })
            })
            .subscribe()

        return () => {
            subscription.unsubscribe().then()
        }
    }, [supabase, userId]);

    useEffect(() => {
        const subscription = supabase
            .channel("teams_overview_invitations_update")
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "invitation"
            }, () => {
                getInvitations(userEmail).then(setInvitations).catch((error) => {
                    console.error("Error loading invitations in TeamsOverview", error.message)
                })
            })
            .subscribe()

        return () => {
            subscription.unsubscribe().then()
        }
    }, [supabase, userEmail]);

    function onAcceptInvite(invitation: InvitationWithTeam) {
        acceptInvite(invitation, userId).then(() => {
            toast({
                variant: "success",
                title: t("toasts.inviteAcceptedTitle"),
                description: t("toasts.inviteAcceptedDescription", { name: invitation.team.name })
            })
        }).catch((error) => {
            console.error("Error accepting invitation", error)
            toast({
                variant: "destructive",
                title: t("toasts.inviteAcceptedErrorTitle"),
                description: t("toasts.inviteAcceptedErrorDescription")
            })
        })
    }

    function onDeclineInvite(invitation: InvitationWithTeam) {
        declineInvite(invitation, userId).then(() => {
            toast({
                variant: "success",
                title: t("toasts.inviteDeclinedTitle"),
                description: t("toasts.inviteDeclinedDescription", { name: invitation.team.name })
            })
        }).catch((error) => {
            console.error("Error declining invitation", error)
            toast({
                variant: "destructive",
                title: t("toasts.inviteDeclinedErrorTitle"),
                description: t("toasts.inviteDeclinedErrorDescription")
            })
        })
    }

    const renderCard = (item: any, isTeam: boolean = true) => {
        return <Card
            key={item.team.id}
            className={` relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-102 bg-gradient-to-br ${item.team.colorSchemeFrom} ${item.team.colorSchemeTo}`}
        >
            <CardContent className="flex flex-col items-center justify-center h-32 p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{item.team.name}</h3>
                {!isTeam && (
                    <div className="flex space-x-2">
                        <Button size="sm" variant="secondary" onClick={() => onAcceptInvite(item)}>
                            <CheckIcon className="w-4 h-4 mr-1"/> {t("acceptButton")}
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => onDeclineInvite(item)}>
                            <XIcon className="w-4 h-4 mr-1"/> {t("declineButton")}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    }

    return <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>{t("createTeamTitle")}</CardTitle>
                <CardDescription>{t("createTeamDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-4">
                    <Input
                        type="text"
                        placeholder={t("teamNamePlaceholder")}
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                    />
                    <div className="flex items-center space-x-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={`w-[200px] justify-start`}>
                                    <div
                                        className={`w-4 h-4 bg-gradient-to-r rounded mr-2 ${selectedColorScheme.from} ${selectedColorScheme.to}`}/>
                                    {selectedColorScheme.name}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Card>
                                    <CardContent className="grid gap-2 p-2">
                                        {teamColorSchemes.map((scheme) => (
                                            <Button
                                                key={scheme.name}
                                                variant="ghost"
                                                className="w-full justify-start"
                                                onClick={() => setSelectedColorScheme(scheme)}
                                            >
                                                <div
                                                    className={`w-4 h-4 rounded mr-2 bg-gradient-to-r ${scheme.from} ${scheme.to}`}/>
                                                {scheme.name}
                                            </Button>
                                        ))}
                                    </CardContent>
                                </Card>
                            </PopoverContent>
                        </Popover>
                        <Button onClick={() => {
                            const colorScheme = {"from": selectedColorScheme.from, "to": selectedColorScheme.to}
                            createTeamAndAddCreatorAsAdmin(userId, newTeamName, colorScheme).then((createdTeamId) => {
                                toast({
                                    variant: "success",
                                    title: t("toasts.teamCreatedTitle"),
                                    description: t("toasts.teamCreatedDescription", { name: newTeamName })
                                })
                                setNewTeamName("")
                                router.push(`/${createdTeamId}/tasks`)
                            }).catch((error) => {
                                console.error("Error creating team", error)
                                toast({
                                    variant: "destructive",
                                    title: t("toasts.teamCreatedErrorTitle"),
                                    description: t("toasts.teamCreatedErrorDescription"),
                                })
                            })
                        }}>
                            <PlusCircleIcon className="w-4 h-4 mr-2"/> {t("createButton")}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 w-full gap-4">

            <Card>
                <CardHeader>
                    <CardTitle>{t("yourTeamsTitle")}</CardTitle>
                    <CardDescription>{t("yourTeamsDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[300px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {teams.filter((team: TeamInfo) => team.team.createdBy === userId).map((team: TeamInfo) => {
                                return <Link key={team.teamId + "-link"} href={`/${team.teamId}/stats`}>
                                    {renderCard(team)}
                                </Link>
                            })}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("joinedTeamsTitle")}</CardTitle>
                    <CardDescription>{t("joinedTeamsDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[300px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {teams.filter((team: TeamInfo) => team.team.createdBy !== userId).map((team: TeamInfo) => {
                                return <Link key={team.teamId + "-link"} href={`/${team.teamId}/stats`}>
                                    {renderCard(team)}
                                </Link>
                            })}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

        </div>

        <Card>
            <CardHeader>
                <CardTitle>{t("pendingInvitationsTitle")}</CardTitle>
                <CardDescription>{t("pendingInvitationsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[200px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {invitations.map((invitation) => renderCard(invitation, false))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    </div>
}