"use client"

import "@/styles/processList.css";
import {useParams, usePathname} from "next/navigation";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ManualTaskWithTitleAndDescription, Role} from "@/types/database.types";
import Link from "next/link";
import {useEffect, useState} from "react";
import {createClient} from "@/utils/supabase/client";
import {toast} from "@/components/ui/use-toast";
import getTasks from "@/actions/get-tasks";
import {Badge} from "@/components/ui/badge";
import getRoles from "@/actions/get-roles";

export interface TaskListProps {
    teamId: number;
    userId: string
}

export default function TaskList({teamId, userId}: Readonly<TaskListProps>) {

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
                table: "role",
                filter: `belongs_to=eq.${teamId}`
            }, () => {
                getRoles(teamId).then(setRoles)
            })
            .subscribe()

        return () => {
            subscription.unsubscribe().then()
        }
    }, [teamId]);

    useEffect(() => {
        getTasks(teamId, userId).then(setTasks).catch((error) => {
            console.error("Error fetching tasks", error)
        })
    }, [teamId, userId]);

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
                        title: "Task completed",
                        description: "The task has been completed and removed from your task list."
                    })
                }
            })
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "profile_role_team",
                filter: `profile_id=eq.${userId}`
            }, () => {
                getTasks(teamId, userId).then(setTasks).catch((error) => {
                    console.error("Error fetching tasks", error)
                })
            })
            .subscribe()

        return () => {
            updateSubscription.unsubscribe().then()
        }
    }, [pathName, supabase, teamId, userId]);

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
                                    <Badge
                                        style={{backgroundColor: role?.color}}
                                    >{role?.name}</Badge>
                                </div>
                            </CardTitle>
                            <CardDescription>{task.description}</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            })}
        </form>
    </section>
}