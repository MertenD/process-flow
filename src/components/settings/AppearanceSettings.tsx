"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {Profile, Theme} from "@/types/database.types";
import updateAppearanceSettings from "@/actions/update-appearance-settings";
import {toast} from "@/components/ui/use-toast";
import {useTheme} from "next-themes";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";

export interface AppearanceSettingsProps {
    profile: Profile
}

export default function AppearanceSettings({ profile }: Readonly<AppearanceSettingsProps>) {

    const { setTheme, theme } = useTheme()

    const [language, setLanguage] = useState<string>(profile.language)
    const [tmpTheme, setTmpTheme] = useState<Theme>(profile.theme)

    function handleGeneralSubmit(e: React.FormEvent){
        e.preventDefault()
        updateAppearanceSettings(profile.id, language, tmpTheme).then(() => {
            toast({
                title: 'Anzeigeeinstellungen aktualisiert',
                description: 'Ihre Einstellungen wurden erfolgreich aktualisiert',
                variant: 'success'
            })
            setTheme(tmpTheme)
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
                            <RadioGroup value={tmpTheme} onValueChange={(newValue: Theme) => {
                                setTmpTheme(newValue)
                            }}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="light" id="appearance-light" />
                                    <Label htmlFor="appearance-light">Hell</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="dark" id="appearance-dark" />
                                    <Label htmlFor="appearance-dark">Dunkel</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="system" id="appearance-system" />
                                    <Label htmlFor="appearance-system">System</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </div>
                <Button type="submit">Änderungen speichern</Button>
            </form>
        </CardContent>
    </Card>
}