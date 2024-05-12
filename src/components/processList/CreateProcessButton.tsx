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

export interface CreateProcessButtonProps {
    userId: string
    teamId: string
}

export default function CreateProcessButton({ userId, teamId }: Readonly<CreateProcessButtonProps>) {

    const router = useRouter()
    const [showCreateProcessDialog, setShowCreateProcessDialog] = React.useState(false)

    return <Dialog open={showCreateProcessDialog} onOpenChange={setShowCreateProcessDialog}>
        <Button onClick={() => setShowCreateProcessDialog(true)}>
            Create new Process
        </Button>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create process</DialogTitle>
                <DialogDescription>
                    Create a new process model for your team
                </DialogDescription>
            </DialogHeader>
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Label htmlFor="process-name">Process name</Label>
                        <Input id="process-name" placeholder="process name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="process-description">Process description</Label>
                        <Textarea id="process-description" placeholder="process description" />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateProcessDialog(false)}>
                    Cancel
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
                            title: "Something went wrong!",
                            description: error.message,
                        })
                    })
                }}>Continue</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}