"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, LogIn, UserPlus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { authClient } from "@/lib/auth-client"

export default function Login() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [message, setMessage] = useState(searchParams.get("message") ?? "")
    const [loading, setLoading] = useState(false)

    const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const form = new FormData(e.currentTarget)
        const email = form.get("email") as string
        const password = form.get("password") as string

        const { error } = await authClient.signIn.email({ email, password })
        setLoading(false)

        if (error) {
            setMessage("Anmeldung fehlgeschlagen: " + (error.message ?? "Unbekannter Fehler"))
            return
        }

        router.push("/dashboard")
    }

    const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const form = new FormData(e.currentTarget)
        const email = form.get("email") as string
        const password = form.get("password") as string
        const passwordConfirm = form.get("password-confirm") as string
        const username = form.get("username") as string

        if (password !== passwordConfirm) {
            setMessage("Passwörter stimmen nicht überein")
            setLoading(false)
            return
        }

        const { data, error } = await authClient.signUp.email({ email, password, name: username })
        setLoading(false)

        if (error) {
            const msg = error.message === "User already exists" ? "Email ist bereits vergeben" : (error.message ?? "Registrierung fehlgeschlagen")
            setMessage(msg)
            return
        }

        // Save username after successful sign-up via API
        if (data?.user?.id) {
            await fetch("/api/user/set-username", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: data.user.id, username }),
            })
        }

        router.push("/dashboard")
    }

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Willkommen bei ProcessFlow</CardTitle>
                    <CardDescription>Melden Sie sich an oder registrieren Sie sich, um fortzufahren.</CardDescription>
                </CardHeader>
                <CardContent>
                    {message && (
                        <Alert variant="destructive" className="border-red-500 bg-red-300 mb-10">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Fehler</AlertTitle>
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}
                    <Tabs defaultValue="login">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Anmelden</TabsTrigger>
                            <TabsTrigger value="register">Registrieren</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <form onSubmit={signIn} className="space-y-4">
                                <Input name="email" type="email" placeholder="E-Mail" required />
                                <Input name="password" type="password" placeholder="Passwort" required />
                                <Button type="submit" className="w-full" disabled={loading}>
                                    <LogIn className="w-4 h-4 mr-2" /> Anmelden
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="register">
                            <form onSubmit={signUp} className="space-y-4">
                                <Input name="email" type="email" placeholder="E-Mail" required />
                                <Input name="password" type="password" placeholder="Passwort" required />
                                <Input name="password-confirm" type="password" placeholder="Passwort bestätigen" required />
                                <Input name="username" type="text" placeholder="Benutzername" required />
                                <Button type="submit" className="w-full" disabled={loading}>
                                    <UserPlus className="w-4 h-4 mr-2" /> Registrieren
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
