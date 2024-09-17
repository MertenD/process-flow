import createProcessInstance from "@/actions/create-process-instance";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {
            processModelId,
            inputs
        } = body

        if (!processModelId) {
            return new Response("Invalid form data, requires processModelId as string", {status: 400})
        }

        console.log("Creating process instance with inputs", inputs)

        const { processInstanceId} = await createProcessInstance(processModelId, inputs)

        return new Response(`Process Instance with id '${processInstanceId}' created`, {status: 200})
    } catch (error: any) {
        return new Response("An error occurred while processing your request: " + error.message, {status: 500})
    }
}