"use server"

import { prisma } from "@/lib/prisma"
import { Profile } from "@/model/database/database.types"

export default async function getProfile(userId: string): Promise<Profile | null> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, username: true, avatar: true, isDarkModeEnabled: true, language: true, createdAt: true, updatedAt: true },
    })
    if (!user) return null
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        is_dark_mode_enabled: user.isDarkModeEnabled,
        language: user.language,
        theme: user.isDarkModeEnabled ? "dark" : "light",
        created_at: user.createdAt.toISOString(),
        updated_at: user.updatedAt.toISOString(),
    }
}
