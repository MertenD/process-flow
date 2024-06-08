export async function POST(req: Request) {
    try {
        console.log("Test")

        const body = await req.json()
        const {
            responsePath,
            flowElementInstanceId,
            data
        } = body

        if (!responsePath) {
            return new Response("Invalid form data, requires responsePath as string", {status: 400})
        }
        if (!flowElementInstanceId) {
            return new Response("Invalid form data, requires flowElementInstanceId as string", {status: 400})
        }
        if (!data) {
            return new Response("Invalid form data, requires data as json object", {status: 400})
        }

        // TODO execution

        console.log("Executing event", flowElementInstanceId, responsePath, data, req.headers?.get("origin"))
        setTimeout(() => {
            fetch (responsePath, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    flowElementInstanceId: flowElementInstanceId,
                    data: {
                        "outputValue1": "value1",
                        "outputValue2": "value2"
                    }
                })
            })
        }, 2000)

        return new Response(JSON.stringify({ message: "Executing event"}), {status: 200})
    } catch (error: any) {
        return new Response("An error occurred while processing your request: " + error.message, {status: 500})
    }
}