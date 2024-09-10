import {createClient} from '@/utils/supabase/server'
import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'
import Link from "next/link";
import {Profile} from "@/types/database.types";
import {Button} from "@/components/ui/button";

export default async function AuthButton() {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {
        data: {user},
    } = await supabase.auth.getUser()

    const {data} = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', user?.id || "")
        .single<Profile>()

    const signOut = async () => {
        'use server'

        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        await supabase.auth.signOut()
        return redirect('/')
    }

    return data ? (
        <div className="flex items-center gap-4">
            Hey, {data?.username}!
            <form action={signOut}>
                <Button variant="outline">Abmelden</Button>
            </form>
        </div>
    ) : (
        <Link
            href="/authenticate"
            className="btn-primary"
        >
            Sign in
        </Link>
    )
}
