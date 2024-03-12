import BpmnEditor from "@/components/processEditor/modules/flow/BpmnEditor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function Home() {
  return (
    <div style={{ height: "100vh" }}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          Processes
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div style={{ height: "100%", width: "100%", paddingLeft: 5 }}>
            <BpmnEditor />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
