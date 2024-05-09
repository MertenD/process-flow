import type {Metadata} from "next";
import {Inter as FontSans} from "next/font/google";
import "../styles/globals.css";
import HeaderBar from "@/components/headerbar/HeaderBar";
import {cn} from "@/lib/utils"
import {ThemeProvider} from "@/components/ui/ThemeProvider";
import React from "react";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "ProcessFlow",
  description: "ProcessFlow is a tool for managing your workflows and processes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
      )}>
          <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
          >
            { children }
          </ThemeProvider>
      </body>
    </html>
  );
}
