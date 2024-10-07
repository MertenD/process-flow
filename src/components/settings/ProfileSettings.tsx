"use client"

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import React, {useRef, useState} from "react";
import updateProfileSettings from "@/actions/update-profile-settings";
import {toast} from "@/components/ui/use-toast";
import {Profile} from "@/types/database.types";
import {CardActionArea, CardActions} from "@mui/material";
import {useTranslations} from "next-intl";

export interface ProfileSettingsProps {
    profile: Profile
}

export default function ProfileSettings({ profile }: Readonly<ProfileSettingsProps>) {

    const t = useTranslations("settings.profileSettings")

    const [username, setUsername] = useState(profile.username)
    const [email] = useState(profile.email)
    const [avatarSrc, setAvatarSrc] = useState(profile.avatar || "")
    const fileInputRef = useRef<HTMLInputElement>(null)

    function handleProfileSubmit(e: React.FormEvent) {
        e.preventDefault()
        updateProfileSettings(profile.id, username, avatarSrc).then(() => {
            toast({
                title: t("toasts.profileUpdatedTitle"),
                description: t("toasts.profileUpdatedDescription"),
                variant: 'success'
            })
        }).catch((error: Error) => {
            if (error.message.includes("Body exceeded 1 MB limit.")) {
                return toast({
                    title: t("toasts.profileUpdatedPictureTooLargeTitle"),
                    description: t("toasts.profileUpdatedPictureTooLargeDescription"),
                    variant: 'destructive'
                })
            }
            toast({
                title: t("toasts.profileUpdatedErrorTitle"),
                description: t("toasts.profileUpdatedErrorDescription"),
                variant: 'destructive'
            })
        })
    }

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setAvatarSrc(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    function triggerFileInput() {
        fileInputRef.current?.click()
    }

    return <Card className="w-full">
        <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={avatarSrc} alt="Profilbild"/>
                        <AvatarFallback>{ username.slice(0,2).toUpperCase() }</AvatarFallback>
                    </Avatar>
                    <Button type="button" onClick={triggerFileInput}>{t("changeProfilePicture")}</Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden"
                        aria-label="Profilbild hochladen"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="username" className="text-base">{t("username")}</Label>
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-base">{t("email")}</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        readOnly
                        className="bg-muted"
                    />
                </div>
                <Button type="submit">{t("saveChanges")}</Button>
            </form>
        </CardContent>
    </Card>
}