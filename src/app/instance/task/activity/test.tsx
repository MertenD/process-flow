import {ActivityType} from "@/model/ActivityType";

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

    function onSubmit(data: any) {
        fetch(params.responsePath, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                flowElementInstanceId: params.flowElementInstanceId,
                data: {
                    [params.userInputVariableName]: data.textInput
                },
                completedBy: params.userId
            })
        }).then(() => {
            console.log("Submitted")
        }).catch((error) => {
            // TODO Nicht sicher den error einfach so auszugeben
            console.error("Error submitting", error)
        })
    }
}