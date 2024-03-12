import BpmnEditor from "@/components/processEditor/modules/flow/BpmnEditor";
import Image from "next/image";

export default function Home() {
  return (
    <div style={{ height: "100vh" }}>
      <BpmnEditor />
    </div>
  );
}
