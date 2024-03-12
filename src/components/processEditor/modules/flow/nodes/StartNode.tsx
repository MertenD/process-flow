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
            backgroundColor: data.backgroundColor || startNodeShapeStyle.backgroundColor,
            borderColor: selected ? selectedColor : undefined
        }}>
            <Handle style={handleStyle} type="source" position={Position.Right} />
        </div>
    )
}

export const startNodeShapeStyle = {
    width: 30,
    height: 30,
    backgroundColor: "white",
    borderRadius: "50%",
    border: "3px solid black"
}