"use client"

import React from "react";
import SaveButton from "@/components/processEditor/toolbars/buttons/SaveButton";
import CreateInstanceButton from "@/components/processEditor/toolbars/buttons/CreateInstanceButton";
import ExportButton from "@/components/processEditor/toolbars/buttons/ExportButton";
import UndoButton from "@/components/processEditor/toolbars/buttons/UndoButton";
import RedoButton from "@/components/processEditor/toolbars/buttons/RedoButton";
import {Separator} from "@/components/ui/separator";

interface EditorToolbarProps {
    processModelId: number
}

export function EditorToolbar({ processModelId }: EditorToolbarProps) {

    return <div className="bg-card flex flex-row space-x-2 p-4">
        <SaveButton processModelId={processModelId} />
        <CreateInstanceButton processModelId={processModelId} />
        <ExportButton />
        <Separator orientation="vertical" />
        <UndoButton />
        <RedoButton />
    </div>
}

