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

  const { data: userData, error } = await supabase.auth.getUser()
  if (error || !userData.user) {
    redirect('/login')
  }

  const { data: teamIds } = await supabase
      .from('profile_role_team')
      .select('id:team')
      .eq('profile', userData.user.id)
      .returns<{ id : string }[]>()

  console.log("teamData: ", teamIds)

  return (
    <main>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={10}>
          {/* TODO: Add better default */}
          <ProcessList teamId={teamIds ? teamIds[0].id : "0"} />
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
