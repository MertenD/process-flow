"use client"

// TODO Is a keystring necessary? If there is none provided it crashes right now.

// TODO Default value for select should be the first option?

import React, {useEffect, useRef, useState} from "react";
import useStore from "@/components/processEditor/store";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Separator} from "@/components/ui/separator";
import {Checkbox} from "@/components/ui/checkbox";
import {CheckedState} from "@radix-ui/react-checkbox";
import {
    NestedOptionsBase,
    OptionsBase,
    OptionsCheckbox,
    OptionsDefinition,
    OptionsInput,
    OptionsRow,
    OptionsSelect,
    OptionsSelectWithCustom,
    OptionsSeparator, OptionsStructureSpecialValues,
    OptionsStructureType,
    OptionsText,
    OptionsTextarea
} from "@/components/processEditor/modules/flow/toolbars/dynamicOptions/OptionsModel";
import {Role} from "@/types/database.types";
import {createClient} from "@/utils/supabase/client";
import getRoles from "@/actions/get-roles";
import {Badge} from "@/components/ui/badge";

// TODO Bei ändern der variablen namen wird aktuell jedes select was das ausgewählt hatte auf custom gesetzt, bei ändern des eignen wird aktuell nichts mehr selektiert. Wie mache ich das am besten?

// TODO Beim normalen Text input noch mitgeben, was eingegeben werden soll? Zahlen, Text, ...

// TODO Durch die { } in den Variablennamen wird auch ein leerer Variablenname angezeigt, das sollte nicht sein

export default function DynamicOptions({ optionsDefinition, teamId }: Readonly<{ optionsDefinition: OptionsDefinition, teamId: number }>) {

    const inputRefs = useRef<any>({});
    const updateNodeData = useStore((state) => state.updateNodeData)
    const nodeData = useStore((state) => state.getNodeById(optionsDefinition.nodeId)?.data)

    const getAvailableVariableNames = useStore((state) => state.getAvailableVariableNames)
    const [availableVariableNames, setAvailableVariableNames] = useState<string[]>([])
    const [ownVariableNames, setOwnVariableNames] = useState<Map<string, string>>(new Map())

    const [availableRoles, setAvailableRoles] = useState<Role[]>([])

    const edges = useStore((state) => state.edges)

    useEffect(() => {
        getRoles(teamId).then(roles => {
            setAvailableRoles(roles)
        })
    }, [teamId]);

    // TODO Live update of available roles. What happens to some that are already selected and are not available anymore?


    useEffect(() => {
        function setValues(structure: OptionsBase[]) {

            if (nodeData) {

                structure.forEach(option => {
                    if (option.keyString && inputRefs.current[option.keyString]) {
                        if (option.type === OptionsStructureType.CHECKBOX) {
                            inputRefs.current[option.keyString].checked = getValueFromData(option.keyString);
                        } else if (option.type === OptionsStructureType.VARIABLE_NAME_INPUT) {
                            const dataValue = getValueFromData(option.keyString)
                            inputRefs.current[option.keyString].value = dataValue === null ? "" : dataValue;
                            setOwnVariableNames((old) => {
                                const newMap = new Map(old)
                                newMap.set(option.keyString!!, dataValue)
                                return newMap
                            })
                        } else if (option.type === OptionsStructureType.SELECT_WITH_CUSTOM) {
                            const dataValue = getValueFromData(option.keyString)
                            inputRefs.current[option.keyString].value = dataValue === null ? "" : dataValue;
                            const possibleSelectOptions = (option as OptionsSelectWithCustom).options.map(opt => opt.values).flat()
                            const variableNames = getVariablesWithOwn(optionsDefinition.nodeId)
                            if (possibleSelectOptions.includes(dataValue) || variableNames.includes(dataValue)) {
                                inputRefs.current[`${option.keyString}-select`].value = dataValue
                            } else {
                                inputRefs.current[`${option.keyString}-select`].value = "{custom}"
                                inputRefs.current[option.keyString].classList.remove("hidden")
                            }

                        } else {
                            const dataValue = getValueFromData(option.keyString)
                            inputRefs.current[option.keyString].value = dataValue === null ? "" : dataValue;
                        }
                    }
                    // Rekursiver Aufruf für verschachtelte Optionen
                    if (option.type === OptionsStructureType.SELECT || option.type === OptionsStructureType.SELECT_WITH_CUSTOM || option.type === OptionsStructureType.CHECKBOX) {
                        const selectOption = option as NestedOptionsBase;
                        selectOption.options.forEach(option => {
                            if (option.dependentStructure) {
                                setValues(option.dependentStructure);
                            }
                        });
                    }
                    if (option.type === OptionsStructureType.ROW) {
                        const rowOption = option as OptionsRow;
                        setValues(rowOption.structure);
                    }
                });

            }
        }

        setValues(optionsDefinition.structure);
    }, [optionsDefinition.structure]);

    useEffect(() => {
        setAvailableVariableNames(getVariablesWithOwn(optionsDefinition.nodeId))
    }, [optionsDefinition.nodeId, edges, ownVariableNames])

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
        if (!keyString || !nodeData) {
            // TODO Show error? With a toast maybe
            return undefined;
        }

        let keys = keyString.split(".")

        let temp: any = nodeData;
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];

            if (i === keys.length - 1) {
                if (!key || !temp || !temp[key]) {
                    return null;
                }
                return temp[key];
            } else {
                temp = temp[key];
            }
        }

        return undefined;
    }

    function getVariablesWithOwn(nodeId: string) {
        let ownVariableNamesList = Array.from(ownVariableNames.values())
        // if it has not been set yet, get the variable names from the options definition
        if (ownVariableNames.size === 0) {
            const ownVariableNameKeyStrings = optionsDefinition.structure.filter((option) =>
                option.type === OptionsStructureType.VARIABLE_NAME_INPUT
            ).map(option => option.keyString)
            ownVariableNamesList = ownVariableNameKeyStrings.map(keyString => getValueFromData(keyString)).filter(name => name !== null && name !== undefined) as string[]
        }
        return getAvailableVariableNames(nodeId, ownVariableNamesList)
    }

    function getDependentOptions(options: NestedOptionsBase): React.ReactNode {
        return options.options?.map((option, index) => {
            if (!option.dependentStructure) {
                return <></>
            }

            const dataValue = getValueFromData(options.keyString)
            const isHidden: boolean = !option.values.includes(dataValue || options.defaultValue)

            return <div key={option.values.join()} ref={el => {
                if (el && options.keyString) {
                    inputRefs.current[`${options.keyString}-${option.values[index]}`] = el;
                }
            }} className={`${isHidden ? "hidden" : ""} space-y-4`} >
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
                case OptionsStructureType.TEXT:
                    const textOption = option as OptionsText
                    return (
                        <p className="text-sm">
                            { textOption.text }
                        </p>
                    )
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
                case OptionsStructureType.VARIABLE_NAME_INPUT:
                    const variableNameInputOption = option as OptionsInput
                    return (
                        <div className="space-y-2">
                            <Label htmlFor={`${variableNameInputOption.label}-input`}>{variableNameInputOption.label}</Label>
                            <Input
                                id={`${variableNameInputOption.label}-input`}
                                placeholder={variableNameInputOption.placeholder}
                                ref={el => {
                                    if (el && variableNameInputOption.keyString) {
                                        inputRefs.current[variableNameInputOption.keyString] = el;
                                    }
                                }}
                                onChange={e => {
                                    updateValueInData(variableNameInputOption.keyString, e.target.value)
                                    if (variableNameInputOption.keyString) {
                                        setOwnVariableNames((old) => {
                                            const newMap = new Map(old)
                                            newMap.set(variableNameInputOption.keyString!!, e.target.value)
                                            return newMap
                                        })
                                    }
                                }}
                            />
                        </div>
                    )
                case OptionsStructureType.SELECT:
                    const selectOption = option as OptionsSelect

                    const selectDefaultItems = selectOption.options.map(option => {
                        return option.values.filter(value =>
                            value !== OptionsStructureSpecialValues.AVAILABLE_VARIABLES &&
                            value !== OptionsStructureSpecialValues.AVAILABLE_ROLES
                        ).map(value => {
                            return <SelectItem key={value} value={value}>{value}</SelectItem>
                        })
                    }).flat()

                    const flattenOptions = selectOption.options.map(option => option.values).flat()

                    const selectVariableItems = flattenOptions
                        .includes(OptionsStructureSpecialValues.AVAILABLE_VARIABLES) ?
                            availableVariableNames.map((variable) => {
                                return <SelectItem key={variable} value={variable}>{variable}</SelectItem>
                            }) : []
                    const selectRoleItems = flattenOptions
                        .includes(OptionsStructureSpecialValues.AVAILABLE_ROLES) ?
                            availableRoles.map((role) => {
                                return <SelectItem key={role.id} value={role.name}>
                                    <Badge style={{ backgroundColor: role.color }}>{role.name}</Badge>
                                </SelectItem>
                            }) : []

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
                                    { selectDefaultItems.length !== 0 && <SelectGroup>
                                        <SelectLabel>Standard values</SelectLabel>
                                        { selectDefaultItems }
                                    </SelectGroup> }
                                    { selectVariableItems.length !== 0 && <SelectGroup>
                                        <SelectLabel>Variables</SelectLabel>
                                        { selectVariableItems }
                                    </SelectGroup> }
                                    { selectRoleItems.length !== 0 && <SelectGroup>
                                        <SelectLabel>Roles</SelectLabel>
                                        { selectRoleItems }
                                    </SelectGroup> }
                                </SelectContent>
                            </Select>
                        </div>
                        { getDependentOptions(selectOption) }
                    </>
                case OptionsStructureType.SELECT_WITH_CUSTOM:

                    // TODO Custom wird in der Drop down Liste nciht mehr angezeigt.

                    // TODO Custom values in DB mit {} oder so abspeichern, damit man da unterscheiden kann

                    const selectWithCustomOption = option as OptionsSelect
                    const dataValue = getValueFromData(option.keyString)
                    const possibleSelectOptions = (option as OptionsSelectWithCustom).options.map(opt => opt.values).flat()

                    const defaultItems = selectWithCustomOption.options.map(option => {
                        return option.values.filter(value => value !== OptionsStructureSpecialValues.AVAILABLE_VARIABLES).map(value => {
                            return <SelectItem key={value} value={value}>{value}</SelectItem>
                        })
                    }).flat()
                    const variableItems = selectWithCustomOption.options.map(option => option.values).flat().includes(OptionsStructureSpecialValues.AVAILABLE_VARIABLES) ?
                        availableVariableNames.map((variable) => {
                            return <SelectItem key={variable} value={variable}>{variable}</SelectItem>
                        }) : []

                    return <>
                        <div className="space-y-2">
                            <Label>{selectWithCustomOption.label}</Label>
                            <Select
                                defaultValue={(() => {
                                    let variables = availableVariableNames
                                    if (variables.length === 0) {
                                        variables = getVariablesWithOwn(optionsDefinition.nodeId)
                                    }
                                    return (possibleSelectOptions.includes(dataValue) || variables.includes(dataValue)) ? dataValue : "{custom}"
                                })()}
                                onValueChange={newValue => {
                                    const customRef = inputRefs.current[`${selectWithCustomOption.keyString}`]
                                    if (customRef && newValue === "{custom}") {
                                        customRef.classList.remove("hidden")
                                        updateValueInData(selectWithCustomOption.keyString, "")
                                    } else {
                                        customRef.classList.add("hidden")
                                        updateValueInData(selectWithCustomOption.keyString, newValue)
                                    }
                                    toggleDependentOptionsVisibility(selectWithCustomOption, newValue)
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue ref={el => {
                                        if (el && selectWithCustomOption.keyString) {
                                            inputRefs.current[`${selectWithCustomOption.keyString}-select`] = el;
                                        }
                                    }}/>
                                </SelectTrigger>
                                <SelectContent>
                                    { defaultItems.length > 0 && <SelectGroup>
                                        <SelectLabel>Standard values</SelectLabel>
                                        { defaultItems }
                                    </SelectGroup> }
                                    { variableItems.length > 0 && <SelectGroup>
                                        <SelectLabel>Variables</SelectLabel>
                                        { variableItems }
                                    </SelectGroup> }
                                    <SelectGroup>
                                        <SelectLabel>Custom</SelectLabel>
                                        <SelectItem value="{custom}">Custom value</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="Custom value"
                                className="hidden"
                                ref={el => {
                                    if (el && selectWithCustomOption.keyString) {
                                        inputRefs.current[`${selectWithCustomOption.keyString}`] = el;
                                    }
                                }}
                                onChange={e => {
                                    updateValueInData(selectWithCustomOption.keyString, e.target.value)
                                    toggleDependentOptionsVisibility(selectWithCustomOption, e.target.value)
                                }}
                            />
                        </div>
                        { getDependentOptions(selectWithCustomOption) }
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
                            <Checkbox
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
                            />
                            <label
                                htmlFor={`${checkboxOption.label}-checkbox`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                style={{ marginTop: 0 }}
                            >
                                { checkboxOption.label }
                            </label>
                        </div>
                        { getDependentOptions(checkboxOption) }
                    </>
                case OptionsStructureType.SEPARATOR:
                    const separatorOption = option as OptionsSeparator
                    return (
                        <Separator orientation={separatorOption.orientation} />
                    )
                case OptionsStructureType.ROW:
                    const rowOption = option as OptionsRow
                    return (
                        <div className="flex flex-row space-x-2">
                            { renderOptions(rowOption.structure) }
                        </div>
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
        <div className="flex flex-col space-y-4 pb-4">
            <div className="font-bold text-lg">{ optionsDefinition.title }</div>
            { renderOptions(optionsDefinition.structure) }
        </div>
    )
}

export function setDefaultValues(structure: OptionsBase[], data: any) {
    structure.forEach(option => {
        // set nested data value to default value
        if (option.keyString) {
            let keys = option.keyString.split(".");

            let temp: any = data;
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];

                if (i === keys.length - 1) {
                    temp[key] = temp[key] || option.defaultValue;
                } else {
                    temp[key] = { ...temp[key] };
                }

                temp = temp[key];
            }
        }
        // Recursively set default values for dependent options
        if (option.type === OptionsStructureType.SELECT || option.type === OptionsStructureType.SELECT_WITH_CUSTOM || option.type === OptionsStructureType.CHECKBOX) {
            const selectOption = option as NestedOptionsBase;
            selectOption.options.forEach(option => {
                if (option.dependentStructure) {
                    setDefaultValues(option.dependentStructure, data);
                }
            });
        }
        if (option.type === OptionsStructureType.ROW) {
            const rowOption = option as OptionsRow;
            setDefaultValues(rowOption.structure, data);
        }
    });
}