import React from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import {handleStyle, selectedColor} from "../../../store";

export type StartNodeData = {
    backgroundColor?: string
}

export default function StartNode({ id, selected, data}: NodeProps<StartNodeData>) {

    return (
        <div style={{
            ...startNodeShapeStyle,
            backgroundColor: data.backgroundColor,
            borderColor: selected ? selectedColor : undefined
        }} className="bg-background border-2 border-foreground">
            <Handle style={handleStyle} type="source" position={Position.Right} />
        </div>
    )
}

export const startNodeShapeStyle = {
    width: 30,
    height: 30,
    borderRadius: "50%",
}