import completeFlowElementInstance from "@/actions/complete-flow-element-instance";

// TODO Implement proper authentication, it is not possible to complete any instance without permission

export async function POST(req: Request) {
    const body = await req.json()
    const {
        flowElementInstanceId,
        data,
        completedBy
    } = body

    if (!flowElementInstanceId) {
        return new Response("Invalid form data, requires processModelId as string", {status: 400})
    }
    if (!data) {
        return new Response("Invalid form data, requires data as json object", {status: 400})
    }

    try {
        await completeFlowElementInstance(flowElementInstanceId, data, completedBy);
        return new Response(`Completed element`, {status: 200})
    } catch (error) {
        return new Response("An error occurred while processing your request: " + error, {status: 500})
    }
}