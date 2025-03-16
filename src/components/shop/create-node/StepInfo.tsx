"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, FileCode, Settings, Server, ListChecks } from "lucide-react"

interface StepInfoProps {
    onNext: () => void
}

export function StepInfo({ onNext }: StepInfoProps) {
    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Welcome to the Node Creator</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    This wizard will guide you through creating a new node for your business process. Follow the four simple steps
                    below to configure your node.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-blue-100 p-3 rounded-full mb-4">
                                <Settings className="h-6 w-6 text-blue-500" />
                            </div>
                            <h3 className="font-medium text-lg mb-2">1. General Details</h3>
                            <p className="text-muted-foreground text-sm">
                                Define the basic information about your node, including name, description, and documentation.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-purple-100 p-3 rounded-full mb-4">
                                <ListChecks className="h-6 w-6 text-purple-500" />
                            </div>
                            <h3 className="font-medium text-lg mb-2">2. Options</h3>
                            <p className="text-muted-foreground text-sm">
                                Create the input fields, selections, and other options that users will interact with.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-green-100 p-3 rounded-full mb-4">
                                <FileCode className="h-6 w-6 text-green-500" />
                            </div>
                            <h3 className="font-medium text-lg mb-2">3. Server Setup</h3>
                            <p className="text-muted-foreground text-sm">Configure the server URL for your backend implementation.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-amber-100 p-3 rounded-full mb-4">
                                <Server className="h-6 w-6 text-amber-500" />
                            </div>
                            <h3 className="font-medium text-lg mb-2">4. Code Templates</h3>
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

