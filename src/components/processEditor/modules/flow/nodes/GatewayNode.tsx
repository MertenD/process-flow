import React, {useEffect, useState} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import useStore, {handleStyle, selectedColor} from "../../../store";
import {Comparisons} from "@/model/Comparisons";
import {
    OptionsDefinition,
    OptionsSelect,
    OptionsSelectWithCustom,
    OptionsStructureSpecialValues,
    OptionsStructureType
} from "@/components/processEditor/modules/flow/toolbars/dynamicOptions/OptionsModel";
import {setDefaultValues} from "@/components/processEditor/modules/flow/toolbars/dynamicOptions/DynamicOptions";
import {ActivityNodeData} from "@/components/processEditor/modules/flow/nodes/ActivityNode";

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
        <div style={{ backgroundColor: "transparent", position: "relative" }} >
            {/*<ConditionOption
                variables={ availableVariableNames }
                value1={ value1 }
                onValue1Changed={newValue => setValue1(newValue) }
                selectedComparison={ comparison }
                onComparisonChanged={newComparison => setComparison(newComparison) }
                value2={ value2 }
                onValue2Changed={newValue => setValue2(newValue) }
                conditionOptionsSpanStyle={{
                    position: 'fixed',
                    right: -310,
                    top: -5
                }}
            /> */}
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
                <hr style={{ backgroundColor: "black", border: "1px solid black", width: "70%", marginTop: 14 }}/>
                <hr style={{ backgroundColor: "black", border: "1px solid black", width: "70%", marginTop: -10, transform: "rotateY(0deg) rotate(90deg)" }}/>
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