import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BackButton from "@/components/BackButton";

export default async function Login (
    { searchParams }: Readonly<{ searchParams: { message: string } }>
) {

    const signIn = async (formData: FormData) => {
        'use server'

        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)

        const {error} = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return redirect('/login?message=Could not authenticate user')
        }

        return redirect('/')
    }

    return (
        <div className="flex-1 flex flex-col w-screen px-8 sm:max-w-md justify-center items-center gap-2 bg-amber-200">

            <BackButton classNames="absolute left-8 top-8" />

            <form
                className="relative animate-in flex flex-col flex-1 justify-center"
                action={signIn}
            >

                <div className="flex flex-col space-y-2">
                    <p className="text-5xl font-bold mb-5">
                        Login
                    </p>
                </div>

                <label className="text-md" htmlFor="email">
                    Email
                </label>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border mb-2"
                    name="email"
                    placeholder="you@example.com"
                    required
                />
                <label className="text-md" htmlFor="password">
                    Password
                </label>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border mb-4"
                    type="password"
                    name="password"
                    placeholder="test123!"
                    required
                />
                <button className="btn-primary mb-2">
                    Sign in
                </button>
                <Link href={`/signup`}>
                    { "Don't have an account? Sign up" }
                </Link>
            </form>
        </div>
    )
}
