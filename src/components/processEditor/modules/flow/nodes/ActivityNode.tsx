import React, {useEffect} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import useStore, {handleStyle, selectedColor} from "../../../store";
import {GamificationType} from "@/model/GamificationType";
import {ActivityType} from "@/model/ActivityType";
import {
    OptionsCheckbox,
    OptionsDefinition,
    OptionsInput,
    OptionsRow,
    OptionsSelect,
    OptionsSelectWithCustom,
    OptionsSeparator,
    OptionsStructureSpecialValues,
    OptionsStructureType,
    OptionsTextarea,
    OptionsVariableNameInput
} from "@/components/processEditor/modules/flow/toolbars/dynamicOptions/OptionsModel";
import {setDefaultValues} from "@/components/processEditor/modules/flow/toolbars/dynamicOptions/DynamicOptions";
import {PointsType} from "@/model/PointsType";
import {BadgeType} from "@/model/BadgeType";
import {Comparisons} from "@/model/Comparisons";
import {PointsApplicationMethod} from "@/model/PointsApplicationMethod";

export type ActivityNodeData = {
    backgroundColor?: string,
    task?: string,
    description?: string,
    activityType?: ActivityType
    choices?: string,
    inputRegex?: string,
    infoText?: string,
    variableName?: string,
    gamificationType? : GamificationType
    gamificationOptions?: {
        pointType?: PointsType,
        pointsApplicationMethod?: PointsType,
        pointsForSuccess?: string,
        hasCondition?: boolean
        value1?: string,
        comparison?: Comparisons,
        value2?: string,
        badgeType?: BadgeType,
    }
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
                keyString: "task"
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
                            } as OptionsInput,
                            {
                                type: OptionsStructureType.VARIABLE_NAME_INPUT,
                                label: "Save input as",
                                placeholder: "input1",
                                keyString: "variableName"
                            } as OptionsVariableNameInput
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
                            } as OptionsInput,
                            {
                                type: OptionsStructureType.VARIABLE_NAME_INPUT,
                                label: "Save input as",
                                placeholder: "input1",
                                keyString: "variableName"
                            } as OptionsVariableNameInput
                        ]
                    },
                    {
                        values: [ActivityType.INFO],
                        dependentStructure: [
                            {
                                type: OptionsStructureType.TEXTAREA,
                                label: "Info text",
                                placeholder: "This is an info text",
                                keyString: "infoText"
                            }
                        ]
                    }
                ]
            } as OptionsSelect,
            {
                type: OptionsStructureType.SEPARATOR
            } as OptionsSeparator,
            {
                type: OptionsStructureType.SELECT,
                label: "Gamification type",
                defaultValue: GamificationType.NONE,
                keyString: "gamificationType",
                options: [
                    {
                        values: [GamificationType.NONE],
                        dependentStructure: []
                    },
                    {
                        values: [GamificationType.POINTS],
                        dependentStructure: [
                            {
                                type: OptionsStructureType.SELECT,
                                label: "Points type",
                                defaultValue: PointsType.EXPERIENCE,
                                keyString: "gamificationOptions.pointType",
                                options: [
                                    { values: Object.values(PointsType) }
                                ]
                            } as OptionsSelect,
                            {
                                type: OptionsStructureType.ROW,
                                structure: [
                                    {
                                        type: OptionsStructureType.SELECT,
                                        label: "Effect",
                                        defaultValue: PointsApplicationMethod.INCREMENT_BY,
                                        keyString: "gamificationOptions.pointsApplicationMethod",
                                        options: [
                                            { values: Object.values(PointsApplicationMethod) }
                                        ]
                                    } as OptionsSelect,
                                    {
                                        type: OptionsStructureType.INPUT,
                                        label: "Amount",
                                        placeholder: "20",
                                        keyString: "gamificationOptions.pointsForSuccess"
                                    } as OptionsInput
                                ]
                            } as OptionsRow,
                            {
                                type: OptionsStructureType.SEPARATOR
                            } as OptionsSeparator,
                            {
                                type: OptionsStructureType.CHECKBOX,
                                defaultValue: false,
                                label: "Gamification condition",
                                keyString: "gamificationOptions.hasCondition",
                                options: [
                                    {
                                        values: [true],
                                        dependentStructure: [
                                            {
                                                type: OptionsStructureType.SELECT_WITH_CUSTOM,
                                                label: "Value 1",
                                                keyString: "gamificationOptions.value1",
                                                options: [ { values: [ OptionsStructureSpecialValues.AVAILABLE_VARIABLES ] } ]
                                            } as OptionsSelectWithCustom,
                                            {
                                                type: OptionsStructureType.SELECT,
                                                label: "Comparison",
                                                keyString: "gamificationOptions.comparison",
                                                defaultValue: Comparisons.EQUALS,
                                                options: [ { values: Object.values(Comparisons) } ]
                                            } as OptionsSelect,
                                            {
                                                type: OptionsStructureType.SELECT_WITH_CUSTOM,
                                                label: "Value 2",
                                                keyString: "gamificationOptions.value2",
                                                options: [ { values: [ OptionsStructureSpecialValues.AVAILABLE_VARIABLES ] } ]
                                            } as OptionsSelectWithCustom
                                        ]
                                    }
                                ]
                            } as OptionsCheckbox,
                        ]
                    },
                    {
                        values: [GamificationType.BADGES],
                        dependentStructure: [
                            {
                                type: OptionsStructureType.INPUT,
                                label: "Badge type",
                                keyString: "gamificationOptions.badgeType",
                                suggestions: Object.values(BadgeType),
                            } as OptionsInput
                        ]
                    }
                ]
            } as OptionsSelect,
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