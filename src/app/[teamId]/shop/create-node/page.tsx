import { redirect } from "next/navigation"
import CreateNodePage from "@/components/shop/create-node/CreateNodePage"
import { requireSession } from "@/lib/session"

export default async function CreateNode({ params }: { params: { teamId: number } }) {

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    return <CreateNodePage teamId={params.teamId} userId={session.user.id} />
}
