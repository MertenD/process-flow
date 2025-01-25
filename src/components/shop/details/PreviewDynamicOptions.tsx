"use client"

import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

import {
    OptionsBase,
    OptionsCheckbox,
    OptionsDefinition,
    OptionsInput,
    OptionsMultipleVariableNameInput,
    OptionsRow,
    OptionsSelect,
    OptionsSelectWithCustom,
    OptionsSeparator,
    OptionsStructureSpecialValues,
    OptionsStructureType,
    OptionsTextarea,
    OptionsText,
    NestedOptionsBase,
} from "@/model/OptionsModel"

/**
 * PreviewDynamicOptions
 * ---------------------
 * Displays a preview of the OptionsDefinition, including dynamic dependencies.
 * All values are stored only in a local state. Nothing is changed externally.
 */
export default function PreviewDynamicOptions({
  optionsDefinition,
}: {
    optionsDefinition: OptionsDefinition
}) {
    // Local State saves "KeyString" => Value
    const [formData, setFormData] = useState<Record<string, any>>({})

    function getValue(option: OptionsBase) {
        const key = option.keyString
        if (!key) return undefined
        if (formData.hasOwnProperty(key)) {
            return formData[key]
        }
        return option.defaultValue
    }

    function setValue(option: OptionsBase, newValue: any) {
        const key = option.keyString
        if (!key) return
        setFormData((old) => ({
            ...old,
            [key]: newValue,
        }))
    }

    function renderDependentOptions(option: NestedOptionsBase) {
        // "option" itself has multiple "options" (an array list).
        // Each element has "values" and possibly "dependentStructure".
        const parentValue = getValue(option)
        return (
            <>
                {option.options.map((opt, i) => {
                    // Falls parentValue in opt.values enthalten ist, zeigen wir den Block
                    const shouldShow = opt.values.includes(parentValue)
                    if (!shouldShow) {
                        return null
                    }

                    return (
                        <div key={i} className="mt-2 space-y-4">
                            {opt.dependentStructure && renderOptions(opt.dependentStructure)}
                        </div>
                    )
                })}
            </>
        )
    }

    function renderOptions(structure: OptionsBase[]): React.ReactNode {
        return structure.map((option, index) => {
            switch (option.type) {
                case OptionsStructureType.TEXT: {
                    const textOption = option as OptionsText
                    return (
                        <p key={index} className="text-sm w-full">
                            {textOption.text}
                        </p>
                    )
                }

                case OptionsStructureType.INPUT: {
                    const inputOption = option as OptionsInput
                    const currentValue = getValue(inputOption) ?? ""
                    return (
                        <div key={index} className="space-y-2 w-full">
                            <Label>{inputOption.label}</Label>
                            <Input
                                placeholder={inputOption.placeholder}
                                value={currentValue}
                                onChange={(e) => setValue(inputOption, e.target.value)}
                            />
                        </div>
                    )
                }

                case OptionsStructureType.VARIABLE_NAME_INPUT: {
                    const variableNameInputOption = option as OptionsInput
                    const currentValue = getValue(variableNameInputOption) ?? ""
                    return (
                        <div key={index} className="space-y-2 w-full">
                            <Label>{variableNameInputOption.label}</Label>
                            <Input
                                placeholder={variableNameInputOption.placeholder}
                                value={currentValue}
                                onChange={(e) => setValue(variableNameInputOption, e.target.value)}
                            />
                        </div>
                    )
                }

                case OptionsStructureType.MULTIPLE_VARIABLE_NAME_INPUT: {
                    const multipleVarOption = option as OptionsMultipleVariableNameInput
                    let currentArray = getValue(multipleVarOption)
                    if (!Array.isArray(currentArray)) {
                        currentArray = []
                    }

                    const handleAdd = () => {
                        const newArr = [...currentArray, ""]
                        setValue(multipleVarOption, newArr)
                    }

                    const handleRemove = (idx: number) => {
                        const newArr = [...currentArray]
                        newArr.splice(idx, 1)
                        setValue(multipleVarOption, newArr)
                    }

                    const handleChange = (idx: number, newVal: string) => {
                        const newArr = [...currentArray]
                        newArr[idx] = newVal
                        setValue(multipleVarOption, newArr)
                    }

                    return (
                        <div key={index} className="space-y-2 w-full">
                            <Label>{multipleVarOption.label}</Label>
                            {currentArray.map((value: string, idx: number) => (
                                <div key={idx} className="flex flex-row space-x-2">
                                    <Input
                                        placeholder={multipleVarOption.placeholder}
                                        value={value}
                                        onChange={(e) => handleChange(idx, e.target.value)}
                                    />
                                    <Button variant="outline" size="icon" onClick={() => handleRemove(idx)}>
                                        <Trash2 />
                                    </Button>
                                </div>
                            ))}
                            <Button className="w-full" onClick={handleAdd}>
                                Add Variable
                            </Button>
                        </div>
                    )
                }

                case OptionsStructureType.SELECT: {
                    const selectOption = option as OptionsSelect
                    const standardValues = selectOption.options
                        .flatMap((opt) =>
                            opt.values.filter(
                                (val) =>
                                    val !== OptionsStructureSpecialValues.AVAILABLE_VARIABLES &&
                                    val !== OptionsStructureSpecialValues.AVAILABLE_ROLES
                            )
                        )
                        .filter((v, i, arr) => arr.indexOf(v) === i) // unique

                    const variableValues = selectOption.options.some((o) =>
                        o.values.includes(OptionsStructureSpecialValues.AVAILABLE_VARIABLES)
                    )
                        ? ["varA", "varB", "varC"]
                        : []

                    const roleValues = selectOption.options.some((o) =>
                        o.values.includes(OptionsStructureSpecialValues.AVAILABLE_ROLES)
                    )
                        ? [
                            { id: 1, name: "Admin", color: "red" },
                            { id: 2, name: "Moderator", color: "blue" },
                        ]
                        : []

                    const currentValue = getValue(selectOption) ?? selectOption.defaultValue ?? ""

                    return (
                        <div key={index} className="space-y-2 w-full">
                            <Label>{selectOption.label}</Label>
                            <Select
                                value={currentValue}
                                onValueChange={(val) => setValue(selectOption, val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Please select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {standardValues.length > 0 && (
                                        <SelectGroup>
                                            <SelectLabel>Standard values</SelectLabel>
                                            {standardValues.map((val) => (
                                                <SelectItem key={val} value={val}>
                                                    {val}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    )}
                                    {variableValues.length > 0 && (
                                        <SelectGroup>
                                            <SelectLabel>Variables</SelectLabel>
                                            {variableValues.map((val) => (
                                                <SelectItem key={val} value={val}>
                                                    {val}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    )}
                                    {roleValues.length > 0 && (
                                        <SelectGroup>
                                            <SelectLabel>Roles</SelectLabel>
                                            {roleValues.map((role) => (
                                                <SelectItem key={role.id} value={String(role.id)}>
                                                    <Badge style={{ backgroundColor: role.color }}>{role.name}</Badge>
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    )}
                                </SelectContent>
                            </Select>

                            {renderDependentOptions(selectOption)}
                        </div>
                    )
                }

                case OptionsStructureType.SELECT_WITH_CUSTOM: {
                    const selectWithCustomOption = option as OptionsSelectWithCustom
                    const allValues = selectWithCustomOption.options.flatMap((opt) => opt.values)
                    const standardValues = allValues.filter(
                        (val) => val !== OptionsStructureSpecialValues.AVAILABLE_VARIABLES
                    )
                    const variableValues = selectWithCustomOption.options.some((o) =>
                        o.values.includes(OptionsStructureSpecialValues.AVAILABLE_VARIABLES)
                    )
                        ? ["varA", "varB", "varC"]
                        : []

                    const currentValue = getValue(selectWithCustomOption) ?? ""

                    const isCustomValue = ![...standardValues, ...variableValues].includes(currentValue)
                    const selectValue = isCustomValue ? "{custom}" : currentValue

                    return (
                        <div key={index} className="space-y-2 w-full">
                            <Label>{selectWithCustomOption.label}</Label>
                            <Select
                                value={selectValue}
                                onValueChange={(val) => {
                                    if (val === "{custom}") {
                                        setValue(selectWithCustomOption, "")
                                    } else {
                                        setValue(selectWithCustomOption, val)
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Please select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {standardValues.length > 0 && (
                                        <SelectGroup>
                                            <SelectLabel>Standard values</SelectLabel>
                                            {standardValues.map((val) => (
                                                <SelectItem key={val} value={val}>
                                                    {val}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    )}
                                    {variableValues.length > 0 && (
                                        <SelectGroup>
                                            <SelectLabel>Variables</SelectLabel>
                                            {variableValues.map((val) => (
                                                <SelectItem key={val} value={val}>
                                                    {val}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    )}
                                    <SelectGroup>
                                        <SelectLabel>Custom</SelectLabel>
                                        <SelectItem value="{custom}">Custom value</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {selectValue === "{custom}" && (
                                <Input
                                    placeholder="Custom value"
                                    value={currentValue}
                                    onChange={(e) => setValue(selectWithCustomOption, e.target.value)}
                                />
                            )}

                            {renderDependentOptions(selectWithCustomOption)}
                        </div>
                    )
                }

                case OptionsStructureType.TEXTAREA: {
                    const textareaOption = option as OptionsTextarea
                    const currentValue = getValue(textareaOption) ?? ""
                    return (
                        <div key={index} className="space-y-2 w-full">
                            <Label>{textareaOption.label}</Label>
                            <Textarea
                                placeholder={textareaOption.placeholder}
                                value={currentValue}
                                onChange={(e) => setValue(textareaOption, e.target.value)}
                            />
                        </div>
                    )
                }

                case OptionsStructureType.CHECKBOX: {
                    const checkboxOption = option as OptionsCheckbox
                    const currentValue = !!getValue(checkboxOption) // Boolean
                    return (
                        <div key={index} className="w-full">
                            <div className="flex flex-row items-center space-x-2 space-y-2">
                                <Checkbox
                                    id={`${checkboxOption.label}-checkbox`}
                                    checked={currentValue}
                                    onCheckedChange={(checked) => setValue(checkboxOption, checked)}
                                />
                                <label htmlFor={`${checkboxOption.label}-checkbox`} className="text-sm font-medium">
                                    {checkboxOption.label}
                                </label>
                            </div>
                            {renderDependentOptions(checkboxOption)}
                        </div>
                    )
                }

                case OptionsStructureType.SEPARATOR: {
                    const separatorOption = option as OptionsSeparator
                    return <Separator key={index} orientation={separatorOption.orientation} />
                }

                case OptionsStructureType.ROW: {
                    const rowOption = option as OptionsRow
                    return (
                        <div key={index} className="flex flex-row space-x-2 w-full">
                            {renderOptions(rowOption.structure)}
                        </div>
                    )
                }

                default:
                    return null
            }
        })
    }

    return (
        <div className="flex flex-col space-y-4 pb-4">
            <div className="font-bold text-lg">{optionsDefinition.title}</div>
            {renderOptions(optionsDefinition.structure)}
        </div>
    )
}
