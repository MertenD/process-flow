"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, FileText, Tag } from "lucide-react"
import type { NodeDefinition } from "@/model/NodeDefinition"
import type { ExecutionMode } from "@/model/database/database.types"

interface StepGeneralInfoProps {
    nodeDefinition: NodeDefinition
    updateNodeDefinition: (updatedDefinition: NodeDefinition) => void
    onNext: () => void
    onPrevious: () => void
}

const executionModes: ExecutionMode[] = ["Manual", "Automatic"]

export function StepGeneralInfo({ nodeDefinition, updateNodeDefinition, onNext, onPrevious }: StepGeneralInfoProps) {
    const updateField = (field: keyof NodeDefinition, value: string) => {
        const updated = { ...nodeDefinition, [field]: value }
        if (field === "name") {
            updated.optionsDefinition = { ...updated.optionsDefinition, title: value }
        }
        updateNodeDefinition(updated)
    }

    return (
        <div className="space-y-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">General Node Information</h2>
                <p className="text-muted-foreground mt-2">Define the basic details of your node</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                            <Info className="mr-2 h-5 w-5 text-primary" />
                            Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="text-sm font-medium">
                                Node Name
                            </Label>
                            <Input
                                id="name"
                                value={nodeDefinition.name}
                                onChange={(e) => updateField("name", e.target.value)}
                                placeholder="Enter node name"
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="shortDescription" className="text-sm font-medium">
                                Short Description
                            </Label>
                            <Input
                                id="shortDescription"
                                value={nodeDefinition.shortDescription}
                                onChange={(e) => updateField("shortDescription", e.target.value)}
                                placeholder="Brief description of what this node does"
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="icon" className="text-sm font-medium">
                                Icon
                            </Label>
                            <Input
                                id="icon"
                                value={nodeDefinition.icon}
                                onChange={(e) => updateField("icon", e.target.value)}
                                placeholder="Icon name or path"
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="executionMode" className="text-sm font-medium">
                                Execution Mode
                            </Label>
                            <Select
                                value={nodeDefinition.executionMode}
                                onValueChange={(value) => updateField("executionMode", value as ExecutionMode)}
                            >
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Select execution mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    {executionModes.map((mode) => (
                                        <SelectItem key={mode} value={mode}>
                                            {mode}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                            <FileText className="mr-2 h-5 w-5 text-primary" />
                            Documentation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Label htmlFor="markdownDocumentation" className="text-sm font-medium">
                            Documentation (Markdown)
                        </Label>
                        <Textarea
                            id="markdownDocumentation"
                            value={nodeDefinition.markdownDocumentation}
                            onChange={(e) => updateField("markdownDocumentation", e.target.value)}
                            placeholder="Write detailed documentation using Markdown"
                            className="mt-2 h-[280px] resize-none"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Use Markdown syntax to format your documentation. This will be displayed to users when they view details
                            about this node.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-muted/30 border-muted">
                <CardContent className="py-4 px-6">
                    <div className="flex items-start">
                        <Tag className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                            The information you provide here will be displayed to users when they browse available nodes. Make sure to
                            provide clear and concise descriptions to help users understand what your node does.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

