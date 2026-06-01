"use server"

import { prisma } from "@/lib/prisma"
import { Theme } from "@/model/database/database.types"

export default async function(profileId: string, newLanguage: string, theme: Theme): Promise<void> {

    await prisma.user.update({
        where: { id: profileId },
        data: { language: newLanguage, isDarkModeEnabled: theme === "dark" },
    })
}
