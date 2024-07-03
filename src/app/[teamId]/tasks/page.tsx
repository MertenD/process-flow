import React from "react";

export default async function TasksPage({ params }: Readonly<{ params: { teamId: string } }>) {

    return <div className="w-full h-full flex flex-col justify-center items-center bg-accent">
        Select a task to complete
    </div>
}