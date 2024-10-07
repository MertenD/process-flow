"use client"

import {Redo} from "lucide-react";
import useUndoRedo from "../hooks/useUndoRedo";
import {Button} from "@/components/ui/button";

export default function RedoButton() {

    const { redo, canRedo} = useUndoRedo()

    return <Button disabled={canRedo} onClick={() => {
        redo()
    }}>
        <Redo className="mr-2 h-4 w-4"/> Redo
    </Button>
}