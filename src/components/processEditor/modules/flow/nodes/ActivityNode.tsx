import React, {useEffect} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import useStore, {handleStyle, selectedColor} from "../../../store";
import {GamificationType} from "@/model/GamificationType";
import {PointsGamificationOptionsData} from "../../gamification/PointsGamificationOptions";
import {ActivityType} from "@/model/ActivityType";
import {BadgeGamificationOptionsData} from "../../gamification/BadgeGamificationOptions";
import {
    OptionsDefinition,
    OptionsInput,
    OptionsSelect,
    OptionsSeparator,
    OptionsStructureType,
    OptionsTextarea,
    setDefaultValues
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

export function getActivityOptionsDefinition(nodeId: string): OptionsDefinition {
    return {
        title: "Activity Options",
        nodeId: nodeId,
        structure: [
            {
                type: OptionsStructureType.INPUT,
                label: "Title",
                placeholder: "Activity title",
            } as OptionsInput,
            {
                type: OptionsStructureType.TEXTAREA,
                label: "Description",
                placeholder: "Activity description",
                keyString: "description"
            } as OptionsTextarea,
            {
                type: OptionsStructureType.SEPARATOR,
            } as OptionsSeparator,
            {
                type: OptionsStructureType.SELECT,
                label: "Activity type",
                defaultValue: ActivityType.TEXT_INPUT,
                keyString: "activityType",
                options: [
                    {
                        values: [ActivityType.TEXT_INPUT],
                        dependentStructure: [
                            {
                                type: OptionsStructureType.INPUT,
                                label: "Input regex",
                                placeholder: "[0-9]+",
                                suggestions: [
                                    "[0-9]+",
                                    "[a-zA-Z .,-_]+",
                                    "[a-zA-Z .,-_0-9]+",
                                    "[a-zA-Z]+"
                                ],
                                keyString: "inputRegex"
                            } as OptionsInput
                        ]
                    },
                    {
                        values: [ActivityType.SINGLE_CHOICE, ActivityType.MULTIPLE_CHOICE],
                        dependentStructure: [
                            {
                                type: OptionsStructureType.INPUT,
                                label: "Choices",
                                placeholder: "choice 1,choice 2,...",
                                keyString: "choices"
                            } as OptionsInput
                        ]
                    }
                ]
            } as OptionsSelect,
            {
                type: OptionsStructureType.INPUT,
                label: "Save input as",
                placeholder: "input1",
                keyString: "variableName"
            } as OptionsInput
        ]
    } as OptionsDefinition
}

export default function ActivityNode({ id, selected, data }: NodeProps<ActivityNodeData>) {
    
    const updateNodeData = useStore((state) => state.updateNodeData)
    
    useEffect(() => {
        const optionsDefinition = getActivityOptionsDefinition(id);
        const updatedData = { ...data };
        setDefaultValues(optionsDefinition.structure, updatedData);
        updateNodeData<ActivityNodeData>(id, updatedData);
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

export const activityShapeStyle = {
    minWidth: 50,
    minHeight: 50,
    borderRadius: 6,
}