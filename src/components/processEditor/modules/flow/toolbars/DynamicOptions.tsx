"use client"

import {useEffect, useRef} from "react";
import useStore from "@/components/processEditor/store";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Separator} from "@/components/ui/separator";

export enum OptionsStructureType {
    INPUT = "input",
    SELECT = "select",
    TEXTAREA = "textarea",
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
    isHiding?: boolean
    keyString?: string
}

export interface OptionsInput extends OptionsBase {
    label: string
    placeholder: string
    suggestions?: string[]
}

export interface OptionsTextarea extends OptionsBase {
    label: string
    placeholder: string
}

export interface OptionsSelect extends OptionsBase {
    label: string
    options: string[]
}

export interface OptionsSeparator extends OptionsBase {
}

export default function DynamicOptions<Data>({ data, optionsDefinition }: Readonly<{ data: Data, optionsDefinition: OptionsDefinition }>) {

    const inputRefs = useRef<any>({});
    const updateNodeData = useStore((state) => state.updateNodeData)

    useEffect(() => {
        optionsDefinition.structure.forEach(option => {
            if (option.keyString && inputRefs.current[option.keyString]) {
                inputRefs.current[option.keyString].value = getValueFromData(option.keyString);
            }
        });
    }, [data, optionsDefinition.structure]);

    // Update value in data object based on keyString (e.g. "task.title" -> { task: { title: "new value" } })
    function updateValueInData(keyString: string | undefined, newValue: any): any {
        if (!keyString) {
            // TODO Show error? With a toast maybe
            return;
        }

        let keys = keyString.split(".");
        let currentData: any = { ...data };

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
    function getValueFromData(keyString: string | undefined): any {
        if (!keyString) {
            // TODO Show error? With a toast maybe
            return undefined;
        }

        let keys = keyString.split(".");
        let currentData: any = { ...data };

        let temp: any = currentData;
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];

            if (i === keys.length - 1) {
                if (temp[key] === undefined) {
                    return "";
                }
                return temp[key];
            } else {
                temp = temp[key];
            }
        }

        return undefined;
    }
    
    return (
        <div className="flex flex-col space-y-2">
            <div className="font-bold text-lg">{ optionsDefinition.title }</div>
            { optionsDefinition.structure.map((option, index) => {
                switch (option.type) {
                    case OptionsStructureType.INPUT:
                        const inputOption = option as OptionsInput
                        const listId = `suggestions-${inputOption.label.toLowerCase().replace(" ", "-")}`
                        return (
                            <div className="space-y-2">
                                <Label htmlFor="task-title-input">{ inputOption.label }</Label>
                                <Input
                                    id="task-title-input"
                                    placeholder={ inputOption.placeholder }
                                    ref={el => {
                                        if (el && inputOption.keyString) {
                                            inputRefs.current[inputOption.keyString] = el;
                                        }
                                    }}
                                    onChange={e => updateValueInData(inputOption.keyString, e.target.value)}
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
                        return (
                            <div className="space-y-2">
                                <Label>{ selectOption.label }</Label>
                                <Select
                                    defaultValue={getValueFromData(selectOption.keyString)}
                                    onValueChange={newValue => updateValueInData(selectOption.keyString, newValue)}
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
                                            { selectOption.options.map(option => {
                                                return <SelectItem key={option} value={option}>{option}</SelectItem>
                                            })}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )
                    case OptionsStructureType.TEXTAREA:
                        const textareaOption = option as OptionsTextarea
                        return (
                            <div className="space-y-2">
                                <Label htmlFor="task-description-input">{ textareaOption.label }</Label>
                                <Textarea
                                    id="task-description-input"
                                    placeholder={ textareaOption.placeholder }
                                    ref={el => {
                                        if (el && textareaOption.keyString) {
                                            inputRefs.current[textareaOption.keyString] = el;
                                        }
                                    }}
                                    onChange={ e => updateValueInData(textareaOption.keyString, e.target.value) }
                                />
                            </div>
                        )
                    case OptionsStructureType.SEPARATOR:
                        return (
                            <Separator />
                        )
                }
            }) }
        </div>
    )
}