import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuItemWithServerAction,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";
import {Profile} from "@/types/database.types";
import {redirect} from "next/navigation";
import Link from "next/link";

export async function UserNav() {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {
        data: {user},
    } = await supabase.auth.getUser()

    const {data: profile} = await supabase
        .from('profiles')
        .select('id, username, email, avatar')
        .eq('id', user?.id || "")
        .single<Profile>()

    const signOut = async () => {
        'use server'

        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        await supabase.auth.signOut()
        return redirect('/')
    }

    console.log(profile)

    return profile ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={profile.avatar || ""} alt="@shadcn" />
                        <AvatarFallback>{ profile.username.slice(0,2).toUpperCase() }</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{ profile.username }</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            { profile.email }
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href={"/settings"}>
                        <DropdownMenuItem>
                            Settings
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItemWithServerAction action={signOut}>
                    Log out
                </DropdownMenuItemWithServerAction>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <Button>
            <Link
                href="/authenticate"
                className="btn-primary"
            >
                Sign in
            </Link>
        </Button>
    );
}