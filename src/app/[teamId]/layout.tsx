import React from "react";
import HeaderBar from "@/components/headerbar/HeaderBar";

export default function TeamLayout({ children, params }: Readonly<{ children: React.ReactNode, params: { teamId: string } }>) {

    return <>
        <HeaderBar selectedTeamId={params.teamId} />
        { children }
    </>
}