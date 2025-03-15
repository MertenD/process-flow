"use client"

import {Redo} from "lucide-react";
import useUndoRedo from "../../hooks/useUndoRedo";
import {Button} from "@/components/ui/button";
import {useTranslations} from "next-intl";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

export default function RedoButton() {

    const t = useTranslations("editor.undoRedo")

    const { redo, canRedo} = useUndoRedo()

    return <TooltipProvider delayDuration={250}>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0" disabled={canRedo} onClick={() => {
                    redo()
                }}>
                    <Redo className="h-4 w-4" />
                    <span className="sr-only">{t("redoButton")}</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-primary">
                <p>{t("redoButton")}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
}