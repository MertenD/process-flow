import BpmnEditor from "@/components/processEditor/modules/flow/BpmnEditor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import ProcessList from "@/components/processList/ProcessList";

export default function Home() {
  return (
    <main>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={10}>
          <ProcessList />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={90}>
          <div style={{ height: "100%", width: "100%", paddingLeft: 5 }}>
            <BpmnEditor />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
