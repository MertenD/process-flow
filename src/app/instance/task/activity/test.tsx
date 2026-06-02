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


export default async function Page({ searchParams }: { searchParams: ActivitySearchParams }) {

    function onSubmit(data: any) {
        fetch(searchParams.responsePath, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                flowElementInstanceId: searchParams.flowElementInstanceId,
                data: {
                    [searchParams.userInputVariableName]: data.textInput
                },
                completedBy: searchParams.userId
            })
        }).then(() => {
            console.log("Submitted")
        }).catch((error) => {
            // TODO Nicht sicher den error einfach so auszugeben
            console.error("Error submitting", error)
        })
    }
}