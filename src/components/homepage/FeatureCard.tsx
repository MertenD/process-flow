import {ReactNode} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";

export interface FeatureCardProps {
    icon: ReactNode
    title: string
    description: string
    image?: string
}

export default function FeatureCard({ icon, title, description, image }: FeatureCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">{description}</p>
                {image && (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image src={image} alt={title} fill className="object-cover" />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
