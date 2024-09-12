"use server"

import {createClient} from "@/utils/supabase/server";
import {InvitationWithTeam} from "@/types/database.types";

export default async function acceptInvite(invitationWithTeam: InvitationWithTeam, userId: string): Promise<void> {

    const supabase = createClient()

    const { data: invitation, error: inviteError } = await supabase
        .rpc("accept_invite", {
            invitation_id_param: invitationWithTeam.id,
            profile_id_param: userId
        })

    if (inviteError) {
        throw new Error(inviteError?.message || "Error accepting invitation")
    }
}