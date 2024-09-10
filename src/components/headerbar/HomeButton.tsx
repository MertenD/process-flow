"use client"

import {Home} from "lucide-react";
import {Button} from "@/components/ui/button";
import React from "react";
import Link from "next/link";

export default function HomeButton() {
    return <Link href={"/"}>
        <Button variant="outline" size="icon" className={"mr-6"}>
            <Home className="h-[1.2rem] w-[1.2rem]" />
        </Button>
    </Link>
}