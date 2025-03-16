"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
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
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Node Options Configuration</h2>
                <p className="text-muted-foreground">Configure the options and fields that users will interact with</p>
            </div>

            <div className="flex items-end space-x-2 mb-6">
                <div className="flex-grow">
                    <Label className="text-sm font-medium">Add New Option</Label>
                    <Select onValueChange={(value: OptionsStructureType) => setSelectedOptionType(value)}>
                        <SelectTrigger className="mt-1">
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
                <Button onClick={addOption} disabled={!selectedOptionType} className="ml-2">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add
                </Button>
            </div>

            <div className="space-y-4">
                {nodeDefinition.optionsDefinition.structure.length === 0 ? (
                    <div className="text-center py-8 bg-muted rounded-lg">
                        <p className="text-muted-foreground">No options added yet. Use the dropdown above to add options.</p>
                    </div>
                ) : (
                    nodeDefinition.optionsDefinition.structure.map((option, index) => (
                        <OptionEditor
                            key={index}
                            option={option}
                            onUpdate={(updatedOption) => updateOption(index, updatedOption)}
                            onRemove={() => removeOption(index)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

