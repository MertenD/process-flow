"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {ConfirmationDialog} from "@/components/ConfirmationDialog";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import removeProfileFromTeam from "@/actions/remove-profile-from-team";

export interface MemberDangerZoneSettingsProps {
    teamId: number
    teamName: string
    userId: string
}

export default function MemberDangerZoneSettings({ teamId, teamName, userId }: Readonly<MemberDangerZoneSettingsProps>){

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false)

    const router = useRouter()

    const confirmLeaveTeam = async () => {

        removeProfileFromTeam(teamId, userId).then(() => {
            toast({
                title: "Team verlassen",
                description: `Das Team "${teamName}" wurde erfolgreich verlassen.`,
                variant: "success"
            })
            router.replace("/")
        }).catch((error: Error) => {
            console.error(error)
            toast({
                variant: "destructive",
                title: "Fehler beim verlassen des Teams",
                description: `Das Team "${teamName}" konnte nicht verlassen werden.`
            })
        })
        setIsConfirmDialogOpen(false)
    }

    return <Card className="border-destructive">
        <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col items-start">
                    <h3 className="text-lg font-semibold">Team verlassen</h3>
                    <p className="text-sm">{`Verlassen Sie "${teamName}" und löschen Sie alle Ihre zugehörigen Daten unwiderruflich.`}</p>
                </div>
                <Button variant="destructive" onClick={() => setIsConfirmDialogOpen(true)}>Team verlassen</Button>
            </div>
        </CardContent>

        <ConfirmationDialog
            isOpen={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={confirmLeaveTeam}
            title={`Team "${teamName}" wirklich verlassen?`}
            description={`Möchten Sie das Team "${teamName}" wirklich verlassen? Alle Daten, die mit Ihnen und diesem Team verknüpft sind, werden gelöscht.`}
            confirmLabel="Team verlassen"
        />
    </Card>
}