"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import React from "react";
import {MarkdownContent} from "@/components/MarkdownContent";

export interface InfoTaskProps {
    task: string
    description: string
    infoText: string
    responsePath: string
    flowElementInstanceId: string
    userId: string
}

export default function InfoTask({ task, description, infoText, flowElementInstanceId, responsePath, userId }: Readonly<InfoTaskProps>) {

    function onFinish() {
        fetch(responsePath, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                flowElementInstanceId,
                data: {},
                completedBy: userId
            })
        }).then((response) => {
            if (response.ok) {
                window.parent.postMessage({ type: "taskComplete" }, "*")
            } else {
                console.error("Error submitting: HTTP", response.status)
            }
        }).catch((error) => {
            console.error("Error submitting", error)
        })
    }

    return <div className="h-full w-full flex flex-col justify-center items-center">
        <Card className="w-2/3">
            <CardHeader>
                <CardTitle>{task}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <MarkdownContent content={description}/>
                </div>
                <div className="mb-4">
                    <MarkdownContent content={infoText}/>
                </div>
                <Button onClick={onFinish}>Finish</Button>
            </CardContent>
        </Card>
    </div>
}