"use client"

import {ChevronLeft} from "lucide-react";
import {Button} from "@/components/ui/button";

interface BackButtonProps {
    title?: string
    className?: string
}

export default function BackButton({ title, className }: BackButtonProps) {

    return <Button
        variant="ghost"
        size="icon"
        className={"flex flex-row items-center pr-4 w-min " + className}
        onClick={() => window.history.back()}
        aria-label="Zurück"
    >
        <ChevronLeft className="h-4 w-4" />
        {title && <span className="ml-2">{title}</span>}
    </Button>
}