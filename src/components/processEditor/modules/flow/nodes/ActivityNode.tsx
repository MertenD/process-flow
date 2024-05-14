import React, {useEffect, useState} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import useStore, {handleStyle, selectedColor} from "../../../store";
import {GamificationType} from "@/model/GamificationType";
import {PointsGamificationOptionsData} from "../../gamification/PointsGamificationOptions";
import {ActivityType} from "@/model/ActivityType";
import {BadgeGamificationOptionsData} from "../../gamification/BadgeGamificationOptions";
import DropdownOption from "../../form/DropdownOption";
import TextOption from "../../form/TextOption";
import OptionsContainer from "../../form/OptionsContainer";
import TitleOption from "../../form/TitleOption";
import GamificationOptions from "../../gamification/GamificationOptions";
import DynamicOptions, {
    OptionsDefinition,
    OptionsInput, OptionsSelect, OptionsSeparator,
    OptionsStructureType, OptionsTextarea
} from "@/components/processEditor/modules/flow/toolbars/DynamicOptions";

export type ActivityNodeData = {
    backgroundColor?: string,
    task?: string,
    description?: string,
    activityType?: ActivityType
    choices?: string,
    inputRegex?: string,
    variableName?: string,
    gamificationType? : GamificationType
    gamificationOptions?: PointsGamificationOptionsData | BadgeGamificationOptionsData
}

export function getActivityOptionsDefinition(nodeId: string, data: ActivityNodeData): OptionsDefinition {
    return {
        title: "Activity Options",
        nodeId: nodeId,
        structure: [
            {
                type: OptionsStructureType.INPUT,
                label: "Title",
                keyString: "task"
            } as OptionsInput,
            {
                type: OptionsStructureType.TEXTAREA,
                label: "Description",
                keyString: "description"
            } as OptionsTextarea,
            {
                type: OptionsStructureType.SEPARATOR,
            } as OptionsSeparator,
            {
                type: OptionsStructureType.SELECT,
                label: "Activity type",
                options: Object.values(ActivityType),
                defaultValue: ActivityType.TEXT_INPUT,
                keyString: "activityType"
            } as OptionsSelect,
            {
                type: OptionsStructureType.INPUT,
                label: "Input regex",
                suggestions: [
                    "[0-9]+",
                    "[a-zA-Z .,-_]+",
                    "[a-zA-Z .,-_0-9]+",
                    "[a-zA-Z]+"
                ],
                isHiding: data.activityType !== ActivityType.TEXT_INPUT,
                keyString: "inputRegex"
            } as OptionsInput,
            {
                type: OptionsStructureType.INPUT,
                label: "Choices",
                isHiding: data.activityType !== ActivityType.SINGLE_CHOICE && data.activityType !== ActivityType.MULTIPLE_CHOICE,
                keyString: "choices"
            } as OptionsInput,
            {
                type: OptionsStructureType.INPUT,
                label: "Save input as",
                keyString: "variableName"
            } as OptionsInput
        ]
    } as OptionsDefinition
}

export default function ActivityNode({ id, selected, data }: NodeProps<ActivityNodeData>) {
    
    const updateNodeData = useStore((state) => state.updateNodeData)
    
    useEffect(() => {
        const optionsDefinition = getActivityOptionsDefinition(id, data)
        const updatedData = { ...data }
        optionsDefinition.structure.forEach(option => {
            if (option.keyString) {
                // @ts-ignore
                updatedData[option.keyString] = data[option.keyString] || option.defaultValue
            }
        })
        updateNodeData<ActivityNodeData>(id, updatedData)
    }, [])

    return (
        <div style={{
            ...activityShapeStyle,
            backgroundColor: data.backgroundColor,
            borderColor: selected ? selectedColor : undefined
        }} className="bg-background border-2 border-foreground" >
            <Handle style={handleStyle} type="source" position={Position.Right}/>
            <Handle style={handleStyle} type="target" position={Position.Left}/>
            <div className="flex flex-col">
                <div>{ data.task }</div>
                <div>{ data.activityType }</div>
            </div>
        </div>
    )
}

export function ActivityOptions({ nodeId, data }: { nodeId: string, data: ActivityNodeData }): React.ReactNode {

    return

    //useEffect(() => {
    //    updateNodeData<ActivityNodeData>(nodeId)
    //}, [nodeId, updateNodeData])

    /*    const [task, setTask] = useState(data.task || "")
        const [description, setDescription] = useState("") // TODO Add description to activity node
        const [activityType, setActivityType] = useState(data.activityType || ActivityType.TEXT_INPUT)
        const [choices, setChoices] = useState(data.choices || "")
        const [inputRegex, setInputRegex] = useState(data.inputRegex || "")
        const [variableName, setVariableName] = useState(data.variableName || "")
        const [gamificationType, setGamificationType] = useState(data.gamificationType || GamificationType.NONE)
        const [gamificationOptions, setGamificationOptions] = useState(data.gamificationOptions || {})
    
        useEffect(() => {
            updateNodeData<ActivityNodeData>(nodeId, {
                backgroundColor: data.backgroundColor,
                task: task,
                activityType: activityType,
                choices: choices,
                inputRegex: inputRegex,
                variableName: variableName,
                gamificationType: gamificationType,
                gamificationOptions: gamificationType === GamificationType.NONE ? {} : gamificationOptions
            })
        }, [nodeId, task, activityType, choices, inputRegex, variableName, gamificationType, gamificationOptions, updateNodeData])
    */
    /*return <OptionsContainer definition={{
        title: "Activity Options",
        state: state,
        setState: setState,
        structure: [
            {
                type: OptionsStructureType.INPUT,
                label: "Title",
                value: state.task,
                onChange: (newValue) => setOption("task", newValue)
            } as OptionsInput,
            {
                type: OptionsStructureType.TEXTAREA,
                label: "Description",
                value: state.description,
                onChange: (newValue) => setOption("description", newValue)
            } as OptionsTextarea,
            {
                type: OptionsStructureType.SEPARATOR
            } as OptionsSeparator,
            {
                type: OptionsStructureType.SELECT,
                label: "Activity type",
                value: state.activityType,
                options: Object.values(ActivityType),
                onChange: (newValue) => setOption("activityType", newValue)
            } as OptionsSelect,
            {
                type: OptionsStructureType.INPUT,
                label: "Input regex",
                value: state.inputRegex,
                onChange: (newValue) => setOption("inputRegex", newValue),
                suggestions: [
                    "[0-9]+",
                    "[a-zA-Z .,-_]+",
                    "[a-zA-Z .,-_0-9]+",
                    "[a-zA-Z]+"
                ],
                isHiding: state.activityType !== ActivityType.TEXT_INPUT
            } as OptionsInput,
            {
                type: OptionsStructureType.INPUT,
                label: "Choices",
                value: state.choices,
                onChange: (newValue) => setOption("choices", newValue),
                isHiding: state.activityType !== ActivityType.SINGLE_CHOICE && state.activityType !== ActivityType.MULTIPLE_CHOICE
            } as OptionsInput,
            {
                type: OptionsStructureType.INPUT,
                label: "Save input as",
                value: state.variableName,
                onChange: (newValue) => setOption("variableName", newValue)
            } as OptionsInput
        ]
    }} />*/

    /*return <div className="w-full flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold">Activity Options</h2>
        <div className="space-y-2">
            <Label htmlFor="task-title-input">Title</Label>
            <Input
                id="task-title-input"
                placeholder="Task title"
                value={task}
                onChange={(event) => setDescription(event.target.value)}
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="task-description-input">Description</Label>
            <Textarea
                id="task-description-input"
                placeholder="Task description"
                value={description}
                onChange={(event) => setTask(event.target.value)}
            />
        </div>
        <Separator/>
        <div className="space-y-2">
            <Label>Activity type</Label>
            <Select
                defaultValue={activityType}
                onValueChange={(newValue) => setActivityType(newValue as ActivityType)}
            >
                <SelectTrigger>
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {Object.values(ActivityType).map(type => {
                            return <SelectItem key={type} value={type}>{type}</SelectItem>
                        })}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            {
                (() => {
                    switch (activityType) {
                        case ActivityType.TEXT_INPUT:
                            return <>
                                <Label htmlFor="regex-input">Input regex</Label>
                                <Input
                                    id="regex-input"
                                    placeholder="[0-9]+"
                                    value={inputRegex}
                                    onChange={(event) => setInputRegex(event.target.value)}
                                    list={"suggestions-regex"}
                                />
                                <datalist id={"suggestions-regex"}>
                                    {
                                        [
                                            {
                                                name: "Number",
                                                value: "[0-9]+"
                                            },
                                            {
                                                name: "Text without numbers",
                                                value: "[a-zA-Z .,-_]+"
                                            },
                                            {
                                                name: "Text with numbers",
                                                value: "[a-zA-Z .,-_0-9]+"
                                            },
                                            {
                                                name: "Single word",
                                                value: "[a-zA-Z]+"
                                            }
                                        ].map(suggestion => {
                                            return <option key={suggestion.value} value={suggestion.value}>
                                                {suggestion.name}
                                            </option>
                                        })
                                    }
                                </datalist>
                            </>
                        case ActivityType.SINGLE_CHOICE:
                        case ActivityType.MULTIPLE_CHOICE:
                            return <>
                                <Label htmlFor="choices-input">Choices</Label>
                                <Input
                                    id="choices-input"
                                    placeholder="choice 1,choice 2,..."
                                    value={choices}
                                    onChange={(event) => setChoices(event.target.value)}
                                />
                            </>
                    }
                })()
            }
        </div>
        <div className="space-y-2">
            <Label htmlFor="variable-name-input">Save input as</Label>
            <Input
                id="variable-name-input"
                placeholder="input1"
                value={variableName}
                onChange={(event) => setVariableName(event.target.value)}
            />
        </div>
        <Separator/>
    </div>*/
}

export const activityShapeStyle = {
    minWidth: 50,
    minHeight: 50,
    borderRadius: 6,
}