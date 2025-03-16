"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, FileCode, Settings, Server, ListChecks } from "lucide-react"

interface StepInfoProps {
    onNext: () => void
}

export function StepInfo({ onNext }: StepInfoProps) {
    return (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-3">Welcome to the Node Creator</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    This wizard will guide you through creating a new node for your business process. Follow the four simple steps
                    below to configure your node.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                    <CardContent className="pt-6 pb-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-accent p-4 rounded-full mb-4">
                                <Settings className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium text-lg mb-3">1. General Details</h3>
                            <p className="text-muted-foreground text-sm">
                                Define the basic information about your node, including name, description, and documentation.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                    <CardContent className="pt-6 pb-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-accent p-4 rounded-full mb-4">
                                <ListChecks className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium text-lg mb-3">2. Options</h3>
                            <p className="text-muted-foreground text-sm">
                                Create the input fields, selections, and other options that users will interact with in the editor.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                    <CardContent className="pt-6 pb-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-accent p-4 rounded-full mb-4">
                                <FileCode className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium text-lg mb-3">3. Server Setup</h3>
                            <p className="text-muted-foreground text-sm">Configure your server URL for your backend implementation.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                    <CardContent className="pt-6 pb-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-accent p-4 rounded-full mb-4">
                                <Server className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium text-lg mb-3">4. Code Templates</h3>
                            <p className="text-muted-foreground text-sm">
                                Get ready-to-use code templates for your backend implementation that you can copy and customize.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

