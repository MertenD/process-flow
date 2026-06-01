import { redirect } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

export default async function AuthButton() {

    const session = await auth.api.getSession({ headers: await headers() })

    const profile = session?.user
        ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, username: true } })
        : null

    const signOut = async () => {
        'use server'
        await auth.api.signOut({ headers: await headers() })
        return redirect('/')
    }

    return profile ? (
        <div className="flex items-center gap-4">
            Hey, {profile?.username}!
            <form action={signOut}>
                <Button variant="outline">Abmelden</Button>
            </form>
        </div>
    ) : (
        <Link href="/authenticate" className="btn-primary">Sign in</Link>
    )
}
