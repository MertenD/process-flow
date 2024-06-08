import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

export default async function TasksPage({ params }: Readonly<{ params: { teamId: string } }>) {

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/login")
    }

    const {data: tasks, error: tasksError} = await supabase
        .from("flow_element_instance")
        .select(`
            *, 
            process_instance!inner ( 
                process_model!inner ( 
                    belongs_to 
                ) 
            )`)
        .eq("status", "Todo")
        .eq("process_instance.process_model.belongs_to", params.teamId)

    return tasks && (
        <div>
            { JSON.stringify(tasks, null, 2) }
        </div>
    )
}