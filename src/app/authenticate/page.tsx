import {cookies, headers} from 'next/headers'
import {createClient} from '@/utils/supabase/server'
import {redirect, RedirectType} from 'next/navigation'
import {AlertCircle, LogIn, UserPlus} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Profile} from "@/model/database/database.types";

export default async function Login (
    { searchParams }: Readonly<{ searchParams: { message: string } }>
) {

    const cookieStore = cookies()
    const supabase = createClient()
    const {data: user, error} = await supabase.auth.getUser()
    if (user.user) {
        return redirect('/', RedirectType.replace)
    }

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
            return redirect('/authenticate?message=Could not authenticate user', RedirectType.replace)
        }

        return redirect('/', RedirectType.replace)
    }

    const signUp = async (formData: FormData) => {
        'use server'

        const origin = headers().get('origin')
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const passwordConfirm = formData.get('password-confirm') as string
        const username = formData.get('username') as string
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)

        if (password !== passwordConfirm) {
            return redirect(`/authenticate?message=Passwörter stimmen nicht überein`, RedirectType.replace)
        }

        const checkUsernameUniqueRequest = await supabase
            .from('profiles')
            .select()
            .ilike('username', username)
            .maybeSingle<Profile>()

        if (checkUsernameUniqueRequest.data) {
            return redirect(`/authenticate?message=Benutzername ist bereits vergeben`, RedirectType.replace)
        }

        const {error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            },
        })

        if (error) {

            if (error.message === "User already registered") {
                return redirect(`/authenticate?message=Email is already taken`, RedirectType.replace)
            }
            return redirect(`/authenticate?message=${error.message}`, RedirectType.replace)
        }

        const user = await supabase.auth.getUser().then((response) => response.data.user)

        await supabase
            .from('profiles')
            .insert([{
                id: user?.id,
                username: formData.get('username') as string,
                email: user?.email
            } as Profile])

        return redirect('/', RedirectType.replace)
    }

    return <div className="w-screen h-screen flex flex-col justify-center items-center">
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Willkommen bei ProcessFlow</CardTitle>
                <CardDescription>Melden Sie sich an oder registrieren Sie sich, um fortzufahren.</CardDescription>
            </CardHeader>
            <CardContent>
                { searchParams.message && (
                    <Alert variant="destructive" className="border-red-500 bg-red-300 mb-10">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            { searchParams.message }
                        </AlertDescription>
                    </Alert>
                ) }
                <Tabs defaultValue="login">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Anmelden</TabsTrigger>
                        <TabsTrigger value="register">Registrieren</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <form action={signIn} className="space-y-4">
                            <Input
                                name="email"
                                type="email"
                                placeholder="E-Mail"
                                required
                            />
                            <Input
                                name="password"
                                type="password"
                                placeholder="Passwort"
                                required
                            />
                            <Button type="submit" className="w-full">
                                <LogIn className="w-4 h-4 mr-2" /> Anmelden
                            </Button>
                        </form>
                    </TabsContent>
                    <TabsContent value="register">
                        <form action={signUp} className="space-y-4">
                            <Input
                                name="email"
                                type="email"
                                placeholder="E-Mail"
                                required
                            />
                            <Input
                                name="password"
                                type="password"
                                placeholder="Passwort"
                                required
                            />
                            <Input
                                name="password-confirm"
                                type="password"
                                placeholder="Passwort bestätigen"
                                required
                            />
                            <Input
                                name="username"
                                type="text"
                                placeholder="Benutzername"
                                required
                            />
                            <Button type="submit" className="w-full">
                                <UserPlus className="w-4 h-4 mr-2" /> Registrieren
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </div>
}
