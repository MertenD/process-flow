import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {NestedOptionsBase, OptionsBase, OptionsRow, OptionsSelect, OptionsStructureType} from "@/model/OptionsModel"
import {useTranslations} from "next-intl";

interface OptionEditorProps {
    option: OptionsBase
    onUpdate: (updatedOption: OptionsBase) => void
    onRemove: () => void
    isNested?: boolean
}

export default function OptionEditor({ option, onUpdate, onRemove, isNested = false }: OptionEditorProps) {
    const t = useTranslations("shop.createNodePage")

    const [newOptionValue, setNewOptionValue] = useState("")
    const [selectedOptionType, setSelectedOptionType] = useState<OptionsStructureType | null>(null)
    const [isExpanded, setIsExpanded] = useState(true)

    useEffect(() => {
        if (option.type === OptionsStructureType.CHECKBOX && (!("options" in option) || (option as NestedOptionsBase).options.length === 0)) {
            onUpdate({
                ...option,
                options: [
                    { values: [true], dependentStructure: [] },
                    { values: [false], dependentStructure: [] },
                ],
            } as NestedOptionsBase)
        }
    }, [option.type])

    const updateField = (field: string, value: any) => {
        onUpdate({ ...option, [field]: value })
    }

    const addNestedOption = () => {
        if (
            newOptionValue &&
            (option.type === OptionsStructureType.SELECT || option.type === OptionsStructureType.SELECT_WITH_CUSTOM)
        ) {
            const updatedOptions = [
                ...((option as OptionsSelect).options || []),
                { values: [newOptionValue], dependentStructure: [] },
            ]
            onUpdate({ ...option, options: updatedOptions } as OptionsSelect)
            setNewOptionValue("")
        }
    }

    const removeNestedOption = (index: number) => {
        if ("options" in option) {
            const updatedOptions = (option as NestedOptionsBase).options.filter((_, i) => i !== index)
            onUpdate({ ...option, options: updatedOptions } as NestedOptionsBase)
        }
    }

    const addDependentStructure = (optionIndex: number) => {
        if (selectedOptionType && "options" in option) {
            const updatedOptions = (option as NestedOptionsBase).options.map((opt, index) => {
                if (index === optionIndex) {
                    return {
                        ...opt,
                        dependentStructure: [...(opt.dependentStructure || []), { type: selectedOptionType }],
                    }
                }
                return opt
            })
            onUpdate({ ...option, options: updatedOptions } as NestedOptionsBase)
            setSelectedOptionType(null)
        }
    }

    const updateDependentStructure = (optionIndex: number, structureIndex: number, updatedStructure: OptionsBase) => {
        if ("options" in option) {
            const updatedOptions = (option as NestedOptionsBase).options.map((opt, index) => {
                if (index === optionIndex) {
                    const updatedDependentStructure =
                        opt.dependentStructure?.map((struct, sIndex) => (sIndex === structureIndex ? updatedStructure : struct)) ||
                        []
                    return { ...opt, dependentStructure: updatedDependentStructure }
                }
                return opt
            })
            onUpdate({ ...option, options: updatedOptions } as NestedOptionsBase)
        }
    }

    const removeDependentStructure = (optionIndex: number, structureIndex: number) => {
        if ("options" in option) {
            const updatedOptions = (option as NestedOptionsBase).options.map((opt, index) => {
                if (index === optionIndex) {
                    const updatedDependentStructure =
                        opt.dependentStructure?.filter((_, sIndex) => sIndex !== structureIndex) || []
                    return { ...opt, dependentStructure: updatedDependentStructure }
                }
                return opt
            })
            onUpdate({ ...option, options: updatedOptions } as NestedOptionsBase)
        }
    }

    const addRowElement = () => {
        if (selectedOptionType && option.type === OptionsStructureType.ROW) {
            const newElement = { type: selectedOptionType } as OptionsBase
            if (
                selectedOptionType === OptionsStructureType.SELECT ||
                selectedOptionType === OptionsStructureType.SELECT_WITH_CUSTOM
            ) {
                ;(newElement as OptionsSelect).options = []
            }
            const updatedStructure = [...((option as OptionsRow).structure || []), newElement]
            onUpdate({ ...option, structure: updatedStructure } as OptionsRow)
            setSelectedOptionType(null)
        }
    }

    const updateRowElement = (index: number, updatedElement: OptionsBase) => {
        if (option.type === OptionsStructureType.ROW) {
            const updatedStructure = (option as OptionsRow).structure.map((element, i) =>
                i === index ? updatedElement : element,
            )
            onUpdate({ ...option, structure: updatedStructure } as OptionsRow)
        }
    }

    const removeRowElement = (index: number) => {
        if (option.type === OptionsStructureType.ROW) {
            const updatedStructure = (option as OptionsRow).structure.filter((_, i) => i !== index)
            onUpdate({ ...option, structure: updatedStructure } as OptionsRow)
        }
    }

    return (
        <Card className={`${isNested ? "mt-2" : ""}`}>
            <CardHeader className="py-3">
                <CardTitle className="text-lg flex justify-between items-center">
                    <span>{option.type.charAt(0).toUpperCase() + option.type.slice(1)}</span>
                    <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={onRemove}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            {isExpanded && (
                <CardContent className="py-2">
                    {option.type === OptionsStructureType.TEXT && (
                        <div className="space-y-2">
                            <Label htmlFor="text">{ t("textLabel") }</Label>
                            <Input
                                id="text"
                                value={(option as any).text || ""}
                                onChange={(e) => updateField("text", e.target.value)}
                                placeholder={ t("textPlaceholder") }
                            />
                        </div>
                    )}
                    {(option.type === OptionsStructureType.INPUT ||
                        option.type === OptionsStructureType.VARIABLE_NAME_INPUT ||
                        option.type === OptionsStructureType.MULTIPLE_VARIABLE_NAME_INPUT ||
                        option.type === OptionsStructureType.TEXTAREA ||
                        option.type === OptionsStructureType.SELECT ||
                        option.type === OptionsStructureType.SELECT_WITH_CUSTOM ||
                        option.type === OptionsStructureType.CHECKBOX) && (
                        <div className="space-y-2">
                            <Label htmlFor="label">{ t("labelLabel") }</Label>
                            <Input
                                id="label"
                                value={(option as any).label || ""}
                                onChange={(e) => updateField("label", e.target.value)}
                                placeholder={ t("labelPlaceholder") }
                            />
                        </div>
                    )}
                    {(option.type === OptionsStructureType.INPUT ||
                        option.type === OptionsStructureType.VARIABLE_NAME_INPUT ||
                        option.type === OptionsStructureType.MULTIPLE_VARIABLE_NAME_INPUT ||
                        option.type === OptionsStructureType.TEXTAREA) && (
                        <div className="space-y-2 mt-2">
                            <Label htmlFor="placeholder">{ t("placeholderLabel") }</Label>
                            <Input
                                id="placeholder"
                                value={(option as any).placeholder || ""}
                                onChange={(e) => updateField("placeholder", e.target.value)}
                                placeholder={ t("placeholderPlaceholder") }
                            />
                        </div>
                    )}
                    {(option.type === OptionsStructureType.SELECT ||
                        option.type === OptionsStructureType.SELECT_WITH_CUSTOM ||
                        option.type === OptionsStructureType.CHECKBOX) && (
                        <div className="flex flex-row items-center space-x-2 mt-2">
                            <Label htmlFor="defaultValue">{ t("defaultValueLabel") }:</Label>
                            {option.type === OptionsStructureType.CHECKBOX ? (
                                <Checkbox
                                    checked={(option as any).defaultValue || false}
                                    onCheckedChange={(checked) => updateField("defaultValue", checked)}
                                />
                            ) : (
                                <Input
                                    id="defaultValue"
                                    value={(option as any).defaultValue || ""}
                                    onChange={(e) => updateField("defaultValue", e.target.value)}
                                    placeholder={ t("defaultValuePlaceholder") }
                                />
                            )}
                        </div>
                    )}
                    {option.type === OptionsStructureType.SEPARATOR && (
                        <div className="space-y-2 mt-2">
                            <Label htmlFor="orientation">{ t("orientationLabel") }</Label>
                            <Select
                                name="orientation"
                                value={(option as any).orientation || ""}
                                onValueChange={(value) => updateField("orientation", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={ t("orientationPlaceholder") } />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="horizontal">{ t("horizontal") }</SelectItem>
                                    <SelectItem value="vertical">{ t("vertical") }</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {(option.type === OptionsStructureType.SELECT ||
                        option.type === OptionsStructureType.SELECT_WITH_CUSTOM ||
                        option.type === OptionsStructureType.CHECKBOX) && (
                        <div className="space-y-4 mt-4">
                            <Label>{ t("selectValues") }</Label>
                            {(option as NestedOptionsBase).options?.map((opt, index) => (
                                <div key={index} className="pl-4 border-l-2 border-gray-200 space-y-2">
                                    <div className="flex items-center space-x-2">
                                        {option.type === OptionsStructureType.CHECKBOX ? (
                                            <Label>{opt.values[0].toString()}</Label>
                                        ) : (
                                            <Input
                                                value={opt.values[0]}
                                                onChange={(e) => {
                                                    const updatedOptions = (option as NestedOptionsBase).options.map((o, i) =>
                                                        i === index ? { ...o, values: [e.target.value] } : o,
                                                    )
                                                    onUpdate({ ...option, options: updatedOptions } as NestedOptionsBase)
                                                }}
                                            />
                                        )}
                                        {option.type !== OptionsStructureType.CHECKBOX && (
                                            <Button variant="destructive" size="sm" onClick={() => removeNestedOption(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    {opt.dependentStructure?.map((struct, structIndex) => (
                                        <div key={structIndex} className="pl-4 border-l-2 border-gray-200">
                                            <OptionEditor
                                                option={struct}
                                                onUpdate={(updatedStructure) => updateDependentStructure(index, structIndex, updatedStructure)}
                                                onRemove={() => removeDependentStructure(index, structIndex)}
                                                isNested={true}
                                            />
                                        </div>
                                    ))}
                                    <div className="flex items-end space-x-2">
                                        <div className="flex-grow">
                                            <Select onValueChange={(value: OptionsStructureType) => setSelectedOptionType(value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={ t("selectDependentStructure") } />
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
                                        <Button onClick={() => addDependentStructure(index)} disabled={!selectedOptionType} size="sm">
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            { t("addButton") }
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {(option.type === OptionsStructureType.SELECT ||
                                option.type === OptionsStructureType.SELECT_WITH_CUSTOM) && (
                                <div className="flex items-center space-x-2">
                                    <Input
                                        placeholder={ t("newValueValue" )}
                                        value={newOptionValue}
                                        onChange={(e) => setNewOptionValue(e.target.value)}
                                    />
                                    <Button onClick={addNestedOption} disabled={!newOptionValue}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        { t("addButton") }
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                    {option.type === OptionsStructureType.ROW && (
                        <div className="space-y-4 mt-4">
                            <Label>{ t("rowElements") }</Label>
                            {(option as OptionsRow).structure?.map((element, index) => (
                                <div key={index} className="pl-4 border-l-2 border-gray-200">
                                    <OptionEditor
                                        option={element}
                                        onUpdate={(updatedElement) => updateRowElement(index, updatedElement)}
                                        onRemove={() => removeRowElement(index)}
                                        isNested={true}
                                    />
                                </div>
                            ))}
                            <div className="flex items-end space-x-2">
                                <div className="flex-grow">
                                    <Select onValueChange={(value: OptionsStructureType) => setSelectedOptionType(value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={ t("selectRowElements") } />
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
                                <Button onClick={addRowElement} disabled={!selectedOptionType} size="sm">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    { t("addButton") }
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    )
}

