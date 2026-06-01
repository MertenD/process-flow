import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function getSession() {
    return auth.api.getSession({ headers: await headers() })
}

export async function requireSession() {
    const session = await getSession()
    if (!session) {
        throw new Error("Unauthorized")
    }
    return session
}
