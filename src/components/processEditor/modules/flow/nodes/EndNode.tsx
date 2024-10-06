import React from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import {handleStyle, selectedColor} from "../../../store";

export type EndNodeData = {
    backgroundColor?: string
}

export default function EndNode({ id, selected, data}: NodeProps<EndNodeData>) {

    return (
        <div style={{
            ...endNodeShapeStyle,
            backgroundColor: data.backgroundColor,
            borderColor: selected ? selectedColor : undefined
        }} className="bg-background border-2 border-foreground">
            <Handle style={handleStyle} type="target" position={Position.Left} />
        </div>
    )
}

export const endNodeShapeStyle = {
    width: 30,
    height: 30,
    borderRadius: "50%",
}