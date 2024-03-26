import Link from 'next/link'
import {cookies, headers} from 'next/headers'
import {createClient} from '@/utils/supabase/server'
import {redirect} from 'next/navigation'
import {Profile} from '@/types/database.types'
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle} from "lucide-react";

export default async function Signup(
    { searchParams }: Readonly<{ searchParams: { message: string } }>
) {

    const signUp = async (formData: FormData) => {
        'use server'

        const origin = headers().get('origin')
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const username = formData.get('username') as string
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)

        const checkUsernameUniqueRequest = await supabase
            .from('profiles')
            .select()
            .ilike('username', username)
            .maybeSingle<Profile>()

        if (checkUsernameUniqueRequest.data) {
            return redirect(`/signup?message=Username is already taken`)
        }

        const {error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            },
        })

        if (error) {

            console.log("Error at signup: ", error.message)

            if (error.message === "User already registered") {
                return redirect(`/signup?message=Email is already taken`)
            }
            return redirect(`/signup?message=${error.message}`)
        }

        const user = await supabase.auth.getUser().then((response) => response.data.user)

        await supabase
            .from('profiles')
            .insert([{
                id: user?.id,
                username: formData.get('username') as string
            } as Profile])

        return redirect('/')
    }

    return (
        <div className="flex-1 flex flex-col w-full px-8 justify-center items-center gap-2">

            <form
                className="relative animate-in w-96 flex flex-col flex-1 justify-center items-stretch"
                action={signUp}
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
                    <p className={"text-5xl font-bold mb-5"}>
                        Sign Up
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
                    className="rounded-md px-4 py-2 bg-inherit border mb-2"
                    type="password"
                    name="password"
                    placeholder="test123!"
                    required
                />
                <label className="text-md" htmlFor="username">
                    Username <span className={"text-xs"}>(max. 16 characters)</span>
                </label>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border mb-2"
                    type="text"
                    name="username"
                    maxLength={16}
                    placeholder="username123"
                    required
                />
                <button className="btn-primary mb-2">
                    Sign up
                </button>
                <Link href={'/login'} className="text-center">
                    Already have an account? Sign in
                </Link>
            </form>
        </div>
    )
}
