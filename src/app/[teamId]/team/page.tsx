import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import RoleManagement from "@/components/team/RoleManagement";
import InviteMember from "@/components/team/InviteMember";
import React from "react";
import {MemberManagement} from "@/components/team/MemberManagement";
import {getTranslations} from "next-intl/server";

export default async function TeamPage({ params }: Readonly<{ params: { teamId: number } }>) {

    const t = await getTranslations("team")

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/authenticate")
    }

    return <div className="container mx-auto p-4 flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <InviteMember teamId={params.teamId} />
        <RoleManagement teamId={params.teamId} />
        <MemberManagement teamId={params.teamId} />
    </div>
}