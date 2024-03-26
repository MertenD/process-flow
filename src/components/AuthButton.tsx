import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from "next/link";
import { Profile } from "@/types/database.types";
import {useEffect} from "react";

export default async function AuthButton() {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {
        data: {user},
    } = await supabase.auth.getUser()

    const {data} = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', user?.id)
        .single<Profile>()

    // log data
    console.log("Data", data)

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
                <button className="btn-secondary">
                    Sign out
                </button>
            </form>
        </div>
    ) : (
        <Link
            href="/login"
            className="btn-primary"
        >
            Sign in
        </Link>
    )
}
