import {ActivityType} from "@/model/ActivityType";
import TextInputTask from "@/app/instance/task/activity/TextInputTask";
import React from "react";
import SingleChoiceTask from "@/app/instance/task/activity/SingleChoiceTask";
import InfoTask from "@/app/instance/task/activity/InfoTask";
import MultipleChoiceTask from "@/app/instance/task/activity/MultipleChoiceTask";

export interface ActivitySearchParams {
    task: string
    choices: string
    infoText: string
    description: string
    activityType: ActivityType
    userInputVariableName: string
    responsePath: string
    flowElementInstanceId: string
    inputRegex: string
    userId: string
}


export default async function Page({ searchParams }: { searchParams: Promise<ActivitySearchParams> }) {

    const params = await searchParams

    let activityContent = <div>There is no activity matching the given activity type.</div>
    if (params.activityType === ActivityType.TEXT_INPUT) {
        activityContent = <TextInputTask
            task={params.task}
            description={params.description}
            inputRegex={params.inputRegex}
            flowElementInstanceId={params.flowElementInstanceId}
            userInputVariableName={params.userInputVariableName}
            responsePath={params.responsePath}
            userId={params.userId}
        />
    } else if (params.activityType === ActivityType.SINGLE_CHOICE) {
        activityContent = <SingleChoiceTask
            task={params.task}
            description={params.description}
            choices={params.choices.split(",").map(choice => choice.trim())}
            userInputVariableName={params.userInputVariableName}
            responsePath={params.responsePath}
            flowElementInstanceId={params.flowElementInstanceId}
            userId={params.userId}
        />
    } else if (params.activityType === ActivityType.MULTIPLE_CHOICE) {
        activityContent = <MultipleChoiceTask
            task={params.task}
            description={params.description}
            choices={params.choices.split(",").map(choice => choice.trim())}
            userInputVariableName={params.userInputVariableName}
            responsePath={params.responsePath}
            flowElementInstanceId={params.flowElementInstanceId}
            userId={params.userId}
        />
    } else if (params.activityType === ActivityType.INFO) {
        activityContent = <InfoTask
            task={params.task}
            description={params.description}
            infoText={params.infoText}
            responsePath={params.responsePath}
            flowElementInstanceId={params.flowElementInstanceId}
            userId={params.userId}
        />
    }

    return <div className="w-full h-full">
        { activityContent }
    </div>
}