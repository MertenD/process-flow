import React, {useEffect} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import useStore, {handleStyle, selectedColor} from "@/stores/store";
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
} from "@/model/OptionsModel";
import {setDefaultValues} from "@/components/processEditor/toolbars/dynamicOptions/DynamicOptions";
import {PointsType} from "@/model/PointsType";
import {BadgeType} from "@/model/BadgeType";
import {Comparisons} from "@/model/Comparisons";
import {PointsApplicationMethod} from "@/model/PointsApplicationMethod";
import {NodeDefinition} from "@/model/NodeDefinition";
import getNodeDefinition from "@/actions/shop/get-node-definition";

export type ActivityNodeData = {
    backgroundColor?: string,
    task?: string,
    description?: string,
    activityType?: ActivityType
    choices?: string,
    inputRegex?: string,
    infoText?: string,
    assignedRole?: string,
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
    outputs?: {
        [key: string]: string
    }
}

export default function ActivityNode({ id, selected, data }: NodeProps<ActivityNodeData>) {
    
    const updateNodeData = useStore((state) => state.updateNodeData)
    
    useEffect(() => {
        // TODO Replace with actual node definition id from database which this activity should represent
        getNodeDefinition(1).then((nodeDefinition: NodeDefinition) => {
            const updatedData = { ...data };
            setDefaultValues(nodeDefinition.optionsDefinition.structure, updatedData);
            updateNodeData<ActivityNodeData>(id, updatedData);
        })
    }, [])

    return (
        <div style={{
            ...activityShapeStyle,
            backgroundColor: data.backgroundColor,
            borderColor: selected ? selectedColor : undefined
        }} className="bg-background border-2 border-foreground" >
            <Handle style={handleStyle} type="source" position={Position.Right}/>
            <Handle style={handleStyle} type="target" position={Position.Left}/>
            <div className="flex flex-col p-2 items-center">
                <div>{ data.task || "-" }</div>
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