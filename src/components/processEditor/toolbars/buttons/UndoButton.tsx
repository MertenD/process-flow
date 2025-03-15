"use client"

import {Undo} from "lucide-react";
import {Button} from "@/components/ui/button";
import React from "react";
import useUndoRedo from "../../hooks/useUndoRedo";
import {useTranslations} from "next-intl";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

export default function UndoButton() {

    const t = useTranslations("editor.undoRedo")

    const { undo, canUndo } = useUndoRedo()

    return <TooltipProvider delayDuration={250}>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0" disabled={canUndo} onClick={() => {
                    undo()
                }}>
                    <Undo className="h-4 w-4" />
                    <span className="sr-only">{t("undoButton")}</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-primary">
                <p>{t("undoButton")}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
}