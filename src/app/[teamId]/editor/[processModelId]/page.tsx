import BpmnEditor from "@/components/processEditor/modules/flow/BpmnEditor";
import SaveButton from "@/components/SaveButton";
import CreateInstanceButton from "@/components/CreateInstanceButton";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

// TODO Generell middleware um zu überprüfen, ob man auf gewisse Routen zugriff hat

export default async function EditorProcessPage({ params }: Readonly<{ params: { processModelId: string, teamId: string } }>) {

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/login")
    }

    const { data: processModel } = await supabase
        .from('process_model')
        .select('belongs_to')
        .eq('id', params.processModelId)
        .single<{ belongs_to: string }>()

    if (params.teamId != processModel?.belongs_to) {
        redirect(`/${params.teamId}/editor`)
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="w-full bg-amber-400 p-2 flex flex-row space-x-2">
                <SaveButton />
                <CreateInstanceButton />
            </div>
            <div className="w-full h-full pl-1">
                <BpmnEditor processModelId={params.processModelId}/> : <div>Select a process model to edit</div>
            </div>
        </div>
    );
}
