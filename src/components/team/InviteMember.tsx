"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React from "react";
import createInvitation from "@/actions/create-invitation";
import {toast} from "@/components/ui/use-toast";

export interface InviteMemberProps {
    teamId: number
}

export default function InviteMember({ teamId }: InviteMemberProps) {

    function onInviteMember(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string

        createInvitation(email, teamId).then(() => {
            toast({
                title: "Einladung gesendet",
                description: `Die Einladung an ${email} wurde erfolgreich gesendet.`,
                variant: "success"
            })
        }).catch((error) => {
            toast({
                title: "Fehler beim Einladen",
                description: `Die Einladung an ${email} konnte nicht gesendet werden: ${error.message}`,
                variant: "destructive"
            })
        })
    }

    return <Card>
        <CardHeader>
            <CardTitle>Mitglied einladen</CardTitle>
            <CardDescription>Laden sie Mitglieder über die Email Adresse zu diesem Team hinzu.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={onInviteMember}>
                <div className="flex gap-2">
                    <Input
                        name="email"
                        type="email"
                        placeholder="E-Mail Adresse"
                        required
                    />
                    <Button type="submit">Einladen</Button>
                </div>
            </form>
        </CardContent>
    </Card>
}