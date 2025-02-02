import React from "react";

export default function ShopLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <main className="container mx-auto p-4 space-y-6 overflow-y-auto">{children}</main>
}

