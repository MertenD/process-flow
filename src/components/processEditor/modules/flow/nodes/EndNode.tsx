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
            backgroundColor: data.backgroundColor || endNodeShapeStyle.backgroundColor,
            borderColor: selected ? selectedColor : undefined
        }} >
            <Handle style={handleStyle} type="target" position={Position.Left} />
        </div>
    )
}

export const endNodeShapeStyle = {
    width: 30,
    height: 30,
    backgroundColor: "white",
    borderRadius: "50%",
    border: "6px solid black"
}