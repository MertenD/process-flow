"use client"

import {Redo} from "lucide-react";
import useUndoRedo from "../hooks/useUndoRedo";
import {Button} from "@/components/ui/button";
import {useTranslations} from "next-intl";

export default function RedoButton() {

    const t = useTranslations("editor.undoRedo")

    const { redo, canRedo} = useUndoRedo()

    return <Button disabled={canRedo} onClick={() => {
        redo()
    }}>
        <Redo className="mr-2 h-4 w-4"/> {t("redoButton")}
    </Button>
}