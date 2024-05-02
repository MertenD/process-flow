"use client"

import BpmnEditor from "@/components/processEditor/modules/flow/BpmnEditor";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup,} from "@/components/ui/resizable"
import ProcessList from "@/components/processList/ProcessList";
import {createClient} from '@/utils/supabase/client'
import {useEffect, useState} from "react";
import {User} from "@supabase/gotrue-js";

export default function Home() {

  const [userData, setUserData] = useState<User | null>(null)
  const [teamIds, setTeamIds] = useState<{ id: string }[]>([])
  const [selectedProcessModelId, setSelectedProcessModelId] = useState<string | null>(null)

  const supabase = createClient()
  
  useEffect(() => {
    const redirectIfNotLoggedIn = async () => {
        const { data: userData, error } = await supabase.auth.getUser()
        if (error || !userData.user) {
          window.location.href = '/login'
        } else {
          setUserData(userData.user)
        }
    }
    
    redirectIfNotLoggedIn().then()
  }, [supabase.auth])

  useEffect(() => {
    const fetchTeamIds = async () => {
      if (userData === null) return
      const { data: teamIds } = await supabase
          .from('profile_role_team')
          .select('id:team')
          .eq('profile', userData.id)
          .returns<{ id : string }[]>()
      setTeamIds(teamIds || [])
    }

    fetchTeamIds().then()
  }, [supabase, userData]);

  return (
    <main>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={10}>
          {/* TODO: Add better default */}
          <ProcessList teamId={teamIds.length > 0 ? teamIds[0].id : "0"} onProcessModelSelected={(processModelId) => {
            console.log(processModelId)
            setSelectedProcessModelId(processModelId)
          }} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={90}>
          <div style={{ height: "100%", width: "100%", paddingLeft: 5 }}>
            { selectedProcessModelId ? <BpmnEditor processModelId={selectedProcessModelId} /> : <div>Select a process model to edit</div> }
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
