"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {ConfirmationDialog} from "@/components/ConfirmationDialog";
import {toast} from "@/components/ui/use-toast";
import {createClient} from "@/utils/supabase/client";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";

export interface OwnerDangerZoneSettingsProps {
    teamId: number
    teamName: string
}

export default function OwnerDangerZoneSettings({ teamId, teamName }: Readonly<OwnerDangerZoneSettingsProps>){

    const t = useTranslations("settings.teamSettings.ownerDangerZone")

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false)

    const supabase = createClient()

    const router = useRouter()

    const confirmDeleteTeam = async () => {
        try {
            const {error} = await supabase
                .from('team')
                .delete()
                .eq('id', teamId)

            if (error) throw error

            toast({
                title: "Team gelöscht",
                description: `Das Team "${teamName}" wurde erfolgreich gelöscht.`,
                variant: "success"
            })

            router.replace("/")
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Fehler beim Löschen des Teams",
                description: `Das Team "${teamName}" konnte nicht gelöscht werden.`
            })
        }
        setIsConfirmDialogOpen(false)
    }

    return <Card className="border-destructive">
        <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col items-start">
                    <h3 className="text-lg font-semibold">{t("deleteTeamTitle")}</h3>
                    <p className="text-sm">{t("deleteTeamDescription")}</p>
                </div>
                <Button variant="destructive" onClick={() => setIsConfirmDialogOpen(true)}>{t("deleteTeamButton")}</Button>
            </div>
        </CardContent>

        <ConfirmationDialog
            isOpen={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={confirmDeleteTeam}
            title={`Team "${teamName}" wirklich löschen?`}
            description={`Möchten Sie das Team "${teamName}" wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden. Alle Daten, die mit diesem Team verknüpft sind, werden ebenfalls gelöscht.`}
            confirmLabel="Team löschen"
        />
    </Card>
}