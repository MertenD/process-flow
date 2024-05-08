"use client"

import { Button } from "@/components/ui/button"
import {Save} from "lucide-react";

export default function SaveButton() {
    return <Button onClick={() => {
        console.log("hi")
    }}>
        <Save className="mr-2 h-4 w-4" /> Save Model
    </Button>
}