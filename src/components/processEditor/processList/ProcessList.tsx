"use client"

import "@/styles/processList.css";
import CreateProcessButton from "@/components/processEditor/processList/CreateProcessButton";
import React, {useEffect, useState} from "react";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ProcessModel} from "@/model/database/database.types";
import Link from "next/link";
import {useParams, usePathname, useRouter} from "next/navigation";
import {createClient} from "@/utils/supabase/client";
import getProcessModels from "@/actions/get-process-models";
import {toast} from "@/components/ui/use-toast";
import {useUndoRedoStore} from "@/stores/UndoRedoStore";
import {useTranslations} from "next-intl";

export interface ProcessListProps {
    userId: string;
    teamId: number;
}

export default function ProcessList({userId, teamId}: Readonly<ProcessListProps>) {

    const t = useTranslations("editor")

    const params = useParams<{ processModelId: string }>()
    const pathName = usePathname()
    const router = useRouter();
    const supabase = createClient()
    const [processes, setProcesses] = useState<ProcessModel[]>([])
    const [selectedProcessId, setSelectedProcessId] = useState<string | null>(params.processModelId)
    const { setPast, setFuture } = useUndoRedoStore()

    useEffect(() => {
        getProcessModels(teamId).then(setProcesses).catch((error) => {
            console.error("Error fetching processes", error)
        })
    }, [teamId])

    useEffect(() => {
        if (params.processModelId !== selectedProcessId) {
            setPast([])
            setFuture([])
        }
        setSelectedProcessId(params.processModelId)
    }, [params, selectedProcessId])

    useEffect(() => {
        const updateSubscription = supabase
            .channel("process_model_insertion")
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "process_model"
            }, (payload) => {
                if (payload.eventType === "INSERT") {
                    getProcessModels(teamId).then(setProcesses).catch((error) => {
                        console.error("Error fetching processes", error)
                    })

                    if ((payload.new as ProcessModel).created_by === userId) {
                        toast({
                            variant: "success",
                            title: t("toasts.processCreatedTitle"),
                            description: t("toasts.processCreatedDescription")
                        })
                    }
                } else if (payload.eventType === "DELETE") {
                    getProcessModels(teamId).then(setProcesses).catch((error) => {
                        console.error("Error fetching processes", error)
                    })

                    console.log(pathName, `/${teamId}/editor/${payload.old.id}`)

                    if (pathName === `/${teamId}/editor/${payload.old.id}`) {
                        toast({
                            variant: "success",
                            title: t("toasts.processDeletedSuccessfullyTitle", { name: processes.find(p => p.id === payload.old.id)?.name }),
                            description: t("toasts.processDeletedSuccessfullyDescription")
                        })
                        router.push(`/${teamId}/editor`)
                    }
                }
            })
            .subscribe()

        return () => {
            updateSubscription.unsubscribe().then()
        }
    }, [pathName, processes, router, supabase, teamId, userId]);

    return (
        <section className="processList flex flex-col h-full">
            <form className="flex flex-col flex-1 space-y-2 p-1 overflow-y-auto">
                {processes?.map((process, index) => {
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
                                <CardTitle>{process.name}</CardTitle>
                                <CardDescription>{process.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                })}
            </form>
            <CreateProcessButton teamId={teamId} userId={userId}/>
        </section>
    );
}