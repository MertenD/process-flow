import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import CreateNodePage from "@/components/shop/create-node/CreateNodePage";
import getNodeDefinition from "@/actions/shop/get-node-definition";

export default async function CreateNode({ params }: { params: { teamId: number, nodeDefinitionId: number } }) {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user || !userData.user.id) {
        redirect("/authenticate")
    }

    const nodeDefinition = await getNodeDefinition(params.nodeDefinitionId)

    return <CreateNodePage
        teamId={params.teamId}
        userId={userData.user.id}
        initialNodeDefinition={nodeDefinition}
        nodeDefinitionId={params.nodeDefinitionId}
    />
}