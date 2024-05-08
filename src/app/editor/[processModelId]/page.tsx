import BpmnEditor from "@/components/processEditor/modules/flow/BpmnEditor";
import SaveButton from "@/components/SaveButton";
import CreateInstanceButton from "@/components/CreateInstanceButton";

export default async function EditorProcessPage({ params }: Readonly<{ params: { processModelId: string } }>) {

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
