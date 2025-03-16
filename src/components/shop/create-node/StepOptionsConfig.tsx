"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, ListChecks, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { NodeDefinition } from "@/model/NodeDefinition"
import { type OptionsBase, OptionsStructureType } from "@/model/OptionsModel"
import OptionEditor from "@/components/shop/create-node/OptionEditor"

interface StepOptionsConfigProps {
    nodeDefinition: NodeDefinition
    updateNodeDefinition: (updatedDefinition: NodeDefinition) => void
    onNext: () => void
    onPrevious: () => void
}

export function StepOptionsConfig({
  nodeDefinition,
  updateNodeDefinition,
  onNext,
  onPrevious,
}: StepOptionsConfigProps) {
    const [selectedOptionType, setSelectedOptionType] = useState<OptionsStructureType | null>(null)

    const addOption = () => {
        if (selectedOptionType) {
            const newOption: OptionsBase = {
                type: selectedOptionType,
                ...(selectedOptionType === OptionsStructureType.SELECT ||
                selectedOptionType === OptionsStructureType.SELECT_WITH_CUSTOM ||
                selectedOptionType === OptionsStructureType.CHECKBOX
                    ? { options: [] }
                    : {}),
            }

            updateNodeDefinition({
                ...nodeDefinition,
                optionsDefinition: {
                    ...nodeDefinition.optionsDefinition,
                    structure: [...nodeDefinition.optionsDefinition.structure, newOption],
                },
            })

            setSelectedOptionType(null)
        }
    }

    const updateOption = (index: number, updatedOption: OptionsBase) => {
        updateNodeDefinition({
            ...nodeDefinition,
            optionsDefinition: {
                ...nodeDefinition.optionsDefinition,
                structure: nodeDefinition.optionsDefinition.structure.map((option, i) =>
                    i === index ? updatedOption : option,
                ),
            },
        })
    }

    const removeOption = (index: number) => {
        updateNodeDefinition({
            ...nodeDefinition,
            optionsDefinition: {
                ...nodeDefinition.optionsDefinition,
                structure: nodeDefinition.optionsDefinition.structure.filter((_, i) => i !== index),
            },
        })
    }

    return (
        <div className="space-y-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Node Options Configuration</h2>
                <p className="text-muted-foreground mt-2">Configure the options and fields that users will interact with</p>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                        <ListChecks className="mr-2 h-5 w-5 text-primary" />
                        Add New Option
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end space-x-3">
                        <div className="flex-grow">
                            <Label className="text-sm font-medium mb-2 block">Option Type</Label>
                            <Select onValueChange={(value: OptionsStructureType) => setSelectedOptionType(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select option type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(OptionsStructureType)
                                        .filter((type) => type !== OptionsStructureType.MULTIPLE_VARIABLE_NAME_INPUT)
                                        .map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={addOption} disabled={!selectedOptionType} className="ml-2 h-10">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Option
                        </Button>
                    </div>

                    {nodeDefinition.optionsDefinition.structure.length === 0 && (
                        <Alert className="mt-6 bg-muted/50 border-muted">
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            <AlertDescription className="text-muted-foreground">
                                No options added yet. Use the dropdown above to add options to your node.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {nodeDefinition.optionsDefinition.structure.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                            <ListChecks className="mr-2 h-5 w-5 text-primary" />
                            Configured Options
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {nodeDefinition.optionsDefinition.structure.map((option, index) => (
                            <OptionEditor
                                key={index}
                                option={option}
                                onUpdate={(updatedOption) => updateOption(index, updatedOption)}
                                onRemove={() => removeOption(index)}
                            />
                        ))}
                    </CardContent>
                </Card>
            )}

            <Card className="bg-muted/30 border-muted">
                <CardContent className="py-4 px-6">
                    <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                        <div className="text-sm text-muted-foreground">
                            <p className="mb-2">Options define how users will interact with your node:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    Use <strong>Input</strong> and <strong>Textarea</strong> for simple text input
                                </li>
                                <li>
                                    Use <strong>VariableNameInput</strong> for naming data objects which will contain the results from the node
                                </li>
                                <li>
                                    Use <strong>Select</strong> for dropdown menus with predefined options and <strong>SelectWithCustom</strong> for dropdown menus where the user can add his own values
                                </li>
                                <li>
                                    Use <strong>Checkbox</strong> for boolean options
                                </li>
                                <li>
                                    Use <strong>Row</strong> and <strong>Separator</strong> to group options together.
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

