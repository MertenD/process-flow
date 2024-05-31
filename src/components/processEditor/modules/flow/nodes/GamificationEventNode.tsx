import {Handle, NodeProps, Position} from "reactflow";
import useStore, {handleStyle, selectedColor} from "../../../store";
import React, {useEffect} from "react";
import {GamificationType} from "@/model/GamificationType";
import {PointsGamificationOptionsData} from "../../gamification/PointsGamificationOptions";
import {BadgeGamificationOptionsData} from "../../gamification/BadgeGamificationOptions";
import {
    OptionsCheckbox,
    OptionsDefinition,
    OptionsInput,
    OptionsRow,
    OptionsSelect,
    OptionsSelectWithCustom,
    OptionsSeparator,
    OptionsStructureSpecialValues,
    OptionsStructureType
} from "@/components/processEditor/modules/flow/toolbars/dynamicOptions/OptionsModel";
import {Comparisons} from "@/model/Comparisons";
import {PointsType} from "@/model/PointsType";
import {PointsApplicationMethod} from "@/model/PointsApplicationMethod";
import {BadgeType} from "@/model/BadgeType";
import {setDefaultValues} from "@/components/processEditor/modules/flow/toolbars/dynamicOptions/DynamicOptions";

export type GamificationEventNodeData = {
    backgroundColor?: string
    gamificationType? : GamificationType
    gamificationOptions?: PointsGamificationOptionsData | BadgeGamificationOptionsData
}

export function getGamificationEventOptionsDefinition(nodeId: string): OptionsDefinition {
    return {
        title: "Gamification Event Options",
        nodeId: nodeId,
        structure: [
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
            } as OptionsSelect
        ]
    }
}

export default function GamificationEventNode({ id, selected, data}: NodeProps<GamificationEventNodeData>) {

    const updateNodeData = useStore((state) => state.updateNodeData)

    useEffect(() => {
        const optionsDefinition = getGamificationEventOptionsDefinition(id);
        const updatedData = { ...data };
        setDefaultValues(optionsDefinition.structure, updatedData);
        updateNodeData<GamificationEventNodeData>(id, updatedData);
    }, [])

    return (
        <div style={{
            ...eventShapeStyle,
            backgroundColor: data.backgroundColor,
            borderColor: selected ? selectedColor : undefined
        }} className="bg-background border-2 border-foreground" >
            { data.gamificationType }
            <Handle style={handleStyle} type="source" position={Position.Right}/>
            <Handle style={handleStyle} type="target" position={Position.Left}/>
        </div>
    )
}

export const eventShapeStyle = {
    minWidth: 50,
    minHeight: 50,
    borderRadius: 6,
    borderStyle: "double",
    borderWidth: 5
}