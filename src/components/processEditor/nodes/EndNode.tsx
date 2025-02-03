import React from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import {handleStyle, selectedColor} from "@/stores/store";

export type EndNodeData = {
    backgroundColor?: string
}

export default function EndNode({ id, selected, data}: NodeProps<EndNodeData>) {

    return (
        <div style={{
            ...endNodeShapeStyle,
            backgroundColor: data.backgroundColor
        }} className={`bg-background border-2 border-foreground ${ selected ? "border-primary" : "" }`}>
            <Handle style={{...handleStyle }} type="target" position={Position.Left} />
        </div>
    )
}

export const endNodeShapeStyle = {
    width: 37,
    height: 37,
    borderRadius: "50%",
}