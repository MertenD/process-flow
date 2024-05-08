"use client"

import {Button} from "@/components/ui/button"
import React from "react";
import {GitBranchPlus} from "lucide-react";

export default function CreateInstanceButton() {
    return <Button onClick={() => {
        console.log("create instance")
    }}>
        <GitBranchPlus className="mr-2 h-4 w-4" /> Create Instance
    </Button>
}