import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { userId, username } = await req.json()
    if (!userId || !username) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { username } })
    if (existing && existing.id !== userId) {
        return NextResponse.json({ error: "Username taken" }, { status: 409 })
    }

    await prisma.user.update({ where: { id: userId }, data: { username } })
    return NextResponse.json({ ok: true })
}
