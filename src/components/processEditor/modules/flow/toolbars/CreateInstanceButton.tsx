"use client"

import {Button} from "@/components/ui/button"
import React, {useEffect} from "react";
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
import {createClient} from "@/utils/supabase/client";
import getProcessInputVariableNames from "@/actions/get-process-input-variable-names";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {CopyableUrlField} from "@/components/ui/copyable-url-field";
import {Separator} from "@/components/ui/separator";

export interface CreateInstanceButtonProps {
    processModelId: number
}

export default function CreateInstanceButton({ processModelId }: Readonly<CreateInstanceButtonProps>) {

    const [showCreateInstanceDialog, setShowCreateInstanceDialog] = React.useState<boolean>(false)
    const [inputVariableNames, setInputVariableNames] = React.useState<string[]>([])
    const createInstancePath = "/api/instance/create"

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
                   title: "Process Instance created!",
                   description: res.text(),
                   variant: "success"
                })
            }).catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Something went wrong!",
                    description: error.message,
                })
            })
    }

    return <Dialog open={showCreateInstanceDialog} onOpenChange={setShowCreateInstanceDialog}>
        <Button onClick={() => {
            getProcessInputVariableNames(processModelId)
                .then(setInputVariableNames)
                .then(() => setShowCreateInstanceDialog(true))
        }}>
            <GitBranchPlus className="mr-2 h-4 w-4" /> Create Instance
        </Button>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create Process Instance</DialogTitle>
                <DialogDescription>
                    Create a new process instance for the selected process model
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
                { inputVariableNames.map((inputVariableName) => {
                    return <div key={inputVariableName} className="space-y-2">
                        <Label htmlFor={inputVariableName}>{ inputVariableName }</Label>
                        <Input id={inputVariableName} placeholder={ inputVariableName } />
                    </div>
                }) }
                <div className="pt-8 space-y-2">
                    <Separator/>
                    <h2 className="text-md font-semibold">You can also send a request to this URL to create a new instance:</h2>
                    <CopyableUrlField url={`${window.location.host}${createInstancePath}`}/>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateInstanceDialog(false)}>
                    Cancel
                </Button>
                <Button type="submit" onClick={() => {
                    const inputs: {[key: string]: string} = {}
                    inputVariableNames.forEach((inputVariableName) => {
                        inputs[inputVariableName] = (document.getElementById(inputVariableName) as HTMLInputElement).value
                    })
                    handleCreateInstance(inputs)
                    setShowCreateInstanceDialog(false)
                }}>Create</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}