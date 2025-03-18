import React, {useEffect} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import useStore, {handleStyle} from "@/stores/store";
import {OptionsDefinition, OptionsStructureType, OptionsText} from "@/model/OptionsModel";
import {setDefaultValues} from "@/components/processEditor/toolbars/dynamicOptions/DynamicOptions";
import {X} from "lucide-react";

export type AndJoinNodeData = {
    backgroundColor?: string
}

export function getAndJoinOptions(nodeId: string): OptionsDefinition {
    return {
        title: "And Join Options",
        nodeId: nodeId,
        structure: [
            {
                type: OptionsStructureType.TEXT,
                text: "This node will join the flow into two paths into one."
            } as OptionsText
        ]
    }
}

export default function AndJoinNode({ id, selected, data }: NodeProps<AndJoinNodeData>) {

    const updateNodeData = useStore((state) => state.updateNodeData);

    useEffect(() => {
        const optionsDefinition = getAndJoinOptions(id);
        const updatedData = { ...data };
        setDefaultValues(optionsDefinition.structure, updatedData);
        updateNodeData<AndJoinNodeData>(id, updatedData);
    }, [])

    return (
        <div style={{ backgroundColor: "transparent", position: "relative" }}>
            <div style={{
                ...AndJoinShapeStyle,
                backgroundColor: data.backgroundColor,
                boxShadow: selected ? `0px 0px 5px 1px #14803c` : undefined
            }} className={`flex justify-center items-center bg-card border-2 border-foreground ${ selected ? "border-primary" : "" }`} >
                <X className="w-6 h-6" />
            </div>
            <Handle style={handleStyle} type="source" position={Position.Right} id="a"/>
            <Handle style={handleStyle} type="target" position={Position.Top} id="1"/>
            <Handle style={handleStyle} type="target" position={Position.Bottom} id="2"/>
        </div>
    )
}

export const AndJoinShapeStyle = {
    width: 37,
    height: 37,
    transform: "rotateY(0deg) rotate(45deg)",
    borderRadius: 6,
}