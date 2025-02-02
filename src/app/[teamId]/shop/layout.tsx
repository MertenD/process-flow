import React from "react";

export default function ShopLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <main className="w-full h-full overflow-y-auto">
        <div className="container mx-auto p-4 space-y-6">
            {children}
        </div>
    </main>
}
