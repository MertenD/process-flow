import Link from 'next/link'
import {cookies} from 'next/headers'
import {createClient} from '@/utils/supabase/server'
import {redirect} from 'next/navigation'
import {AlertCircle} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

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
        <div className="flex-1 flex flex-col w-full px-8 justify-center items-center gap-2">

            <form
                className="relative animate-in w-96 flex flex-col flex-1 justify-center"
                action={signIn}
            >
                { searchParams.message && (
                    <Alert variant="destructive" className="border-red-500 bg-red-300 mb-10">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            { searchParams.message }
                        </AlertDescription>
                    </Alert>
                ) }

                <div className="flex flex-col space-y-2 text-center">
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
                <Link href={`/signup`} className="text-center">
                    { "Don't have an account? Sign up" }
                </Link>
            </form>
        </div>
    )
}
