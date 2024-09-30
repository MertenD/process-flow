"use client"

import {ChevronLeft} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function BackButton() {

    return <Button
        variant="ghost"
        size="icon"
        className="mr-4"
        onClick={() => window.history.back()}
        aria-label="Zurück"
    >
        <ChevronLeft className="h-6 w-6"/>
    </Button>
}