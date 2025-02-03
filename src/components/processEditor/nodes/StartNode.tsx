"use client"

import React, {useEffect} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import {handleStyle, selectedColor} from "@/stores/store";
import {
    OptionsDefinition,
    OptionsMultipleVariableNameInput,
    OptionsStructureType,
    OptionsVariableNameInput
} from "@/model/OptionsModel";
import useStore from "@/stores/store";
import {setDefaultValues} from "@/components/processEditor/toolbars/dynamicOptions/DynamicOptions";

export type StartNodeData = {
    backgroundColor?: string,
    outputs?: {
        [key: string]: string
    }
}

export function getStartOptionsDefinition(nodeId: string): OptionsDefinition {
    return {
        title: "Start Options",
        nodeId: nodeId,
        structure: [
            {
                type: OptionsStructureType.MULTIPLE_VARIABLE_NAME_INPUT,
                label: "Input Variable Names",
                placeholder: "Enter a variable name",
                keyString: "outputs.inputVariableNames",
            } as OptionsMultipleVariableNameInput
        ]
    }
}

export default function StartNode({ id, selected, data}: NodeProps<StartNodeData>) {

    const updateNodeData = useStore((state) => state.updateNodeData)

    useEffect(() => {
        const optionsDefinition = getStartOptionsDefinition(id)
        const updatedData = { ...data }
        setDefaultValues(optionsDefinition.structure, updatedData)
        updateNodeData<StartNodeData>(id, updatedData)
    }, []);

    return (
        <div style={{
            ...startNodeShapeStyle,
            backgroundColor: data.backgroundColor
        }} className={`bg-background border-2 border-foreground ${ selected ? "border-primary" : "" }`}>
            <Handle style={handleStyle} type="source" position={Position.Right} />
        </div>
    )
}

export const startNodeShapeStyle = {
    width: 37,
    height: 37,
    borderRadius: "50%",
}