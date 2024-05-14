import "@/styles/processList.css";
import {createClient} from '@/utils/supabase/server';
import {redirect} from "next/navigation";
import CreateProcessButton from "@/components/processList/CreateProcessButton";
import React from "react";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export interface ProcessListProps {
    userId: string;
    teamId: string;
    selectedProcessId?: string;
}

export default async function ProcessList({ userId, teamId, selectedProcessId }: Readonly<ProcessListProps>) {

    // TODO Add specific type for processes
    const supabase = createClient();
    const { data: processes } = await supabase
        .from("process_model")
        .select("*")
        .eq("belongs_to", teamId)

    async function handleProcessClick(processId: string) {
        "use server"

        redirect(`/${teamId}/editor/${processId}`)
    }

    return (
        <section className="processList flex flex-col h-full">
            <form className="flex flex-col flex-1 space-y-2 p-1 overflow-y-auto">
                { processes?.map((process, index) => {
                    return <button
                        key={`${process.id}`}
                        className="w-full"
                        formAction={handleProcessClick.bind(null, process.id)}
                    >
                        <Card className={`${selectedProcessId?.toString() === process.id.toString() ? "bg-accent" : ""}`}>
                            <CardHeader>
                                <CardTitle>{ process.name }</CardTitle>
                                <CardDescription>{ process.description }</CardDescription>
                            </CardHeader>
                        </Card>
                    </button>
                }) }
            </form>
            <CreateProcessButton teamId={teamId} userId={userId} />
        </section>
    );
}