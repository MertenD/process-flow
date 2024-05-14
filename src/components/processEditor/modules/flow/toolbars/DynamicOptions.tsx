"use client"

import {useEffect, useRef} from "react";
import useStore from "@/components/processEditor/store";

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
    suggestions?: string[],
}

export interface OptionsSelect extends OptionsBase {
    label: string
    options: string[]
}

export interface OptionsTextarea extends OptionsBase {
    label: string
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
                        return (
                            <div key={index} className="flex flex-col">
                                <label>{ inputOption.label }</label>
                                <input
                                    type="text"
                                    ref={el => {
                                        if (el && inputOption.keyString) {
                                            inputRefs.current[inputOption.keyString] = el;
                                        }
                                    }}
                                    onChange={ e => updateValueInData(inputOption.keyString, e.target.value) }
                                />
                            </div>
                        )
                    case OptionsStructureType.SELECT:
                        const selectOption = option as OptionsSelect
                        return (
                            <div key={index} className="flex flex-col">
                                <label>{ selectOption.label }</label>
                                <select
                                    ref={el => {
                                        if (el && selectOption.keyString) {
                                            inputRefs.current[selectOption.keyString] = el;
                                        }
                                    }}
                                    onChange={ e => updateValueInData(selectOption.keyString, e.target.value) }
                                >
                                    { selectOption.options.map((option, index) => {
                                        return <option key={index} value={option}>{ option }</option>
                                    }) }
                                </select>
                            </div>
                        )
                    case OptionsStructureType.TEXTAREA:
                        const textareaOption = option as OptionsTextarea
                        return (
                            <div key={index} className="flex flex-col">
                                <label>{ textareaOption.label }</label>
                                <textarea
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
                            <div key={index} className="border-b border-foreground"/>
                        )
                }
            }) }
        </div>
    )
}