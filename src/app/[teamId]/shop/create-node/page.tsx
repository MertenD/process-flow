"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { NodeDefinition } from "@/model/NodeDefinition"
import { OptionsStructureType } from "@/model/OptionsModel"
import { StepInfo } from "@/components/shop/create-node/StepInfo"
import { StepGeneralInfo } from "@/components/shop/create-node/StepGeneralInfo"
import { StepOptionsConfig } from "@/components/shop/create-node/StepOptionsConfig"
import { StepServerConfig } from "@/components/shop/create-node/StepServerConfig"
import { Progress } from "@/components/ui/progress"
import { Check, ChevronLeft, ChevronRight, Save } from "lucide-react"

export default function CreateNodePage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [nodeDefinition, setNodeDefinition] = useState<NodeDefinition>({
        id: undefined,
        name: "",
        icon: undefined,
        shortDescription: "",
        markdownDocumentation: "",
        executionMode: "Manual",
        executionUrl: "",
        optionsDefinition: {
            title: "",
            nodeId: "",
            structure: [],
        },
    })

    const updateNodeDefinition = (updatedDefinition: NodeDefinition) => {
        setNodeDefinition(updatedDefinition)
    }

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const processNestedStructure = (structure: any[]): any[] => {
        return structure.map((option) => {
            const processedOption = { ...option }
            if ("label" in option && option.label) {
                let keyString = toCamelCase(option.label as string)
                if (
                    option.type === OptionsStructureType.VARIABLE_NAME_INPUT ||
                    option.type === OptionsStructureType.MULTIPLE_VARIABLE_NAME_INPUT
                ) {
                    keyString = `outputs.${keyString}`
                }
                processedOption.keyString = keyString
            } else {
                processedOption.keyString = undefined
            }

            if (option.type === OptionsStructureType.ROW && "structure" in option) {
                processedOption.structure = processNestedStructure(option.structure)
            }

            if ("options" in option && Array.isArray(option.options)) {
                processedOption.options = option.options.map((opt: { dependentStructure: any[] }) => ({
                    ...opt,
                    dependentStructure: opt.dependentStructure ? processNestedStructure(opt.dependentStructure) : undefined,
                }))
            }

            return processedOption
        })
    }

    const saveNodeDefinition = () => {
        const definitionWithKeyStrings = {
            ...nodeDefinition,
            optionsDefinition: {
                ...nodeDefinition.optionsDefinition,
                structure: processNestedStructure(nodeDefinition.optionsDefinition.structure),
            },
        }
        console.log(JSON.stringify(definitionWithKeyStrings, null, 2))
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <h1 className="text-3xl font-bold mb-6">Create Node</h1>

            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    {[1, 2, 3, 4].map((step) => (
                        <div
                            key={step}
                            className={`flex items-center ${currentStep === step ? "text-primary font-medium" : "text-muted-foreground"}`}
                        >
                            <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 
                ${
                                    currentStep > step
                                        ? "bg-primary text-primary-foreground"
                                        : currentStep === step
                                            ? "border-2 border-primary text-primary"
                                            : "border-2 border-muted-foreground text-muted-foreground"
                                }`}
                            >
                                {currentStep > step ? <Check className="h-4 w-4" /> : step}
                            </div>
                            {step === 1 && "Information"}
                            {step === 2 && "General Details"}
                            {step === 3 && "Options"}
                            {step === 4 && "Server Config"}
                        </div>
                    ))}
                </div>
                <Progress value={(currentStep / 4) * 100} className="h-2" />
            </div>

            <Card className="p-6">
                {currentStep === 1 && <StepInfo onNext={handleNext} />}

                {currentStep === 2 && (
                    <StepGeneralInfo
                        nodeDefinition={nodeDefinition}
                        updateNodeDefinition={updateNodeDefinition}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )}

                {currentStep === 3 && (
                    <StepOptionsConfig
                        nodeDefinition={nodeDefinition}
                        updateNodeDefinition={updateNodeDefinition}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )}

                {currentStep === 4 && (
                    <StepServerConfig
                        nodeDefinition={nodeDefinition}
                        updateNodeDefinition={updateNodeDefinition}
                        onPrevious={handlePrevious}
                        onSave={saveNodeDefinition}
                    />
                )}
            </Card>

            <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                </Button>

                {currentStep < 4 ? (
                    <Button onClick={handleNext}>
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button onClick={saveNodeDefinition}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Node
                    </Button>
                )}
            </div>
        </div>
    )
}

// Helper function
function toCamelCase(str: string): string {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase()
        })
        .replace(/\s+/g, "")
}

