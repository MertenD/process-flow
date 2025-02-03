import React from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import {handleStyle} from "@/stores/store";
import {GamificationType} from "@/model/GamificationType";
import {ActivityType} from "@/model/ActivityType";
import {PointsType} from "@/model/PointsType";
import {BadgeType} from "@/model/BadgeType";
import {Comparisons} from "@/model/Comparisons";

export type ActivityNodeData = {
    backgroundColor?: string,
    nodeDefinitionId?: number,
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

    return (
        <div style={{
            ...activityShapeStyle,
            backgroundColor: data.backgroundColor
        }} className={`bg-background border-2 border-foreground ${ selected ? "border-primary" : "" }`} >
            <Handle style={handleStyle} type="source" position={Position.Right}/>
            <Handle style={handleStyle} type="target" position={Position.Left}/>
            <div className="flex flex-col p-2 items-center">
                <div>{ data.task || "-" }</div>
            </div>
        </div>
    )
}

export const activityShapeStyle = {
    minWidth: 50,
    minHeight: 50,
    borderRadius: 6,
}