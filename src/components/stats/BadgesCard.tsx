import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Award} from "lucide-react";
import React from "react";

export interface BadgesCardProps {
    badges: string[]
}

export default function BadgesCard({ badges }: BadgesCardProps) {



    return  <Card>
        <CardHeader>
            <CardTitle>Auszeichnungen</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-2">
                {badges.map((badge: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center">
                        <Award className="mr-1 h-4 w-4" />
                        {badge}
                    </Badge>
                ))}
            </div>
        </CardContent>
    </Card>
}