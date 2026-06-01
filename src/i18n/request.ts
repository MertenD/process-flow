"use server"

import { getRequestConfig } from 'next-intl/server'
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

const defaultLocale = 'de'

export default getRequestConfig(async () => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
        return {
            locale: defaultLocale,
            messages: (await import('./dictionaries/' + defaultLocale + '.json')).default
        }
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { language: true }
    })

    const locale = user?.language || defaultLocale

    return {
        locale,
        messages: (await import('./dictionaries/' + locale + '.json')).default
    }
})
