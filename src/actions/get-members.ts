"use server"

import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";
import {ProfilesWithRoles} from "@/model/database/database.types";
import {Member} from "@/components/team/MemberManagement";

export default async function(teamId: number): Promise<Member[]> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: profilesWithRoles, error } = await supabase
        .from("profiles_with_roles")
        .select("*")
        .eq("team_id", teamId)
        .returns<ProfilesWithRoles[]>()

    if (error || !profilesWithRoles) {
        throw Error(error?.message || "Error fetching members")
    }

    return profilesWithRoles.reduce((acc: Member[], profile: ProfilesWithRoles): Member[] => {
        const existingMember = acc.find((member) => member.id === profile.profile_id)

        if (!profile.profile_id || !profile.username || !profile.email) {
            console.error("Invalid profile data while fetching members", profile)
            return acc
        }

        if (existingMember) {
            if (!profile.role_id || !profile.role_name) {
                return acc
            }
            existingMember.roles.push({ id: profile.role_id, name: profile.role_name })
        } else {
            const roles = profile.role_id && profile.role_name ?
                [{ id: profile.role_id, name: profile.role_name }] :
                []
            acc.push({
                id: profile.profile_id,
                name: profile.username,
                email: profile.email,
                roles: roles
            })
        }
        return acc
    }, [])
}