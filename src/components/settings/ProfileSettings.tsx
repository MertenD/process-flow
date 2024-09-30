"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import React, {useEffect, useRef, useState} from "react";
import updateProfileSettings from "@/actions/update-profile-settings";
import {toast} from "@/components/ui/use-toast";
import {Profile} from "@/types/database.types";

export interface ProfileSettingsProps {
    profile: Profile
}

export default function ProfileSettings({ profile }: Readonly<ProfileSettingsProps>) {

    const [username, setUsername] = useState(profile.username)
    const [email] = useState(profile.email)
    const [avatarSrc, setAvatarSrc] = useState(profile.avatar || "")
    const fileInputRef = useRef<HTMLInputElement>(null)

    function handleProfileSubmit(e: React.FormEvent) {
        e.preventDefault()
        updateProfileSettings(profile.id, username, avatarSrc).then(() => {
            toast({
                title: 'Profil aktualisiert',
                description: 'Ihre Profilinformationen wurden erfolgreich aktualisiert',
                variant: 'success'
            })
        }).catch((error) => {
            console.error(error)
            toast({
                title: 'Fehler beim Aktualisieren des Profils',
                description: 'Ihre Profilinformationen konnten nicht aktualisiert werden',
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

    return <Card>
        <CardHeader>
            <CardTitle>Persönliche Informationen</CardTitle>
            <CardDescription>Verwalten Sie Ihre Profilinformationen</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={avatarSrc} alt="Profilbild"/>
                        <AvatarFallback>{ username.slice(0,2).toUpperCase() }</AvatarFallback>
                    </Avatar>
                    <Button type="button" onClick={triggerFileInput}>Profilbild ändern</Button>
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
                    <Label htmlFor="username">Benutzername</Label>
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">E-Mail</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        readOnly
                        className="bg-muted"
                    />
                </div>
                <Button type="submit">Änderungen speichern</Button>
            </form>
        </CardContent>
    </Card>
}