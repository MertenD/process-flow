'use client'

import React, {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {CheckIcon, PlusCircleIcon, TrashIcon, XIcon} from 'lucide-react'
import {TeamInfo} from "@/model/TeamInfo";
import Link from 'next/link'
import createTeamAndAddCreatorAsAdmin from "@/actions/create-team-and-add-creator-as-admin";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {teamColorSchemes} from "@/model/colors";
import {InvitationWithTeam} from "@/types/database.types";
import acceptInvite from "@/actions/accept-invite";
import {createClient} from "@/utils/supabase/client";
import getTeams from "@/actions/get-teams";
import getInvitations from "@/actions/get-invitations";
import declineInvite from "@/actions/decline-invite";
import {ConfirmationDialog} from "@/components/ConfirmationDialog";
import removeProfileFromTeam from "@/actions/remove-profile-from-team";

type ConfirmDialogState = {
    isOpen: boolean
    teamName: string | null
    teamId: string | null
}

export interface TeamsOverviewProps {
    userId: string
    userEmail: string
    initialTeams: TeamInfo[]
    initialInvitations: InvitationWithTeam[]
}

export function TeamsOverview({userId, userEmail, initialTeams, initialInvitations}: TeamsOverviewProps) {

    const supabase = createClient()

    const [newTeamName, setNewTeamName] = useState<string>("")
    const [selectedColorScheme, setSelectedColorScheme] = useState(teamColorSchemes[0])

    const [teams, setTeams] = useState<TeamInfo[]>(initialTeams)
    const [invitations, setInvitations] = useState<InvitationWithTeam[]>(initialInvitations)

    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
        isOpen: false,
        teamName: null,
        teamId: null
    })

    const router = useRouter()

    useEffect(() => {
        const subscription = supabase
            .channel("teams_overview_teams_update")
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "profile_team",
                filter: `profile_id=eq.${userId}`
            }, () => {
                getTeams(userId).then(setTeams)
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
                table: "invitation",
                filter: `email=eq.${userEmail}`
            }, () => {
                getInvitations(userEmail).then(setInvitations)
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
                title: "Einladung angenommen!",
                description: `Sie sind jetzt Mitglied von "${invitation.team.name}".`,
            })
        }).catch((error) => {
            // deutsch
            toast({
                variant: "destructive",
                title: "Es ist ein Fehler aufgetreten!",
                description: `Die Einladung konnte nicht angenommen werden: ${error.message}`
            })
        })
    }

    function onDeclineInvite(invitation: InvitationWithTeam) {
        declineInvite(invitation, userId).then(() => {
            toast({
                variant: "success",
                title: "Einladung abgelehnt!",
                description: `Die Einladung für "${invitation.team.name}" wurde abgelehnt.`,
            })
        }).catch((error) => {
            toast({
                variant: "destructive",
                title: "Es ist ein Fehler aufgetreten!",
                description: `Die Einladung konnte nicht abgelehnt werden. Bitte versuche es erneut: ${error.message}`
            })
        })
    }

    function onDeleteTeamClicked(team: TeamInfo) {
        setConfirmDialog({isOpen: true, teamName: team.team.name, teamId: team.teamId})
    }

    const confirmDeleteTeam = async () => {
        if (!confirmDialog.teamId) {
            toast({
                title: "Fehler beim Löschen des Teams",
                description: `Das Team konnte nicht entfernt werden.`,
                variant: "destructive"
            })
            setConfirmDialog({isOpen: false, teamName: null, teamId: null})
            return
        }
        try {
            const {error} = await supabase
                .from('team')
                .delete()
                .eq('id', confirmDialog.teamId);

            if (error) throw error;

            toast({
                title: "Team gelöscht",
                description: `Das Team "${confirmDialog.teamName}" wurde erfolgreich gelöscht.`,
                variant: "success"
            })
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Fehler beim Löschen des Teams",
                description: `Das Team "${confirmDialog.teamName}" konnte nicht gelöscht werden.`
            });
        }
        setConfirmDialog({isOpen: false, teamName: null, teamId: null})
    }

    const renderCard = (item: any, isTeam: boolean = true) => {
        const isUserOwnerOfTeam = userId === item.team.createdBy
        return <Card
            key={item.team.id}
            className={` relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-102 bg-gradient-to-br ${item.team.colorSchemeFrom} ${item.team.colorSchemeTo}`}
        >
            <CardContent className="flex flex-col items-center justify-center h-32 p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{item.team.name}</h3>
                {isTeam && isUserOwnerOfTeam && (
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            onDeleteTeamClicked(item)
                        }}
                        className="absolute top-2 right-2 text-white hover:bg-white/20"
                    >
                        <TrashIcon className="w-4 h-4"/>
                        <span className="sr-only">Löschen</span>
                    </Button>
                )}
                {!isTeam && (
                    <div className="flex space-x-2">
                        <Button size="sm" variant="secondary" onClick={() => onAcceptInvite(item)}>
                            <CheckIcon className="w-4 h-4 mr-1"/> Annehmen
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => onDeclineInvite(item)}>
                            <XIcon className="w-4 h-4 mr-1"/> Ablehnen
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    }

    return <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Ihre Teams</CardTitle>
                <CardDescription>Klicken Sie auf ein Team, um es auszuwählen und zur Hauptanwendung zu
                    gelangen.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[300px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teams.map((team: TeamInfo) => {
                            return <Link key={team.teamId + "-link"} href={`/${team.teamId}/tasks`}>
                                {renderCard(team)}
                            </Link>
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Ausstehende Einladungen</CardTitle>
                <CardDescription>Nehmen Sie Einladungen an oder lehnen Sie sie ab.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[200px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {invitations.map((invitation) => renderCard(invitation, false))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Neues Team erstellen</CardTitle>
                <CardDescription>Geben Sie einen Namen für Ihr neues Team ein und wählen Sie ein
                    Farbschema.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-4">
                    <Input
                        type="text"
                        placeholder="Team Name"
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
                                    title: "Team erstellt!",
                                    description: `Das Team "${newTeamName}" wurde erfolgreich erstellt.`,
                                })
                                setNewTeamName("")
                                router.push(`/${createdTeamId}/tasks`)
                            }).catch((error) => {
                                toast({
                                    variant: "destructive",
                                    title: "Something went wrong!",
                                    description: error.message,
                                })
                            })
                        }}>
                            <PlusCircleIcon className="w-4 h-4 mr-2"/> Erstellen
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
        <ConfirmationDialog
            isOpen={confirmDialog.isOpen}
            onClose={() => setConfirmDialog({isOpen: false, teamName: null, teamId: null})}
            onConfirm={confirmDeleteTeam}
            title={`Team "${confirmDialog.teamName}" wirklich löschen?`}
            description={`Möchten Sie das Team "${confirmDialog.teamName}" wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden. Alle Daten, die mit diesem Team verknüpft sind, werden ebenfalls gelöscht.`}
            confirmLabel="Team löschen"
        />
    </div>
}