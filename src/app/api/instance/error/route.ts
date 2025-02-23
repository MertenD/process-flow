// TODO Implement proper authentication, it is not possible to complete any instance without permission

import failFlowElementInstance from "@/actions/fail-flow-element-instance";

export async function POST(req: Request) {
    const body = await req.json()
    const {
        flowElementInstanceId,
        errorMessage
    } = body

    if (!flowElementInstanceId) {
        return new Response("Invalid form data, requires processModelId as string", {status: 400})
    }
    if (!errorMessage) {
        return new Response("Invalid form data, requires errorMessage as string", {status: 400})
    }

    try {
        await failFlowElementInstance(flowElementInstanceId, errorMessage);
        return new Response(`Completed element`, {status: 200})
    } catch (error) {
        return new Response("An error occurred while processing your request: " + error, {status: 500})
    }
}