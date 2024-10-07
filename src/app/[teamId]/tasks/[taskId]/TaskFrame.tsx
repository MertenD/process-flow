"use client"

import React, {useEffect} from "react";
import {createClient} from "@/utils/supabase/client";
import {usePathname, useRouter} from "next/navigation";

export interface TaskFrameProps {
    taskId: string
    teamId: number
    taskUrl: string
}

export default function TaskFrame({ taskId, teamId, taskUrl }: Readonly<TaskFrameProps>) {

    const supabase = createClient()
    const router = useRouter()
    const pathName = usePathname()

    useEffect(() => {
        const subscription = supabase
            .channel("flow_element_instance_redirect_after_complete")
            .on("postgres_changes", {
                event: "UPDATE",
                schema: "public",
                table: "flow_element_instance"
            }, (payload) => {
                if (payload.new.status === "Completed" && pathName === `/${teamId}/tasks/${payload.new.id}`) {
                    router.push(`/${teamId}/tasks`)
                }
            })
            .subscribe()

        return () => {
            subscription.unsubscribe().then()
        }
    }, [supabase, router, pathName, teamId])

    return <iframe className="w-full h-full" src={taskUrl} title={taskId}/>
}