import React from "react";
import ShopSidebar from "@/components/shop/ShopSidebar";

export default function ShopLayout({ children, params }: Readonly<{ children: React.ReactNode, params: { teamId: number } }>) {
    return (
        <div className="flex">
            <ShopSidebar teamId={params.teamId} />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    )
}

