"use client"

import React, {useEffect} from "react";
import {createClient} from "@/utils/supabase/client";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import {CircleX} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Tooltip} from "@/components/ui/tooltip";
import {toast} from "@/components/ui/use-toast";

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

    return <section className="w-full h-full flex flex-col items-end">
        <Link href={`/${teamId}/tasks`} className="m-4">
            <Button variant="outline" size="icon">
                <CircleX className="h-[1.2rem] w-[1.2rem]" />
            </Button>
        </Link>
        <iframe className="w-full h-full" src={taskUrl} title={taskId}/>
    </section>
}