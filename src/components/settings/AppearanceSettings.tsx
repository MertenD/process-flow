"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {Profile} from "@/types/database.types";
import updateAppearanceSettings from "@/actions/update-appearance-settings";
import {toast} from "@/components/ui/use-toast";
import {useTheme} from "next-themes";

export interface AppearanceSettingsProps {
    profile: Profile
}

export default function AppearanceSettings({ profile }: Readonly<AppearanceSettingsProps>) {

    const { setTheme } = useTheme()

    const [language, setLanguage] = useState<string>(profile.language)
    const [darkMode, setDarkMode] = useState<boolean>(profile.is_dark_mode_enabled)

    function handleGeneralSubmit(e: React.FormEvent){
        e.preventDefault()
        updateAppearanceSettings(profile.id, language, darkMode).then(() => {
            toast({
                title: 'Anzeigeeinstellungen aktualisiert',
                description: 'Ihre Einstellungen wurden erfolgreich aktualisiert',
                variant: 'success'
            })
            setTheme(darkMode ? 'dark' : 'light')
        }).catch((error) => {
            console.error(error)
            toast({
                title: 'Fehler beim Aktualisieren der Einstellungen',
                description: 'Ihre Einstellungen konnten nicht aktualisiert werden',
                variant: 'destructive'
            })
        })
    }

    return <Card>
        <CardHeader>
            <CardTitle>Anwendungseinstellungen</CardTitle>
            <CardDescription>Passen Sie die Anwendung an Ihre Bedürfnisse an</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleGeneralSubmit} className="space-y-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="language" className="text-base">Sprache</Label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger id="language" className="w-[200px]">
                                <SelectValue placeholder="Wählen Sie eine Sprache"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="de">Deutsch</SelectItem>
                                <SelectItem value="en">Englisch</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="dark-mode" className="text-base">Erscheinungsbild</Label>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="dark-mode"
                                checked={darkMode}
                                onCheckedChange={setDarkMode}
                            />
                            <Label htmlFor="dark-mode" className="text-sm font-normal">Dark
                                Mode {darkMode ? 'aktiviert' : 'deaktiviert'}</Label>
                        </div>
                    </div>
                </div>
                <Button type="submit">Änderungen speichern</Button>
            </form>
        </CardContent>
    </Card>
}