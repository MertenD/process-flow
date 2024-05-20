"use client"

import React, {useEffect, useRef} from "react";
import useStore from "@/components/processEditor/store";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Separator} from "@/components/ui/separator";
import {Checkbox} from "@/components/ui/checkbox";
import {CheckedState} from "@radix-ui/react-checkbox";

export enum OptionsStructureType {
    INPUT = "input",
    SELECT = "select",
    TEXTAREA = "textarea",
    CHECKBOX = "checkbox",
    SEPARATOR = "separator"
}

export interface OptionsDefinition {
    title: string,
    nodeId: string,
    structure: OptionsBase[]
}

interface OptionsBase {
    type: OptionsStructureType
    defaultValue?: any
    keyString?: string
}

interface NestedOptionsBase extends OptionsBase {
    options: {
        values: any[],
        dependentStructure?: OptionsBase[]
    }[]
}

interface StructureOptionBase extends OptionsBase {}

export interface OptionsInput extends OptionsBase {
    label: string
    placeholder: string
    suggestions?: string[]
}

export interface OptionsTextarea extends OptionsBase {
    label: string
    placeholder: string
}

export interface OptionsSelect extends NestedOptionsBase {
    label: string
    defaultValue: string
}

export interface OptionsCheckbox extends NestedOptionsBase {
    label: string
    defaultValue: boolean
}

export interface OptionsSeparator extends StructureOptionBase {
}

export default function DynamicOptions({ optionsDefinition }: Readonly<{ optionsDefinition: OptionsDefinition }>) {

    const inputRefs = useRef<any>({});
    const updateNodeData = useStore((state) => state.updateNodeData)
    const nodeData = useStore((state) => state.getNodeById(optionsDefinition.nodeId)?.data)

    useEffect(() => {
        function setValues(structure: OptionsBase[]) {
            structure.forEach(option => {
                if (option.keyString && inputRefs.current[option.keyString]) {
                    if (option.type === OptionsStructureType.CHECKBOX) {
                        inputRefs.current[option.keyString].checked = getValueFromData(option.keyString);
                    } else {
                        const dataValue = getValueFromData(option.keyString)
                        inputRefs.current[option.keyString].value = dataValue === null ? "" : dataValue;
                    }
                }
                // Rekursiver Aufruf für verschachtelte Optionen
                if ('options' in option) {
                    const selectOption = option as NestedOptionsBase;
                    selectOption.options.forEach(option => {
                        if (option.dependentStructure) {
                            setValues(option.dependentStructure);
                        }
                    });
                }
            });
        }

        setValues(optionsDefinition.structure);
    }, [getValueFromData, optionsDefinition.structure]);

    // Update value in data object based on keyString (e.g. "task.title" -> { task: { title: "new value" } })
    function updateValueInData(keyString: string | undefined, newValue: any): any {
        if (!keyString) {
            // TODO Show error? With a toast maybe
            console.log("Update failed: keyString is undefined")
            return;
        }

        let keys = keyString.split(".");
        let currentData: any = { ...nodeData };

        let temp: any = currentData;
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];

            if (i === keys.length - 1) {
                temp[key] = newValue;
            } else {
                temp[key] = { ...temp[key] };
            }

            temp = temp[key];
        }

        updateNodeData(optionsDefinition.nodeId, currentData);
    }

    // Get value from data object based on keyString (e.g. "task.title" -> { task: { title: "value" } } -> "value")
    function getValueFromData(keyString: string | undefined): undefined | null | any {
        if (!keyString) {
            // TODO Show error? With a toast maybe
            return undefined;
        }

        let keys = keyString.split(".")

        let temp: any = nodeData;
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];

            if (i === keys.length - 1) {
                if (temp[key] === undefined) {
                    return null;
                }
                return temp[key];
            } else {
                temp = temp[key];
            }
        }

        return undefined;
    }

    function getDependentOptions(options: NestedOptionsBase): React.ReactNode {
        return options.options?.map((option, index) => {
            const dataValue = getValueFromData(options.keyString)
            const isHidden: boolean = !option.values.includes(dataValue || options.defaultValue)

            return <div key={option.values.join()} ref={el => {
                if (el && options.keyString) {
                    inputRefs.current[`${options.keyString}-${option.values[index]}`] = el;
                }
            }} className={isHidden ? "hidden" : ""} >
                { renderOptions(option.dependentStructure || []) }
            </div>
        })
    }

    function toggleDependentOptionsVisibility(options: NestedOptionsBase, value: any) {
        options.options?.forEach((option, index) => {
            const dependentOptionsRef = inputRefs.current[`${options.keyString}-${option.values[index]}`]
            if (option.values.includes(value)) {
                if (dependentOptionsRef) {
                    dependentOptionsRef.classList.remove("hidden")
                }
            } else {
                if (dependentOptionsRef) {
                    dependentOptionsRef.classList.add("hidden")
                }
            }
        })
    }

    function renderOptions(structure: OptionsBase[]): React.ReactNode {
        return structure.map((option, index) => {
            switch (option.type) {
                case OptionsStructureType.INPUT:
                    const inputOption = option as OptionsInput
                    const listId = `suggestions-${inputOption.label.toLowerCase().replace(" ", "-")}`
                    return (
                        <div className="space-y-2">
                            <Label htmlFor={`${inputOption.label}-input`}>{inputOption.label}</Label>
                            <Input
                                id={`${inputOption.label}-input`}
                                placeholder={inputOption.placeholder}
                                ref={el => {
                                    if (el && inputOption.keyString) {
                                        inputRefs.current[inputOption.keyString] = el;
                                    }
                                }}
                                onChange={e => {
                                    updateValueInData(inputOption.keyString, e.target.value)
                                }}
                                list={listId}
                            />
                            <datalist id={listId}>
                                {
                                    inputOption.suggestions?.map(suggestion => {
                                        return <option key={suggestion} value={suggestion}>
                                            {suggestion}
                                        </option>
                                    })
                                }
                            </datalist>
                        </div>
                    )
                case OptionsStructureType.SELECT:
                    const selectOption = option as OptionsSelect
                    return <>
                        <div className="space-y-2">
                            <Label>{selectOption.label}</Label>
                            <Select
                                defaultValue={getValueFromData(selectOption.keyString)}
                                onValueChange={newValue => {
                                    updateValueInData(selectOption.keyString, newValue)
                                    toggleDependentOptionsVisibility(selectOption, newValue)
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue ref={el => {
                                        if (el && selectOption.keyString) {
                                            inputRefs.current[selectOption.keyString] = el;
                                        }
                                    }}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {selectOption.options.map(option => {
                                            return option.values.map(value => {
                                                return <SelectItem key={value} value={value}>{value}</SelectItem>
                                            })
                                        }).flat()}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        { getDependentOptions(selectOption) }
                    </>
                case OptionsStructureType.TEXTAREA:
                    const textareaOption = option as OptionsTextarea
                    return (
                        <div className="space-y-2">
                            <Label htmlFor={`${textareaOption.label}-text-area`}>{textareaOption.label}</Label>
                            <Textarea
                                id={`${textareaOption.label}-text-area`}
                                placeholder={textareaOption.placeholder}
                                ref={el => {
                                    if (el && textareaOption.keyString) {
                                        inputRefs.current[textareaOption.keyString] = el;
                                    }
                                }}
                                onChange={e => updateValueInData(textareaOption.keyString, e.target.value)}
                            />
                        </div>
                    )
                case OptionsStructureType.CHECKBOX:
                    const checkboxOption = option as OptionsCheckbox
                    return <>
                        <div className="flex flex-row items-center space-x-2 space-y-2">
                            {<Checkbox
                                id={`${checkboxOption.label}-checkbox`}
                                ref={el => {
                                    if (el && checkboxOption.keyString) {
                                        inputRefs.current[checkboxOption.keyString] = el;
                                    }
                                }}
                                defaultChecked={(() => {
                                    const dataValue = getValueFromData(checkboxOption.keyString)
                                    if (dataValue === undefined || dataValue === null || dataValue === "") {
                                        return checkboxOption.defaultValue
                                    } else {
                                        return dataValue
                                    }
                                })()}
                                onCheckedChange={(newValue: CheckedState) => {
                                    updateValueInData(checkboxOption.keyString, newValue)
                                    toggleDependentOptionsVisibility(checkboxOption, newValue)
                                }}
                            />}
                            <label
                                htmlFor={`${checkboxOption.label}-checkbox`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                { checkboxOption.label }
                            </label>
                        </div>
                        { getDependentOptions(checkboxOption) }
                    </>
                case OptionsStructureType.SEPARATOR:
                    return (
                        <Separator/>
                    )
            }
        })
    }

    if (nodeData === undefined) {
        return <div>
            No data to edit found for node
        </div>
    }

    return (
        <div className="flex flex-col space-y-4">
            <div className="font-bold text-lg">{ optionsDefinition.title }</div>
            { renderOptions(optionsDefinition.structure) }
        </div>
    )
}

export function setDefaultValues(structure: OptionsBase[], data: any) {
    structure.forEach(option => {
        if (option.keyString) {
            data[option.keyString] = data[option.keyString] || option.defaultValue;
        }
        // Recursively set default values for dependent options
        if ('options' in option) {
            const selectOption = option as NestedOptionsBase;
            selectOption.options.forEach(option => {
                if (option.dependentStructure) {
                    setDefaultValues(option.dependentStructure, data);
                }
            });
        }
    });
}