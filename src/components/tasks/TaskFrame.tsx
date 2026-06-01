"use client"

import React from "react"
import Link from "next/link"
import { CircleX } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface TaskFrameProps {
    taskId: string
    teamId: number
    taskUrl: string
}

export default function TaskFrame({ taskId, teamId, taskUrl }: Readonly<TaskFrameProps>) {

    return <section className="w-full h-full flex flex-col items-end">
        <Link href={`/${teamId}/tasks`} className="m-4">
            <Button variant="outline" size="icon">
                <CircleX className="h-[1.2rem] w-[1.2rem]" />
            </Button>
        </Link>
        <iframe className="w-full h-full" src={taskUrl} title={taskId}/>
    </section>
}
