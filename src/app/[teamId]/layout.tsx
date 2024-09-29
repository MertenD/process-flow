import React from "react";
import HeaderBar from "@/components/headerbar/HeaderBar";

export default function TeamLayout({ children, params }: Readonly<{ children: React.ReactNode, params: { teamId: number } }>) {

    return <>
        <HeaderBar selectedTeamId={params.teamId} />
        { children }
    </>
}