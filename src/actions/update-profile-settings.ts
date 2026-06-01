"use server"

import { prisma } from "@/lib/prisma"

export default async function(profileId: string, newName: string, newAvatar: string): Promise<void> {

    await prisma.user.update({
        where: { id: profileId },
        data: { username: newName, avatar: newAvatar },
    })
}
