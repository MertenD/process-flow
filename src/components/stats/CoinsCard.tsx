import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Coins} from "lucide-react";
import React from "react";

export interface CoinsCardProps {
    coins: number
}

export default function CoinsCard({ coins }: CoinsCardProps) {

    return <Card>
        <CardHeader>
            <CardTitle>Münzen</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-center">
                <Coins className="mr-2 h-6 w-6 text-yellow-500" />
                <span className="text-2xl font-bold">{coins}</span>
            </div>
        </CardContent>
    </Card>
}