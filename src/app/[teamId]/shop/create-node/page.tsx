import { redirect } from "next/navigation"
import CreateNodePage from "@/components/shop/create-node/CreateNodePage"
import { requireSession } from "@/lib/session"

export default async function CreateNode({ params }: { params: Promise<{ teamId: string }> }) {

    const { teamId: _teamId } = await params
    const teamId = Number(_teamId)

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    return <CreateNodePage teamId={teamId} userId={session.user.id} />
}
