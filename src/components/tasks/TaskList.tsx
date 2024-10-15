"use client"

import "@/styles/processList.css";
import {useParams, usePathname} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ManualTaskWithTitleAndDescription, Role} from "@/model/database/database.types";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {createClient} from "@/utils/supabase/client";
import {toast} from "@/components/ui/use-toast";
import getTasks from "@/actions/get-tasks";
import {Badge} from "@/components/ui/badge";
import getRoles from "@/actions/get-roles";
import {useTranslations} from "next-intl";
import {GamificationType} from "@/model/GamificationType";
import {PointsType} from "@/model/PointsType";
import {Award} from "lucide-react";
import {GamificationOptions} from "@/model/GamificationOptions";

export interface TaskListProps {
    teamId: number;
    userId: string
}

interface TaskData {
    gamificationType?: GamificationType;
    gamificationOptions?: GamificationOptions
}

export default function TaskList({teamId, userId}: Readonly<TaskListProps>) {

    const t = useTranslations("tasks")

    const params = useParams<{ taskId: string }>()
    const pathName = usePathname()
    const supabase = createClient()
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(params.taskId)
    const [tasks, setTasks] = useState<ManualTaskWithTitleAndDescription[]>([])
    const [roles, setRoles] = useState<Role[]>([])

    useEffect(() => {
        getRoles(teamId).then(setRoles)

        const subscription = supabase
            .channel("flow_element_instance_update_role")
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "role"
            }, () => {
                getRoles(teamId).then(setRoles)
            })
            .subscribe()

        return () => {
            subscription.unsubscribe().then()
        }
    }, [supabase, teamId]);

    useEffect(() => {
        getTasks(teamId, userId).then(setTasks).catch((error) => {
            console.error("Error fetching tasks", error)
        })
    }, [teamId, userId]);

    useEffect(() => {
        if (tasks && tasks.length > 0) {
            console.log("Tasks:", tasks)
        }
    }, [tasks])

    useEffect(() => {
        setSelectedTaskId(params.taskId)
    }, [params]);

    useEffect(() => {
        const updateSubscription = supabase
            .channel("flow_element_instance_update_task")
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "flow_element_instance" // TODO hier eine bessere Tabelle wählen und ggf. die Bedingung anpassen
            }, (payload) => {

                getTasks(teamId, userId).then(setTasks).catch((error) => {
                    console.error("Error fetching tasks", error)
                })

                if (payload.eventType === "UPDATE" && pathName === `/${teamId}/tasks/${payload.new.id}` && payload.new.status === "Completed") {
                    setSelectedTaskId(null)
                    toast({
                        variant: "success",
                        title: t("toasts.taskCompletedTitle"),
                        description: t("toasts.taskCompletedDescription")
                    })
                }
            })
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "profile_role_team"
            }, () => {
                getTasks(teamId, userId).then(setTasks).catch((error) => {
                    console.error("Error fetching tasks", error)
                })
            })
            .subscribe()

        return () => {
            updateSubscription.unsubscribe().then()
        }
    }, [pathName, supabase, t, teamId, userId]);

    return <section className="processList flex flex-col h-full">
        <form className="flex flex-col flex-1 space-y-2 p-1 overflow-y-auto">
            {tasks?.filter((task: ManualTaskWithTitleAndDescription) => task.status === "Todo").map((task: ManualTaskWithTitleAndDescription, index: number) => {
                const role = roles.find(role => role.id.toString() === task.assigned_role)
                return <Link
                    key={`${task.id}`}
                    className="w-full"
                    href={`/${teamId}/tasks/${task.id}`}
                    onClick={() => {
                        setSelectedTaskId(task.id.toString())
                    }}
                >
                    <Card className={`${selectedTaskId?.toString() === task.id.toString() ? "bg-accent" : ""}`}>
                        <CardHeader>
                            <CardTitle>
                                <div className="w-full flex flex-row justify-between">
                                    {task.name}
                                </div>
                            </CardTitle>
                            <CardDescription>
                                <div className="flex flex-col space-y-2">
                                    <div>{task.description}</div>
                                    <div className="flex flex-row flex-wrap">
                                        <Badge
                                            style={{backgroundColor: role?.color}}
                                        >{role?.name}</Badge>
                                        {(task.data as TaskData)?.gamificationType === GamificationType.NONE ? null : (
                                            (task.data as TaskData)?.gamificationType === GamificationType.POINTS ?
                                                (((task.data as TaskData).gamificationOptions)?.pointType === PointsType.EXPERIENCE ?
                                                        <Badge className="bg-green-600">{((task.data as TaskData).gamificationOptions)?.pointsForSuccess} XP</Badge> :
                                                        <Badge className="bg-yellow-500">{((task.data as TaskData).gamificationOptions)?.pointsForSuccess} Coins</Badge>
                                                ) :
                                                <Badge key={index} variant="secondary" className="flex items-center">
                                                    <Award className="mr-1 h-4 w-4"/>
                                                    {((task.data as TaskData).gamificationOptions)?.badgeType}
                                                </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            })}
            {tasks.length === 0 && <p className="text-center">{t("noTasksAvailable")}</p>}
        </form>
    </section>
}