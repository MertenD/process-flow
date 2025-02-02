"use client"

import React, { useEffect, useState } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Grid, Trash2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useUndoRedoStore } from "@/stores/UndoRedoStore"
import type { ProcessModel } from "@/model/database/database.types"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import CreateProcessButton from "@/components/processEditor/processList/CreateProcessButton"
import EditProcessButton from "@/components/processEditor/processList/EditProcessButton"
import getProcessModels from "@/actions/get-process-models"
import DeleteProcessButton from "@/components/processEditor/processList/DeleteProcessButton";

export interface ProcessListProps {
    userId: string
    teamId: number
    isMobile?: boolean
}

export default function ProcessList({ userId, teamId, isMobile }: Readonly<ProcessListProps>) {
    const t = useTranslations("editor")
    const { toast } = useToast()
    const params = useParams<{ processModelId: string }>()
    const pathName = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [processes, setProcesses] = useState<ProcessModel[]>([])
    const [selectedProcessId, setSelectedProcessId] = useState<string | null>(params.processModelId)
    const { setPast, setFuture } = useUndoRedoStore()

    useEffect(() => {
        getProcessModels(teamId)
            .then((models) => models.sort((a, b) => a.name.localeCompare(b.name)))
            .then(setProcesses)
            .catch((error) => {
                console.error("Error fetching processes", error)
            })
    }, [teamId])

    useEffect(() => {
        if (params.processModelId !== selectedProcessId) {
            setPast([])
            setFuture([])
        }
        setSelectedProcessId(params.processModelId)
    }, [params, selectedProcessId, setPast, setFuture])

    useEffect(() => {
        const updateSubscription = supabase
            .channel("process_model_insertion")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "process_model",
                },
                (payload) => {
                    if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
                        getProcessModels(teamId)
                            .then((models) => models.sort((a, b) => a.name.localeCompare(b.name)))
                            .then(setProcesses)
                            .catch((error) => {
                                console.error("Error fetching processes", error)
                            })

                        if (payload.eventType === "INSERT" && (payload.new as ProcessModel).created_by === userId) {
                            toast({
                                variant: "success",
                                title: t("toasts.processCreatedTitle"),
                                description: t("toasts.processCreatedDescription"),
                            })
                        }
                    } else if (payload.eventType === "DELETE") {
                        getProcessModels(teamId)
                            .then((models) => models.sort((a, b) => a.name.localeCompare(b.name)))
                            .then(setProcesses)
                            .catch((error) => {
                                console.error("Error fetching processes", error)
                            })

                        if (pathName === `/${teamId}/editor/${payload.old.id}`) {
                            toast({
                                variant: "success",
                                title: t("toasts.processDeletedSuccessfullyTitle", {
                                    name: processes.find((p) => p.id === payload.old.id)?.name,
                                }),
                                description: t("toasts.processDeletedSuccessfullyDescription"),
                            })
                            router.push(`/${teamId}/editor`)
                        }
                    }
                },
            )
            .subscribe()

        return () => {
            updateSubscription.unsubscribe().then()
        }
    }, [pathName, processes, router, supabase, t, teamId, userId, toast])

    return (
        <section className="container mx-auto p-4 flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">{t("title")}</h2>
                <CreateProcessButton teamId={teamId} userId={userId} />
            </div>
            <div
                className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}
            >
                {processes?.map((process) => (
                    <Card
                        key={`${process.id}`}
                        className={"flex flex-col h-full"}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-x-4 px-4 pt-4 pb-4">
                            <CardTitle className="text-sm font-medium">
                                <h3 className="text-lg font-semibold">{process.name}</h3>
                            </CardTitle>
                            <div className="flex items-center space-x-1">
                                <EditProcessButton process={process} />
                                <DeleteProcessButton teamId={teamId} processModelId={process.id} />
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow px-4">
                            <CardDescription className="line-clamp-2">{process.description}</CardDescription>
                        </CardContent>
                        <CardFooter className="w-full px-4">
                            <Link className="w-full" href={`/${teamId}/editor/${process.id}`}>
                                <Button variant="default" className="w-full">
                                    {t("processList.openProcess")}
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    )
}

