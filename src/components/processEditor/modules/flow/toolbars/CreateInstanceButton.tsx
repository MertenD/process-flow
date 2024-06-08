"use client"

import {Button} from "@/components/ui/button"
import React from "react";
import {GitBranchPlus} from "lucide-react";
import {toast} from "@/components/ui/use-toast";

export interface CreateInstanceButtonProps {
    processModelId: string
}

export default function CreateInstanceButton({ processModelId }: Readonly<CreateInstanceButtonProps>) {
    return <Button onClick={() => {
        fetch ("/api/instance/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    processModelId
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
    }}>
        <GitBranchPlus className="mr-2 h-4 w-4" /> Create Instance
    </Button>
}