import BpmnEditor from "@/components/processEditor/modules/flow/BpmnEditor";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup,} from "@/components/ui/resizable"
import ProcessList from "@/components/processList/ProcessList";
import {createClient} from '@/utils/supabase/server'
import {redirect} from "next/navigation";

export default async function Home({ params }: Readonly<{ params: { processModelId: string } }>) {

  // TODO Check if user has permission for this process model

  const supabase = createClient()

  const {data: userData, error} = await supabase.auth.getUser()
  if (error || !userData.user) {
    redirect("/login")
  }

  const { data: teamIds } = await supabase
      .from('profile_role_team')
      .select('id:team')
      .eq('profile', userData.user.id)
      .returns<{ id : string }[]>()

  return (
    <main>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={10}>
          {/* TODO: Add better default */}
          <ProcessList teamId={teamIds?.[0] ? teamIds[0].id : "0"} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={90}>
          <div style={{ height: "100%", width: "100%", paddingLeft: 5 }}>
            <BpmnEditor processModelId={params.processModelId} /> : <div>Select a process model to edit</div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
