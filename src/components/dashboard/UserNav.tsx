import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuItemWithServerAction, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import MiniatureLevelCard from "@/components/stats/MiniatureLevelCard"
import React from "react"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

export interface UserNavProps {
    selectedTeamId?: number
}

export async function UserNav({ selectedTeamId }: Readonly<UserNavProps>) {

    const t = await getTranslations("Header.userNav")

    const session = await auth.api.getSession({ headers: await headers() })
    const profile = session?.user
        ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, username: true, email: true, avatar: true } })
        : null

    const signOut = async () => {
        'use server'
        await auth.api.signOut({ headers: await headers() })
        return redirect('/')
    }

    return profile ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-lg">
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={profile.avatar || ""} alt="avatar" />
                        <AvatarFallback>{profile.username?.slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{profile.username}</p>
                            <p className="text-xs leading-none text-muted-foreground">{profile.email}</p>
                        </div>
                        {selectedTeamId && <div className="hidden md:block lg:hidden">
                            <MiniatureLevelCard userId={profile.id} teamId={selectedTeamId}/>
                        </div>}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <Link href={"/settings"}>
                        <DropdownMenuItem>{t("settings")}</DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItemWithServerAction action={signOut}>
                    {t("logout")}
                </DropdownMenuItemWithServerAction>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <Button>
            <Link href="/authenticate" className="btn-primary">{t("login")}</Link>
        </Button>
    )
}
