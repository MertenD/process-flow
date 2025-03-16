"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold">General Node Information</h2>
                <p className="text-muted-foreground">Define the basic details of your node</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name" className="text-sm font-medium">
                            Node Name
                        </Label>
                        <Input
                            id="name"
                            value={nodeDefinition.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            placeholder="Enter node name"
                            className="mt-1"
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
                            className="mt-1"
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
                            className="mt-1"
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
                            <SelectTrigger className="mt-1">
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
                </div>

                <div>
                    <Label htmlFor="markdownDocumentation" className="text-sm font-medium">
                        Documentation (Markdown)
                    </Label>
                    <Textarea
                        id="markdownDocumentation"
                        value={nodeDefinition.markdownDocumentation}
                        onChange={(e) => updateField("markdownDocumentation", e.target.value)}
                        placeholder="Write detailed documentation using Markdown"
                        className="mt-1 h-[220px]"
                    />
                </div>
            </div>
        </div>
    )
}

