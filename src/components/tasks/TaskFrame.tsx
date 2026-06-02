"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CircleX } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface TaskFrameProps {
    taskId: string
    teamId: number
    taskUrl: string
}

export default function TaskFrame({ taskId, teamId, taskUrl }: Readonly<TaskFrameProps>) {
    const router = useRouter()

    useEffect(() => {
        function handleMessage(event: MessageEvent) {
            if (event.data?.type === "taskComplete") {
                router.push(`/${teamId}/tasks`)
            }
        }
        window.addEventListener("message", handleMessage)
        return () => window.removeEventListener("message", handleMessage)
    }, [teamId, router])

    return <section className="w-full h-full flex flex-col items-end">
        <Link href={`/${teamId}/tasks`} className="m-4">
            <Button variant="outline" size="icon">
                <CircleX className="h-[1.2rem] w-[1.2rem]" />
            </Button>
        </Link>
        <iframe className="w-full h-full" src={taskUrl} title={taskId}/>
    </section>
}
