"use client"

import React, {useState} from "react";
import {Node, useOnSelectionChange} from "reactflow";
import {
    ActivityNodeData,
    ActivityOptions,
    getActivityOptionsDefinition
} from "@/components/processEditor/modules/flow/nodes/ActivityNode";
import {NodeTypes} from "@/model/NodeTypes";
import {ActivityType} from "@/model/ActivityType";
import DynamicOptions, {
    OptionsDefinition,
    OptionsInput,
    OptionsSelect,
    OptionsSeparator,
    OptionsStructureType,
    OptionsTextarea
} from "@/components/processEditor/modules/flow/toolbars/DynamicOptions";

export default function OptionsToolbar() {

    const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);

    useOnSelectionChange({
        onChange: ({ nodes, edges }) => {
            if (nodes && nodes.length === 1) {
                setSelectedNode(nodes[0]);
            } else {
                setSelectedNode(undefined);
            }
        },
    });

    if (!selectedNode) {
        return <></>
    }

    let options = <></>
    switch (selectedNode.type) {
        case NodeTypes.ACTIVITY_NODE:
            options = <DynamicOptions data={selectedNode.data} optionsDefinition={ getActivityOptionsDefinition(selectedNode.id, selectedNode.data) } />
            break;
        default:
            options = <h2 className="text-2xl font-semibold">{ selectedNode.type }</h2>
            break;
    }

    return <aside className="w-[300px] h-full p-3 border-l overflow-y-auto">
        { options }
    </aside>
}

/*enum OptionsStructureType {
    INPUT = "input",
    SELECT = "select",
    TEXTAREA = "textarea",
    SEPARATOR = "separator"
}

interface OptionsDefinition<Data> {
    title: string,
    state: Data,
    setState: (newState: Data) => void,
    structure: OptionsBase[]
}

interface OptionsBase {
    type: OptionsStructureType
    isHiding?: boolean
}

interface OptionsInput extends OptionsBase {
    label: string
    value: string
    suggestions?: string[],
    onChange: (newValue: string) => void
}

interface OptionsSelect extends OptionsBase {
    label: string
    value: string
    options: string[],
    onChange: (newValue: string) => void
}

interface OptionsTextarea extends OptionsBase {
    label: string
    value: string
    onChange: (newValue: string) => void
}

interface OptionsSeparator extends OptionsBase {
}

function OptionsContainer<Data>({ definition }: { definition: OptionsDefinition<Data> }) {

    function InputOption({ label, value, suggestions, onChange }: OptionsInput) {

        const listId = `suggestions-${label.toLowerCase().replace(" ", "-")}`

        return <div className="space-y-2">
            <Label htmlFor="task-title-input">{label}</Label>
            <Input
                id="task-title-input"
                placeholder="Task title"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                list={listId}
            />
            <datalist id={listId}>
                {
                    suggestions?.map(suggestion => {
                        return <option key={suggestion} value={suggestion}>
                            {suggestion}
                        </option>
                    })
                }
            </datalist>
        </div>
    }

    function SelectOption({ label, value, options, onChange }: OptionsSelect) {
        return <div className="space-y-2">
            <Label>{label}</Label>
            <Select
                defaultValue={value}
                onValueChange={onChange}
            >
                <SelectTrigger>
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {options.map(option => {
                            return <SelectItem key={option} value={option}>{option}</SelectItem>
                        })}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    }

    function TextareaOption({ label, value, onChange }: OptionsTextarea) {
        return <div className="space-y-2">
            <Label htmlFor="task-description-input">{label}</Label>
            <Textarea
                id="task-description-input"
                placeholder="Task description"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    }

    return <div className="w-full flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold">{ definition.title }</h2>
        { definition.structure.map(option => {
            if (option.isHiding) {
                return <></>
            }
            switch (option.type) {
                case OptionsStructureType.INPUT:
                    return <InputOption {...(option as OptionsInput)}/>
                case OptionsStructureType.SELECT:
                    return <SelectOption {...(option as OptionsSelect)}/>
                case OptionsStructureType.TEXTAREA:
                    return <TextareaOption {...(option as OptionsTextarea)}/>
                case OptionsStructureType.SEPARATOR:
                    return <Separator />
            }
        }) }
    </div>
}*/