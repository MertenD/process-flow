"use client"

import React, {useEffect} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import {handleStyle, selectedColor} from "../../../store";
import {
    OptionsDefinition,
    OptionsStructureType,
    OptionsVariableNameInput
} from "@/components/processEditor/modules/flow/toolbars/dynamicOptions/OptionsModel";
import useStore from "@/components/processEditor/store";
import {setDefaultValues} from "@/components/processEditor/modules/flow/toolbars/dynamicOptions/DynamicOptions";

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
        // TODO Ich brauche eine OptionsStructureTyoe die es ermöglicht beliebig viele Variablen zu speichern
        // Der Keystring ist dann immer outputs.[IRGENDWAS] und der Value ist der Variablenname der vom Benutzer eingegeben wird
        structure: [
            {
                type: OptionsStructureType.VARIABLE_NAME_INPUT,
                label: "Input Variable Name",
                placeholder: "Enter a variable name",
                keyString: "outputs.inputVariableName",
            } as OptionsVariableNameInput,
            {
                type: OptionsStructureType.VARIABLE_NAME_INPUT,
                label: "Another Input Variable Name",
                placeholder: "Enter a variable name",
                keyString: "outputs.inputVariableName2",
            } as OptionsVariableNameInput
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