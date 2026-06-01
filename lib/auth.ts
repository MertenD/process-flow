import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/lib/prisma"

export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    user: {
        additionalFields: {
            username: {
                type: "string",
                unique: true,
                required: false,
                input: true,
            },
            avatar: {
                type: "string",
                required: false,
                input: false,
            },
            isDarkModeEnabled: {
                type: "boolean",
                required: false,
                defaultValue: false,
                input: false,
            },
            language: {
                type: "string",
                required: false,
                defaultValue: "de",
                input: false,
            },
        },
    },
})
