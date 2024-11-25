import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Check} from "lucide-react";
import {Button} from "@/components/ui/button";

export interface PricingCardProps {
    title: string
    price: string
    description: string
    features: string[]
    highlighted?: boolean
}

export default function PricingCard({ title, price, description, features, highlighted = false }: PricingCardProps) {
    return (
        <Card className={highlighted ? 'border-primary shadow-lg' : ''}>
            <CardHeader>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <p className="text-4xl font-bold">{price}</p>
                <p className="text-muted-foreground">{description}</p>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-primary" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
                <Button className="w-full mt-6" variant={highlighted ? 'default' : 'outline'}>
                    Get Started
                </Button>
            </CardContent>
        </Card>
    )
}