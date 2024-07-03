"use client"

import "@/styles/processList.css";
import CreateProcessButton from "@/components/processList/CreateProcessButton";
import React, {useState} from "react";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ProcessModel} from "@/types/database.types";
import Link from "next/link";
import {useParams} from "next/navigation";

export interface ProcessListProps {
    userId: string;
    teamId: string;
    processes: ProcessModel[] | null;
}

export default function ProcessList({ userId, teamId, processes }: Readonly<ProcessListProps>) {

    const params = useParams<{ processModelId: string }>()
    const [selectedProcessId, setSelectedProcessId] = useState<string | null>(params.processModelId)

    return (
        <section className="processList flex flex-col h-full">
            <form className="flex flex-col flex-1 space-y-2 p-1 overflow-y-auto">
                { processes?.map((process, index) => {
                    return <Link
                        key={`${process.id}`}
                        className="w-full"
                        href={`/${teamId}/editor/${process.id}`}
                        onClick={() => {
                            setSelectedProcessId(process.id.toString())
                        }}
                    >
                        <Card className={`${selectedProcessId === process.id.toString() ? "bg-accent" : ""}`}>
                            <CardHeader>
                                <CardTitle>{ process.name }</CardTitle>
                                <CardDescription>{ process.description }</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                }) }
            </form>
            <CreateProcessButton teamId={teamId} userId={userId} />
        </section>
    );
}