"use client"

import {Undo} from "lucide-react";
import {Button} from "@/components/ui/button";
import React from "react";
import useUndoRedo from "../hooks/useUndoRedo";
import {useTranslations} from "next-intl";

export default function UndoButton() {

    const t = useTranslations("editor.undoRedo")

    const { undo, canUndo } = useUndoRedo()

    return <Button disabled={canUndo} onClick={() => {
        undo()
    }}>
        <Undo className="mr-2 h-4 w-4"/> {t("undoButton")}
    </Button>
}