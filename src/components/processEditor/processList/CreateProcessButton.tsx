"use client"

import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import React from "react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import createProcessModel from "@/actions/create-process-model";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {Textarea} from "@/components/ui/textarea";
import {useTranslations} from "next-intl";
import {CirclePlus, Plus} from "lucide-react";

export interface CreateProcessButtonProps {
    userId: string
    teamId: number
}

export default function CreateProcessButton({userId, teamId}: Readonly<CreateProcessButtonProps>) {

    const t = useTranslations("editor")

    const router = useRouter()
    const [showCreateProcessDialog, setShowCreateProcessDialog] = React.useState(false)

    return <Dialog open={showCreateProcessDialog} onOpenChange={setShowCreateProcessDialog}>
        <Button onClick={() => setShowCreateProcessDialog(true)}>
            <Plus />
            <span className="pl-2 text-center">{t("createProcess")}</span>
        </Button>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t("createProcess")}</DialogTitle>
                <DialogDescription>{t("createProcessDescription")}</DialogDescription>
            </DialogHeader>
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Label htmlFor="process-name">{t("name")}</Label>
                        <Input id="process-name" placeholder={t("name")}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="process-description">{t("description")}</Label>
                        <Textarea id="process-description" placeholder={t("description")}/>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateProcessDialog(false)}>
                    {t("cancelButton")}
                </Button>
                <Button type="submit" onClick={() => {
                    const processName = (document.getElementById("process-name") as HTMLInputElement).value;
                    const processDescription = (document.getElementById("process-description") as HTMLInputElement).value;
                    createProcessModel(teamId, processName, processDescription, userId).then((createdProcessId) => {
                        setShowCreateProcessDialog(false)
                        router.push(`/${teamId}/editor/${createdProcessId}`)
                    }).catch((error) => {
                        toast({
                            variant: "destructive",
                            title: t("toasts.processCreatedErrorTitle"),
                            description: t("processCreatedErrorDescription"),
                        })
                    })
                }}>{t("createButton")}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}