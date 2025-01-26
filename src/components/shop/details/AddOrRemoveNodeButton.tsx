"use client"

import {Plus, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useTranslations} from "next-intl";
import {useEffect, useState} from "react";
import saveNodeToTeam from "@/actions/shop/save-node-to-team";
import removeNodeFromTeam from "@/actions/shop/remove-node-from-team";
import {createClient} from "@/utils/supabase/client";

interface AddOrRemoveNodeProps {
    teamId: number
    nodeDefinitionId: number
}

export default function AddOrRemoveNodeButton({ teamId, nodeDefinitionId }: AddOrRemoveNodeProps) {
    const t = useTranslations("shop.node.details")
    const supabase = createClient()

    const [isAdded, setIsAdded] = useState<boolean | null>(null)

    useEffect(() => {
        supabase
            .from("teams_node_definitions")
            .select("*")
            .eq("team_id", teamId)
            .eq("node_definition_id", nodeDefinitionId)
            .then(({ data, error }) => {
                if (error) {
                    console.error("Failed to fetch node definition", error)
                    return
                }
                setIsAdded(data.length > 0)
            })

        const subscription = supabase
            .channel("update_add_or_remove_nodes_button")
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "teams_node_definitions",
                filter: `team_id=eq.${teamId}`
            }, () => {
                supabase
                    .from("teams_node_definitions")
                    .select("*")
                    .eq("team_id", teamId)
                    .eq("node_definition_id", nodeDefinitionId)
                    .then(({ data, error }) => {
                        if (error) {
                            console.error("Failed to fetch node definition", error)
                            return
                        }
                        setIsAdded(data.length > 0)
                    })
            })
            .subscribe()

        return () => {
            subscription.unsubscribe().then()
        }
    }, [supabase, teamId, nodeDefinitionId])

    function onClick() {
        if (isAdded) {
            removeNodeFromTeam(teamId, nodeDefinitionId).then(() =>
                setIsAdded(false)
            )
        } else {
            saveNodeToTeam(teamId, nodeDefinitionId).then(() =>
                setIsAdded(true)
            )
        }
    }

    return <Button disabled={isAdded == null} onClick={onClick} className={isAdded ? "bg-destructive hover:bg-destructive/90" : ""}>
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