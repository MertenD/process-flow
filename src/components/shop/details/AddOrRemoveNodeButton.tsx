"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import saveNodeToTeam from "@/actions/shop/save-node-to-team"
import removeNodeFromTeam from "@/actions/shop/remove-node-from-team"
import isNodeSavedInTeam from "@/actions/is-node-saved-in-team"

interface AddOrRemoveNodeProps {
    teamId: number
    nodeDefinitionId: number
}

export default function AddOrRemoveNodeButton({ teamId, nodeDefinitionId }: AddOrRemoveNodeProps) {
    const t = useTranslations("shop.node.details")
    const [isAdded, setIsAdded] = useState<boolean | null>(null)

    useEffect(() => {
        isNodeSavedInTeam(teamId, nodeDefinitionId).then(setIsAdded)
    }, [teamId, nodeDefinitionId])

    function onClick() {
        if (isAdded) {
            removeNodeFromTeam(teamId, nodeDefinitionId).then(() => setIsAdded(false))
        } else {
            saveNodeToTeam(teamId, nodeDefinitionId).then(() => setIsAdded(true))
        }
    }

    return <Button disabled={isAdded == null} onClick={onClick} className={isAdded ? "bg-destructive hover:bg-destructive/90" : ""}>
        {isAdded ? (
            <><Trash2 className="mr-2 h-4 w-4" />{t("removeFromEditor")}</>
        ) : (
            <><Plus className="mr-2 h-4 w-4" />{t("addToEditor")}</>
        )}
    </Button>
}
