import {Button} from "@/components/ui/button";
import {ConfirmationDialog} from "@/components/ConfirmationDialog";
import React, {useState} from "react";
import {toast} from "@/components/ui/use-toast";
import {createClient} from "@/utils/supabase/client";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";

export interface DeleteProcessButtonProps {
    teamId: number
    processModelId: number
}

export default function DeleteProcessButton({ teamId, processModelId }: DeleteProcessButtonProps) {

    const t = useTranslations("editor.delete")

    const supabase = createClient();

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false)

    const router = useRouter();

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
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
        <Button variant="ghost" className="" size="icon" onClick={(e: React.MouseEvent) => handleDeleteClick(e)}>
            <Trash2 className="h-4 w-4" />
        </Button>
        <ConfirmationDialog
            isOpen={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={handleDeleteConfirm}
            title={t("deleteProcessTitle")}
            description={t("deleteProcessDescription")}
            confirmLabel={t("deleteButtonConfirm")}
        />
    </>
}