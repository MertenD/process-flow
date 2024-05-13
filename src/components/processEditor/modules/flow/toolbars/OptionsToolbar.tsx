"use client"

import React, {useEffect, useState} from "react";
import {Node, useOnSelectionChange} from "reactflow";
import {Input} from "@/components/ui/input";
import {ActivityNodeData} from "@/components/processEditor/modules/flow/nodes/ActivityNode";
import {NodeTypes} from "@/model/NodeTypes";
import useStore from "@/components/processEditor/store";
import {ActivityType} from "@/model/ActivityType";
import {GamificationType} from "@/model/GamificationType";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";

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
            options = <ActivityOptions nodeId={selectedNode.id} data={selectedNode.data as ActivityNodeData}/>
            break;
    }

    return <aside className={`p-3 border-l`}>
        { options }
    </aside>
}

function ActivityOptions({ nodeId, data }: { nodeId: string, data: ActivityNodeData }): React.ReactNode {

    const updateNodeData = useStore((state) => state.updateNodeData)
    const [task, setTask] = useState(data.task || "")
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

    return <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold">Activity Options</h2>
        <div className="space-y-2">
            <Label htmlFor="task-title-input">Title</Label>
            <Input
                id="task-title-input"
                placeholder="Task title"
                value={task}
                onChange={(event) => setTask(event.target.value)}
            />
        </div>
        <Separator />
        <div className="space-y-2">
            <Label>Activity type</Label>
            <Select
                defaultValue={activityType}
                onValueChange={(newValue) => setActivityType(newValue as ActivityType)}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        { Object.values(ActivityType).map(type => {
                            return <SelectItem key={type} value={type}>{ type }</SelectItem>
                        }) }
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
        <Separator />
    </div>
}

