"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, FileCode, Settings, Server, ListChecks } from "lucide-react"
import {useTranslations} from "next-intl";

interface StepInfoProps {
    onNext: () => void
}

export function StepInfo({ onNext }: StepInfoProps) {
    const t = useTranslations("shop.step-info")

    return (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-3">{t("title")}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                    <CardContent className="pt-6 pb-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-background p-4 rounded-full mb-4">
                                <Settings className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium text-lg mb-3">{t("cards.general-details.title")}</h3>
                            <p className="text-muted-foreground text-sm">{t("cards.general-details.description")}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                    <CardContent className="pt-6 pb-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-background p-4 rounded-full mb-4">
                                <ListChecks className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium text-lg mb-3">{t("cards.options.title")}</h3>
                            <p className="text-muted-foreground text-sm">{t("cards.options.description")}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                    <CardContent className="pt-6 pb-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-background p-4 rounded-full mb-4">
                                <FileCode className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium text-lg mb-3">{t("cards.server-setup.title")}</h3>
                            <p className="text-muted-foreground text-sm">{t("cards.server-setup.description")}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                    <CardContent className="pt-6 pb-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-background p-4 rounded-full mb-4">
                                <Server className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium text-lg mb-3">{t("cards.code-templates.title")}</h3>
                            <p className="text-muted-foreground text-sm">{t("cards.code-templates.description")}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

