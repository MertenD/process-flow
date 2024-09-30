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


export default async function Page({ searchParams }: { searchParams: ActivitySearchParams }) {

    let activityContent = <div>There is no activity matching the given activity type.</div>
    if (searchParams.activityType === ActivityType.TEXT_INPUT) {
        activityContent = <TextInputTask
            task={searchParams.task}
            description={searchParams.description}
            inputRegex={searchParams.inputRegex}
            flowElementInstanceId={searchParams.flowElementInstanceId}
            userInputVariableName={searchParams.userInputVariableName}
            responsePath={searchParams.responsePath}
            userId={searchParams.userId}
        />
    } else if (searchParams.activityType === ActivityType.SINGLE_CHOICE) {
        activityContent = <SingleChoiceTask
            task={searchParams.task}
            description={searchParams.description}
            choices={searchParams.choices.split(",").map(choice => choice.trim())}
            userInputVariableName={searchParams.userInputVariableName}
            responsePath={searchParams.responsePath}
            flowElementInstanceId={searchParams.flowElementInstanceId}
            userId={searchParams.userId}
        />
    } else if (searchParams.activityType === ActivityType.MULTIPLE_CHOICE) {
        activityContent = <MultipleChoiceTask
            task={searchParams.task}
            description={searchParams.description}
            choices={searchParams.choices.split(",").map(choice => choice.trim())}
            userInputVariableName={searchParams.userInputVariableName}
            responsePath={searchParams.responsePath}
            flowElementInstanceId={searchParams.flowElementInstanceId}
            userId={searchParams.userId}
        />
    } else if (searchParams.activityType === ActivityType.INFO) {
        activityContent = <InfoTask
            task={searchParams.task}
            description={searchParams.description}
            infoText={searchParams.infoText}
            responsePath={searchParams.responsePath}
            flowElementInstanceId={searchParams.flowElementInstanceId}
            userId={searchParams.userId}
        />
    }

    return <div className="w-full h-full">
        { activityContent }
    </div>
}