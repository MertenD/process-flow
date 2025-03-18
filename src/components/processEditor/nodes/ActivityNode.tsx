"use client"

import React, {useEffect} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import {handleStyle} from "@/stores/store";
import {GamificationType} from "@/model/GamificationType";
import {ActivityType} from "@/model/ActivityType";
import {PointsType} from "@/model/PointsType";
import {BadgeType} from "@/model/BadgeType";
import {Comparisons} from "@/model/Comparisons";
import {NodeDefinition} from "@/model/NodeDefinition";
import getNodeDefinition from "@/actions/shop/get-node-definition";
import DynamicIcon from "@/components/DynamicIcon";

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

    const [nodeDefinition, setNodeDefinition] = React.useState<NodeDefinition | null>(null)

    useEffect(() => {
        if (data.nodeDefinitionId) {
            getNodeDefinition(data.nodeDefinitionId).then((nodeDefinition) => {
                setNodeDefinition(nodeDefinition)
            })
        }
    }, [data]);

    return (
        <div style={{
            ...activityShapeStyle,
            backgroundColor: data.backgroundColor,
            boxShadow: selected ? `0px 0px 5px 1px #14803c` : undefined
        }} className={`flex flex-row gap-x-2 p-2 items-center bg-card border-2 border-foreground ${ selected ? "border-primary" : "" }`} >
            <Handle style={handleStyle} type="source" position={Position.Right}/>
            <Handle style={handleStyle} type="target" position={Position.Left}/>
            <DynamicIcon name={nodeDefinition?.icon} className={`${selected ? "text-primary" : ""}`} />
            <p className={`${selected ? "text-primary" : ""}`}>{ data.task || "-" }</p>
        </div>
    )
}

export const activityShapeStyle = {
    minWidth: 50,
    minHeight: 50,
    borderRadius: 6,
}