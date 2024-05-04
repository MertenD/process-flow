import BpmnEditor from "@/components/processEditor/modules/flow/BpmnEditor";

export default async function EditorProcessPage({ params }: Readonly<{ params: { processModelId: string } }>) {

  return (
      <div style={{ height: "100%", width: "100%", paddingLeft: 5 }}>
        <BpmnEditor processModelId={params.processModelId} /> : <div>Select a process model to edit</div>
      </div>
  );
}
