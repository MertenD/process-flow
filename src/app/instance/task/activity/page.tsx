import {ActivityType} from "@/model/ActivityType";
import TextInputTask from "@/app/instance/task/activity/TextInputTask";
import React from "react";
import SingleChoiceTask from "@/app/instance/task/activity/SingleChoiceTask";

export interface ActivitySearchParams {
    task: string
    choices: string
    infoText: string
    description: string
    activityType: ActivityType
    variableName: string
    responsePath: string
    flowElementInstanceId: string
}


export default async function Page({ searchParams }: { searchParams: ActivitySearchParams }) {

    let activityContent = <div>There is no activity matching the given activity type.</div>
    if (searchParams.activityType === ActivityType.TEXT_INPUT) {
        activityContent = <TextInputTask
            task={searchParams.task}
            description={searchParams.description}
        />
    } else if (searchParams.activityType === ActivityType.SINGLE_CHOICE) {
        activityContent = <SingleChoiceTask
            task={searchParams.task}
            description={searchParams.description}
            choices={searchParams.choices.split(",").map(choice => choice.trim())}
            variableName={searchParams.variableName}
            responsePath={searchParams.responsePath}
            flowElementInstanceId={searchParams.flowElementInstanceId}
        />
    }

    return <div className="w-full h-full">
        { activityContent }
    </div>
}