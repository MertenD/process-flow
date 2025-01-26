"use client"

import {Plus, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useTranslations} from "next-intl";
import {useState} from "react";

interface AddOrRemoveNodeProps {
    nodeDefinitionId: number
}

export default function AddOrRemoveNodeButton({ nodeDefinitionId }: AddOrRemoveNodeProps) {
    const t = useTranslations("shop.node.details")

    // TODO Get Information from Database and change isAdded accordingly
    const [isAdded, setIsAdded] = useState<boolean>(false)

    function onClick() {
        if (isAdded) {
            setIsAdded(false)
        } else {
            setIsAdded(true)
        }
    }

    return <Button onClick={onClick} className={isAdded ? "bg-destructive hover:bg-destructive/90" : ""}>
        {isAdded ? (
            <>
                <Trash2 className="mr-2 h-4 w-4" />
                { t("removeFromEditor") }
            </>
        ) : (
            <>
                <Plus className="mr-2 h-4 w-4" />
                { t("addToEditor") }
            </>
        )}
    </Button>
}