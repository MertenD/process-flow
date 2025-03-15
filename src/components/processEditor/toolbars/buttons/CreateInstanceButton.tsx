"use client"

import {Button} from "@/components/ui/button"
import React, {useContext, useEffect, useState} from "react";
import {GitBranchPlus} from "lucide-react";
import {toast} from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import getProcessInputVariableNames from "@/actions/get-process-input-variable-names";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {CopyableUrlField} from "@/components/ui/copyable-url-field";
import {Separator} from "@/components/ui/separator";
import {useTranslations} from "next-intl";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {DialogActions} from "@mui/material";

export interface CreateInstanceButtonProps {
    processModelId: number
}

export default function CreateInstanceButton({ processModelId }: Readonly<CreateInstanceButtonProps>) {

    const t = useTranslations("editor.instance")

    const [showCreateInstanceDialog, setShowCreateInstanceDialog] = React.useState<boolean>(false)
    const [inputVariableNames, setInputVariableNames] = React.useState<string[]>([])

    const [origin, setOrigin] = useState<string>("")
    const createInstancePath = "/api/instance/create"

    useEffect(() => {
        setOrigin(window.location.origin)
    }, []);

    function handleCreateInstance(inputs: {[key: string]: string}) {
        fetch (createInstancePath, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    processModelId,
                    inputs
                })
            }).then(async (res) => {
                if (!res.ok) {
                    throw new Error()
                }
                toast({
                   title: t("toasts.instanceCreatedTitle"),
                   description: t("toasts.instanceCreatedDescription"),
                   variant: "success"
                })
            }).catch((error) => {
                toast({
                    variant: "destructive",
                    title: t("toasts.instanceCreatedErrorTitle"),
                    description: t("toasts.instanceCreatedErrorDescription"),
                })
            })
    }

    return <TooltipProvider delayDuration={250}>
        <Dialog open={showCreateInstanceDialog} onOpenChange={setShowCreateInstanceDialog}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0"
                            onClick={() => getProcessInputVariableNames(processModelId).then(setInputVariableNames)}
                        >
                            <GitBranchPlus className="h-4 w-4" />
                            <span className="sr-only">{t("instanceButton")}</span>
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent className="bg-primary">
                    <p>{t("instanceButton")}</p>
                </TooltipContent>
            </Tooltip>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("createNewInstanceTitle")}</DialogTitle>
                    <DialogDescription>{t("createNewInstanceDescription")}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    {inputVariableNames.map((name) => (
                        <div key={name} className="space-y-2">
                            <Label htmlFor={name}>{name}</Label>
                            <Input id={name} placeholder={name} />
                        </div>
                    ))}
                    <div className="pt-6 space-y-4">
                        <Separator />
                        <h2 className="text-lg font-semibold">{t("instanceAPIExplanation")}</h2>
                        <CopyableUrlField url={`${origin}${createInstancePath}`} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateInstanceDialog(false)}>{t("cancel")}</Button>
                    <Button
                        onClick={() => {
                            const inputs = Object.fromEntries(
                                inputVariableNames.map((name) => [name, (document.getElementById(name) as HTMLInputElement).value]),
                            )
                            handleCreateInstance(inputs)
                            setShowCreateInstanceDialog(false)
                        }}
                    >
                        {t("create")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </TooltipProvider>
}