import React, {useEffect, useState} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import useStore, {handleStyle, selectedColor} from "../../../store";
import {GamificationType} from "../../../model/GamificationType";
import {PointsGamificationOptionsData} from "../../gamification/PointsGamificationOptions";
import {ActivityType} from "../../../model/ActivityType";
import {BadgeGamificationOptionsData} from "../../gamification/BadgeGamificationOptions";
import DropdownOption from "../../form/DropdownOption";
import TextOption from "../../form/TextOption";
import OptionsContainer from "../../form/OptionsContainer";
import TitleOption from "../../form/TitleOption";
import GamificationOptions from "../../gamification/GamificationOptions";

export type ActivityNodeData = {
    backgroundColor?: string,
    task?: string,
    activityType?: ActivityType
    choices?: string,
    inputRegex?: string,
    variableName?: string,
    gamificationType? : GamificationType
    gamificationOptions?: PointsGamificationOptionsData | BadgeGamificationOptionsData
}

export default function ActivityNode({ id, selected, data }: NodeProps<ActivityNodeData>) {

    const updateNodeData = useStore((state) => state.updateNodeData)
    const [task, setTask] = useState(data.task || "")
    const [activityType, setActivityType] = useState(data.activityType || ActivityType.TEXT_INPUT)
    const [choices, setChoices] = useState(data.choices || "")
    const [inputRegex, setInputRegex] = useState(data.inputRegex || "")
    const [variableName, setVariableName] = useState(data.variableName || "")
    const [gamificationType, setGamificationType] = useState(data.gamificationType || GamificationType.NONE)
    const [gamificationOptions, setGamificationOptions] = useState(data.gamificationOptions || {})

    useEffect(() => {
        updateNodeData<ActivityNodeData>(id, {
            backgroundColor: data.backgroundColor,
            task: task,
            activityType: activityType,
            choices: choices,
            inputRegex: inputRegex,
            variableName: variableName,
            gamificationType: gamificationType,
            gamificationOptions: gamificationType === GamificationType.NONE ? {} : gamificationOptions
        })
    }, [id, task, activityType, choices, inputRegex, variableName, gamificationType, gamificationOptions, updateNodeData])

    return (
        <div style={{
            ...activityShapeStyle,
            backgroundColor: data.backgroundColor || activityShapeStyle.backgroundColor,
            borderColor: selected ? selectedColor : undefined
        }}>
            <Handle style={handleStyle} type="source" position={Position.Right}/>
            <Handle style={handleStyle} type="target" position={Position.Left}/>
            <OptionsContainer>
                <TitleOption
                    placeholder={ "Task title" }
                    value={ task }
                    onValueChanged={ newValue => setTask(newValue) }
                />
                <hr style={{ width: "100%" }}/>
                <DropdownOption
                    title={ "Activity type" }
                    values={ Object.values(ActivityType) }
                    selectedValue={ activityType }
                    onValueChanged={ newValue => setActivityType(newValue as ActivityType) }
                />
                {
                    (() => {
                        switch (activityType) {
                            case ActivityType.TEXT_INPUT:
                                return (
                                    <TextOption
                                        title={ "Input regex" }
                                        placeholder={ "e.g.: [0-9]+" }
                                        value={ inputRegex }
                                        suggestions={[
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
                                        ]}
                                        onValueChanged={ newValue => setInputRegex(newValue) }
                                    />
                                )
                            case ActivityType.SINGLE_CHOICE:
                            case ActivityType.MULTIPLE_CHOICE:
                                return (
                                    <TextOption
                                        title={ "Choices" }
                                        placeholder={ "choice 1,choice 2,..."}
                                        value={ choices }
                                        onValueChanged={ newValue => setChoices(newValue) }
                                    />
                                )
                        }
                    })()
                }
                <TextOption
                    title={ "Save input as" }
                    placeholder={ "Variable name" }
                    value={ variableName }
                    onValueChanged={ newValue => setVariableName(newValue) }
                />
                <hr style={{ width: "100%" }}/>
                <DropdownOption
                    title={ "Gamification type" }
                    values={ Object.values(GamificationType) }
                    selectedValue={ gamificationType }
                    onValueChanged={ newValue => setGamificationType(newValue as GamificationType) }
                />
                <GamificationOptions
                    parentNodeId={ id }
                    gamificationType={ gamificationType }
                    parentVariableName={ variableName }
                    gamificationOptions={ gamificationOptions }
                    onChange={ gamificationOptions => setGamificationOptions(gamificationOptions) }
                />
            </OptionsContainer>
        </div>
    )
}

export const activityShapeStyle = {
    minWidth: 50,
    minHeight: 50,
    borderRadius: 6,
    backgroundColor: "white",
    border: "3px solid black"
}