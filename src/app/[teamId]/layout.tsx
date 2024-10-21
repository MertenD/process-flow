import React from "react";
import HeaderBarWrapper from "@/components/headerbar/HeaderBarWrapper";

export default function TeamLayout({ children, params }: Readonly<{ children: React.ReactNode, params: { teamId: number } }>) {

    return <>
        <HeaderBarWrapper selectedTeamId={params.teamId} />
        { children }
    </>
}