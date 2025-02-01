"use client"

import React, {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Textarea} from "@/components/ui/textarea"
import {Card, CardContent} from "@/components/ui/card"
import {PlusCircle, Save} from "lucide-react"
import {
    NestedOptionsBase,
    OptionsBase,
    OptionsDefinition,
    OptionsRow,
    OptionsStructureType
} from "@/model/OptionsModel";
import OptionEditor from "@/components/shop/create-node/OptionEditor";
import {toCamelCase} from "@/utils/shop/stringUtils";
import {ExecutionMode} from "@/model/database/database.types";
import {useTranslations} from "next-intl";
import {NodeDefinition} from "@/model/NodeDefinition";

const executionModes: ExecutionMode[] = ["Manual", "Automatic"]

export default function OptionsDefinitionEditor() {
    const t = useTranslations("shop.createNodePage")

    const [nodeDefinition, setNodeDefinition] = useState<NodeDefinition>({
        id: undefined,
        name: "",
        shortDescription: "",
        markdownDocumentation: "",
        executionMode: "Manual",
        executionUrl: "",
        optionsDefinition: {
            title: "",
            nodeId: "",
            structure: [],
        }
    })
    const [selectedOptionType, setSelectedOptionType] = useState<OptionsStructureType | null>(null)

    const updateNodeDefinition = (field: keyof NodeDefinition, value: string) => {
        setNodeDefinition((prev) => {
            const updated = { ...prev, [field]: value }
            if (field === "name") {
                updated.optionsDefinition = { ...updated.optionsDefinition, title: value }
            }
            return updated
        })
    }

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
            setNodeDefinition((prev) => ({
                ...prev,
                optionsDefinition: {
                    ...prev.optionsDefinition,
                    structure: [...prev.optionsDefinition.structure, newOption],
                },
            }))
            setSelectedOptionType(null)
        }
    }

    const updateOption = (index: number, updatedOption: OptionsBase) => {
        setNodeDefinition((prev) => ({
            ...prev,
            optionsDefinition: {
                ...prev.optionsDefinition,
                structure: prev.optionsDefinition.structure.map((option, i) => (i === index ? updatedOption : option)),
            },
        }))
    }

    const removeOption = (index: number) => {
        setNodeDefinition((prev) => ({
            ...prev,
            optionsDefinition: {
                ...prev.optionsDefinition,
                structure: prev.optionsDefinition.structure.filter((_, i) => i !== index),
            },
        }))
    }

    const processNestedStructure = (structure: OptionsBase[]): OptionsBase[] => {
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
                (processedOption as OptionsRow).structure = processNestedStructure((option as OptionsRow).structure)
            }

            if ("options" in option && Array.isArray(option.options)) {
                (processedOption as NestedOptionsBase).options = option.options.map((opt) => ({
                    ...opt,
                    dependentStructure: opt.dependentStructure ? processNestedStructure(opt.dependentStructure) : undefined,
                }))
            }

            return processedOption
        })
    }

    const logNodeDefinition = () => {
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
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
            <Card className="mb-6 pt-4">
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="name" className="text-sm font-medium">
                            {t("nameLabel")}
                        </Label>
                        <Input
                            id="name"
                            value={nodeDefinition.name}
                            onChange={(e) => updateNodeDefinition("name", e.target.value)}
                            placeholder={t("namePlaceholder")}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="shortDescription" className="text-sm font-medium">
                            {t("shortDescriptionLabel")}
                        </Label>
                        <Input
                            id="shortDescription"
                            value={nodeDefinition.shortDescription}
                            onChange={(e) => updateNodeDefinition("shortDescription", e.target.value)}
                            placeholder={t("shortDescriptionPlaceholder")}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="markdownDocumentation" className="text-sm font-medium">
                            {t("markdownDocumentationLabel")}
                        </Label>
                        <Textarea
                            id="markdownDocumentation"
                            value={nodeDefinition.markdownDocumentation}
                            onChange={(e) => updateNodeDefinition("markdownDocumentation", e.target.value)}
                            placeholder={t("markdownDocumentationPlaceholder")}
                            className="mt-1"
                            rows={10}
                        />
                    </div>
                    <div>
                        <Label htmlFor="executionMode" className="text-sm font-medium">
                            {t("executionModeLabel")}
                        </Label>
                        <Select
                            value={nodeDefinition.executionMode}
                            onValueChange={(value) => updateNodeDefinition("executionMode", value as ExecutionMode)}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder={t("executionModePlaceholder")}/>
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
                    <div>
                        <Label htmlFor="executionUrl" className="text-sm font-medium">
                            {t("serverUrlLabel")}
                        </Label>
                        <Input
                            id="executionUrl"
                            value={nodeDefinition.executionUrl}
                            onChange={(e) => updateNodeDefinition("executionUrl", e.target.value)}
                            placeholder={t("serverUrlPlaceholder")}
                            className="mt-1"
                        />
                    </div>
                    <div className="flex items-end space-x-2">
                        <div className="flex-grow">
                            <Label className="text-sm font-medium">{t("addNewOptionLabel")}</Label>
                            <Select onValueChange={(value: OptionsStructureType) => setSelectedOptionType(value)}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder={t("addNewOptionPlaceholder")}/>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(OptionsStructureType).map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={addOption} disabled={!selectedOptionType} className="ml-2">
                            <PlusCircle className="mr-2 h-4 w-4"/>
                            {t("addButton")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <div className="space-y-4 mb-6">
                {nodeDefinition.optionsDefinition.structure.map((option, index) => (
                    <OptionEditor
                        key={index}
                        option={option}
                        onUpdate={(updatedOption) => updateOption(index, updatedOption)}
                        onRemove={() => removeOption(index)}
                    />
                ))}
            </div>
            <Button onClick={logNodeDefinition} className="w-full">
                <Save className="mr-2 h-4 w-4"/>
                {t("saveNodeButton")}
            </Button>
        </div>
    )
}

