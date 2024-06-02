"use client"

import {Button} from "@/components/ui/button"
import React from "react";
import {GitBranchPlus} from "lucide-react";
import {toast} from "@/components/ui/use-toast";
import createProcessInstance from "@/actions/create-process-instance";

export interface CreateInstanceButtonProps {
    processModelId: string
}

export default function CreateInstanceButton({ processModelId }: Readonly<CreateInstanceButtonProps>) {
    return <Button onClick={() => {
        createProcessInstance(processModelId).then((processInstanceId) => {
            toast({
                title: "Process Instance created!",
                description: "A new process instance with the id '" + processInstanceId + "' has been created.",
                variant: "success"
            })
        }).catch((error) => {
            toast({
                variant: "destructive",
                title: "Something went wrong!",
                description: error.message,
            })
        })
    }}>
        <GitBranchPlus className="mr-2 h-4 w-4" /> Create Instance
    </Button>
}