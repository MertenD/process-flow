"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"
import type { ProcessModel } from "@/model/database/database.types"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Pencil } from "lucide-react"
import updateProcessModelDetails from "@/actions/update-process-model-details";

export interface EditProcessButtonProps {
    process: ProcessModel
}

export default function EditProcessButton({ process }: Readonly<EditProcessButtonProps>) {
    const t = useTranslations("editor")
    const { toast } = useToast()
    const [showEditProcessDialog, setShowEditProcessDialog] = useState(false)
    const [name, setName] = useState(process.name)
    const [description, setDescription] = useState(process.description)

    const handleUpdateProcess = async (e: React.MouseEvent) => {
        try {
            console.log("process.id", process.id)
            console.log("name", name)
            console.log("description", description)
            await updateProcessModelDetails(process.id, name, description || "")
            e.stopPropagation()
            setShowEditProcessDialog(false)
            toast({
                variant: "success",
                title: t("processList.editProcess.processUpdatedTitle"),
                description: t("processList.editProcess.processUpdatedDescription"),
            })
        } catch (error) {
            console.error("Error updating process", error)
            toast({
                variant: "destructive",
                title: t("processList.editProcess.processUpdateErrorTitle"),
                description: t("processList.editProcess.processUpdateErrorDescription"),
            })
        }
    }

    return (
        <Dialog open={showEditProcessDialog} onOpenChange={setShowEditProcessDialog}>
            <Button variant="ghost" size="icon" onClick={() => setShowEditProcessDialog(true)}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">{t("processList.edit")}</span>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("processList.editProcess.title")}</DialogTitle>
                    <DialogDescription>{t("processList.editProcess.description")}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Label htmlFor="process-name">{t("name")}</Label>
                        <Input id="process-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("name")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="process-description">{t("description")}</Label>
                        <Textarea
                            id="process-description"
                            // @ts-ignore
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t("description")}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowEditProcessDialog(false)}>
                        {t("cancelButton")}
                    </Button>
                    <Button type="submit" onClick={handleUpdateProcess}>
                        {t("save.saveButton")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

