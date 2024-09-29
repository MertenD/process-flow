import {Button} from "@/components/ui/button";
import {ConfirmationDialog} from "@/components/ConfirmationDialog";
import React, {useState} from "react";
import {toast} from "@/components/ui/use-toast";
import {createClient} from "@/utils/supabase/client";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";

export interface DeleteProcessButtonProps {
    teamId: number
    processModelId: number
    processModelName: string
}

export default function DeleteProcessButton({ teamId, processModelId, processModelName }: DeleteProcessButtonProps) {

    const supabase = createClient();

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false)

    const router = useRouter();

    const handleDeleteClick = () => {
        setIsConfirmDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (processModelId) {
            try {
                const { error } = await supabase
                    .from('process_model')
                    .delete()
                    .eq('id', processModelId);

                if (error) throw error;

                router.push(`/${teamId}/editor`)
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to delete the process model."
                });
            }
        }
        setIsConfirmDialogOpen(false)
    };

    return <>
        <Button variant="destructive" onClick={handleDeleteClick}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete Model
        </Button>
        <ConfirmationDialog
            isOpen={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={handleDeleteConfirm}
            title="Prozessmodell wirklich löschen?"
            description={`Möchten sie das Modell "${processModelName}" wirklich löschen? 
                Dieser Vorgang kann nicht rückgängig gemacht werden. 
                Alle Daten die mit diesem Prozessmodell verknüpft sind, werden ebenfalls gelöscht.`}
            confirmLabel="Prozess löschen"
        />
    </>
}