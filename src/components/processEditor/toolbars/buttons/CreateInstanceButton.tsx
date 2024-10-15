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
    DialogTitle
} from "@/components/ui/dialog";
import getProcessInputVariableNames from "@/actions/get-process-input-variable-names";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {CopyableUrlField} from "@/components/ui/copyable-url-field";
import {Separator} from "@/components/ui/separator";
import {useTranslations} from "next-intl";

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

    return <Dialog open={showCreateInstanceDialog} onOpenChange={setShowCreateInstanceDialog}>
        <Button onClick={() => {
            getProcessInputVariableNames(processModelId)
                .then(setInputVariableNames)
                .then(() => setShowCreateInstanceDialog(true))
        }}>
            <GitBranchPlus className="mr-2 h-4 w-4" /> {t("instanceButton")}
        </Button>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t("createNewInstanceTitle")}</DialogTitle>
                <DialogDescription>{t("createNewInstanceDescription")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
                { inputVariableNames.map((inputVariableName) => {
                    return <div key={inputVariableName} className="space-y-2">
                        <Label htmlFor={inputVariableName}>{ inputVariableName }</Label>
                        <Input id={inputVariableName} placeholder={ inputVariableName } />
                    </div>
                }) }
                <div className="pt-8 space-y-4">
                    <Separator/>
                    <h2 className="text-md">{t("instanceAPIExplanation")}</h2>
                    <CopyableUrlField url={`${origin}${createInstancePath}`}/>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateInstanceDialog(false)}>
                    {t("cancel")}
                </Button>
                <Button type="submit" onClick={() => {
                    const inputs: {[key: string]: string} = {}
                    inputVariableNames.forEach((inputVariableName) => {
                        inputs[inputVariableName] = (document.getElementById(inputVariableName) as HTMLInputElement).value
                    })
                    handleCreateInstance(inputs)
                    setShowCreateInstanceDialog(false)
                }}>{t("create")}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}