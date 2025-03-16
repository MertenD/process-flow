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
import {useTranslations} from "next-intl";

export default function CreateNodePage() {
    const t = useTranslations("shop.create-node")
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
        <div className="container mx-auto py-10 px-4 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8 text-center">{t("title")}</h1>

            <div className="mb-10">
                <div className="flex justify-between mb-3">
                    {[1, 2, 3, 4].map((step) => (
                        <div
                            key={step}
                            className={`flex items-center ${currentStep === step ? "text-primary font-medium" : "text-muted-foreground"}`}
                        >
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full mr-2 
                ${
                                    currentStep > step
                                        ? "bg-primary text-primary-foreground"
                                        : currentStep === step
                                            ? "border-2 border-primary text-primary"
                                            : "border-2 border-muted-foreground text-muted-foreground"
                                }`}
                            >
                                {currentStep > step ? <Check className="h-5 w-5" /> : step}
                            </div>
                            <span className="hidden sm:inline">
                {step === 1 && t("steps.information")}
                                {step === 2 && t("steps.general-details")}
                                {step === 3 && t("steps.options")}
                                {step === 4 && t("steps.server-config")}
              </span>
                        </div>
                    ))}
                </div>
                <Progress value={(currentStep / 4) * 100} className="h-2" />
            </div>

            <Card className="p-8 shadow-sm">
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

            <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1} size="lg" className="px-6">
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    {t("navigation.previous")}
                </Button>

                {currentStep < 4 ? (
                    <Button onClick={handleNext} size="lg" className="px-6">
                        {t("navigation.next")}
                        <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                ) : (
                    <Button onClick={saveNodeDefinition} size="lg" className="px-6 bg-green-600 hover:bg-green-700">
                        <Save className="mr-2 h-5 w-5" />
                        {t("navigation.save")}
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

