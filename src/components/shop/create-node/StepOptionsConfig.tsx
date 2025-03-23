"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {AlertCircle, ListChecks, PlusCircle} from "lucide-react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Alert, AlertDescription} from "@/components/ui/alert"
import type {NodeDefinition} from "@/model/NodeDefinition"
import {type OptionsBase, OptionsStructureType} from "@/model/OptionsModel"
import OptionEditor from "@/components/shop/create-node/OptionEditor"
import {useTranslations} from "next-intl";

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
    const t = useTranslations("shop.step-options-config")
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

    // UpdatedOption should be any interface that extends OptionsBase
    const updateOption = (index: number, updatedOption: any) => {
        updateNodeDefinition({
            ...nodeDefinition,
            optionsDefinition: {
                ...nodeDefinition.optionsDefinition,
                structure: nodeDefinition.optionsDefinition.structure.map((option, i) => {
                    if (i !== index) {
                        return option
                    }

                    const newOption = {...updatedOption}

                    if ("label" in updatedOption && updatedOption.label) {
                        let keyString = toCamelCase(updatedOption.label as string)
                        if (
                            updatedOption.type === OptionsStructureType.VARIABLE_NAME_INPUT ||
                            updatedOption.type === OptionsStructureType.MULTIPLE_VARIABLE_NAME_INPUT
                        ) {
                            keyString = `outputs.${keyString}`
                        }
                        newOption.keyString = keyString
                    } else {
                        newOption.keyString = undefined
                    }

                    return newOption
                }),
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

    return <div className="space-y-8">
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">{t("title")}</h2>
            <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
        </div>

        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                    <ListChecks className="mr-2 h-5 w-5 text-primary" />
                    {t("add-option.title")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end space-x-3">
                    <div className="flex-grow">
                        <Label className="text-sm font-medium mb-2 block">{t("add-option.option-type")}</Label>
                        <Select onValueChange={(value: OptionsStructureType) => setSelectedOptionType(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder={t("add-option.placeholder")} />
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
                        {t("add-option.button")}
                    </Button>
                </div>

                {nodeDefinition.optionsDefinition.structure.length === 0 && (
                    <Alert className="mt-6 bg-muted/50 border-muted">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <AlertDescription className="text-muted-foreground">{t("no-options")}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>

        {nodeDefinition.optionsDefinition.structure.length > 0 && (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                        <ListChecks className="mr-2 h-5 w-5 text-primary" />
                        {t("configured-options")}
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
                        <p className="mb-2">{t("option-types-info.title")}</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>{ t("option-types-info.input-textarea") }</li>
                            <li>{ t("option-types-info.variable-name-input") }</li>
                            <li>{ t("option-types-info.select") }</li>
                            <li>{ t("option-types-info.checkbox") }</li>
                            <li>{ t("option-types-info.row-separator") }</li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
}

// Helper function
function toCamelCase(str: string): string {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase()
        })
        .replace(/\s+/g, "")
}

