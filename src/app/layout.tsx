import type {Metadata} from "next";
import {Inter as FontSans} from "next/font/google";
import "../styles/globals.css";
import {cn} from "@/lib/utils"
import {ThemeProvider} from "@/components/ui/ThemeProvider";
import React from "react";
import {Toaster} from "@/components/ui/toaster";
import {getLocale, getMessages} from "next-intl/server";
import {NextIntlClientProvider} from "next-intl";
import {RootProvider} from 'fumadocs-ui/provider';
import ThemeSetter from "@/components/ThemeSetter";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const metadata: Metadata = {
    title: "ProcessFlow",
    description: "ProcessFlow is a tool for managing your workflows and processes.",
};

export default async function AppRootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {

    const locale = await getLocale();
    const messages = await getMessages()

    return (
        <html lang={locale} className="!scroll-smooth">
        <head>
            <link rel="icon" href="/favicon.ico" sizes="any"/>
            <link
                rel="icon"
                href="/icon?<generated>"
                type="image/<generated>"
                sizes="<generated>"
            />
        </head>
        <body className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
        )}>
            <RootProvider>
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme={"system"}
                        enableSystem
                        disableTransitionOnChange
                    >
                        <ThemeSetter />
                        <Toaster/>
                        {children}
                    </ThemeProvider>
                </NextIntlClientProvider>
            </RootProvider>
        </body>
        </html>
    );
}
