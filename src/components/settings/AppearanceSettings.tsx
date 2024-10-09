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
import {useTranslations} from "next-intl";

export interface AppearanceSettingsProps {
    profile: Profile
}

export default function AppearanceSettings({ profile }: Readonly<AppearanceSettingsProps>) {

    const t = useTranslations("settings.appearanceSettings")

    const { setTheme, theme } = useTheme()

    const [language, setLanguage] = useState<string>(profile.language)
    const [tmpTheme, setTmpTheme] = useState<Theme>(profile.theme)

    function handleGeneralSubmit(e: React.FormEvent){
        e.preventDefault()
        updateAppearanceSettings(profile.id, language, tmpTheme).then(() => {
            toast({
                title: t("toasts.appearanceUpdatedTitle"),
                description: t("toasts.appearanceUpdatedDescription"),
                variant: 'success'
            })
            setTheme(tmpTheme)
        }).catch((error) => {
            console.error(error)
            toast({
                title: t("toasts.appearanceUpdatedErrorTitle"),
                description: t("toasts.appearanceUpdatedErrorDescription"),
                variant: 'destructive'
            })
        })
    }

    return <Card>
        <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleGeneralSubmit} className="space-y-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="language" className="text-base">{t("language")}</Label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger id="language" className="w-[200px]">
                                <SelectValue placeholder="Wählen Sie eine Sprache"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="de">{t("languages.de")}</SelectItem>
                                <SelectItem value="en">{t("languages.en")}</SelectItem>
                                <SelectItem value="sr">{t("languages.sr")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="dark-mode" className="text-base">{t("theme")}</Label>
                        <div className="flex items-center space-x-2">
                            <RadioGroup value={tmpTheme} onValueChange={(newValue: Theme) => {
                                setTmpTheme(newValue)
                            }}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="light" id="appearance-light" />
                                    <Label htmlFor="appearance-light">{t("themes.light")}</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="dark" id="appearance-dark" />
                                    <Label htmlFor="appearance-dark">{t("themes.dark")}</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="system" id="appearance-system" />
                                    <Label htmlFor="appearance-system">{t("themes.system")}</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </div>
                <Button type="submit">{t("saveChanges")}</Button>
            </form>
        </CardContent>
    </Card>
}