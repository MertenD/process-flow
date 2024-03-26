import BpmnEditor from "@/components/processEditor/modules/flow/BpmnEditor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import ProcessList from "@/components/processList/ProcessList";
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
export default async function Home() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

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
