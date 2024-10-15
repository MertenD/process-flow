import React, {useEffect, useState} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import useStore, {handleStyle, selectedColor} from "@/stores/store";
import {Comparisons} from "@/model/Comparisons";
import {
    OptionsDefinition,
    OptionsSelect,
    OptionsSelectWithCustom,
    OptionsStructureSpecialValues,
    OptionsStructureType
} from "@/model/OptionsModel";
import {setDefaultValues} from "@/components/processEditor/toolbars/dynamicOptions/DynamicOptions";
import {ActivityNodeData} from "@/components/processEditor/nodes/ActivityNode";
import {X} from "lucide-react";

export type GatewayNodeData = {
    backgroundColor?: string
    value1?: string,
    comparison?: Comparisons,
    value2?: string
}

export function getGatewayOptionsDefinition(nodeId: string): OptionsDefinition {
    return {
        title: "Gateway Options",
        nodeId: nodeId,
        structure: [
            {
                type: OptionsStructureType.SELECT_WITH_CUSTOM,
                label: "Value 1",
                keyString: "value1",
                options: [ { values:  [OptionsStructureSpecialValues.AVAILABLE_VARIABLES] } ]
            } as OptionsSelectWithCustom,
            {
                type: OptionsStructureType.SELECT,
                label: "Comparison",
                keyString: "comparison",
                defaultValue: Comparisons.EQUALS,
                options: [ { values: Object.values(Comparisons) } ]
            } as OptionsSelect,
            {
                type: OptionsStructureType.SELECT_WITH_CUSTOM,
                label: "Value 2",
                keyString: "value2",
                options: [ { values:  [OptionsStructureSpecialValues.AVAILABLE_VARIABLES] } ]
            } as OptionsSelectWithCustom
        ]
    }
}

export default function GatewayNode({ id, selected, data }: NodeProps<GatewayNodeData>) {

    const updateNodeData = useStore((state) => state.updateNodeData);

    useEffect(() => {
        const optionsDefinition = getGatewayOptionsDefinition(id);
        const updatedData = { ...data };
        setDefaultValues(optionsDefinition.structure, updatedData);
        updateNodeData<ActivityNodeData>(id, updatedData);
    }, [])

    return (
        <div style={{ backgroundColor: "transparent", position: "relative" }}>
            <span style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                position: "fixed",
                left: 45
            }} >
                <span className="w-max ">
                    { data.value1 && data.value2 && data.comparison && data.value1 + " " + data.comparison + " " + data.value2 }
                </span>
            </span>
            <div
                style={{
                    width: 70,
                    position: 'fixed',
                    top: -35,
                    left: 20
                }}
            >
                { "True" }
            </div>
            <div
                style={{
                    width: 70,
                    position: 'fixed',
                    bottom: -35,
                    left: 25
                }}
            >
                { "False" }
            </div>
            <div style={{
                ...GatewayShapeStyle,
                backgroundColor: data.backgroundColor,
                borderColor: selected ? selectedColor : undefined
            }} className="bg-background border-2 border-foreground" >
                <X style={{ transform: "rotate(-45deg)" }} className="pt-1" />
            </div>
            <Handle style={handleStyle} type="target" position={Position.Left} id="a"/>
            <Handle style={handleStyle} type="source" position={Position.Top} id="True"/>
            <Handle style={handleStyle} type="source" position={Position.Bottom} id="False"/>
        </div>
    )
}

export const GatewayShapeStyle = {
    width: 30,
    height: 30,
    transform: "rotateY(0deg) rotate(45deg)",
    borderRadius: 6,
}