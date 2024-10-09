"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React from "react";
import createInvitation from "@/actions/create-invitation";
import {toast} from "@/components/ui/use-toast";
import {useTranslations} from "next-intl";

export interface InviteMemberProps {
    teamId: number
}

export default function InviteMember({teamId}: InviteMemberProps) {

    const t = useTranslations("team.invite")

    function onInviteMember(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string

        createInvitation(email, teamId).then(() => {
            toast({
                title: t("toasts.invitationSentTitle"),
                description: t("toasts.invitationSentDescription", { email }),
                variant: "success"
            })
        }).catch((error) => {
            toast({
                title: t("toasts.invitationSentErrorTitle"),
                description: t("toasts.invitationSentErrorDescription", { email }),
                variant: "destructive"
            })
        })
    }

    return <Card>
        <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={onInviteMember}>
                <div className="flex gap-2">
                    <Input
                        name="email"
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        required
                    />
                    <Button type="submit">{t("inviteButton")}</Button>
                </div>
            </form>
        </CardContent>
    </Card>
}