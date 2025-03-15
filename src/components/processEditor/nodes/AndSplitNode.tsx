import React, {useEffect} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import useStore, {handleStyle} from "@/stores/store";
import {OptionsDefinition, OptionsStructureType, OptionsText} from "@/model/OptionsModel";
import {setDefaultValues} from "@/components/processEditor/toolbars/dynamicOptions/DynamicOptions";
import {ActivityNodeData} from "@/components/processEditor/nodes/ActivityNode";
import {X} from "lucide-react";

export type AndSplitNodeData = {
    backgroundColor?: string
}

export function getAndSplitOptions(nodeId: string): OptionsDefinition {
    return {
        title: "And Split Options",
        nodeId: nodeId,
        structure: [
            {
                type: OptionsStructureType.TEXT,
                text: "This node will split the flow into two paths that will both be executed."
            } as OptionsText
        ]
    }
}

export default function AndSplitNode({ id, selected, data }: NodeProps<AndSplitNodeData>) {

    const updateNodeData = useStore((state) => state.updateNodeData);

    useEffect(() => {
        const optionsDefinition = getAndSplitOptions(id);
        const updatedData = { ...data };
        setDefaultValues(optionsDefinition.structure, updatedData);
        updateNodeData<AndSplitNodeData>(id, updatedData);
    }, [])

    return (
        <div style={{ backgroundColor: "transparent", position: "relative" }}>
            <div style={{
                ...AndSplitShapeStyle,
                backgroundColor: data.backgroundColor,
                boxShadow: selected ? `0px 0px 5px 1px #14803c` : undefined
            }} className={`flex justify-center items-center bg-background border-2 border-foreground ${ selected ? "border-primary" : "" }`} >
                <X className="w-6 h-6" />
            </div>
            <Handle style={handleStyle} type="target" position={Position.Left} id="a"/>
            <Handle style={handleStyle} type="source" position={Position.Top} id="b"/>
            <Handle style={handleStyle} type="source" position={Position.Bottom} id="c"/>
        </div>
    )
}

export const AndSplitShapeStyle = {
    width: 37,
    height: 37,
    transform: "rotateY(0deg) rotate(45deg)",
    borderRadius: 6,
}