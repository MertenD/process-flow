import React, {useEffect, useState} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import useStore, {handleStyle, selectedColor} from "../../../store";
import {Comparisons} from "../../../model/Comparisons";
import ConditionOption from "../../form/ConditionOption";

export type GatewayNodeData = {
    backgroundColor?: string
    value1?: string,
    comparison?: Comparisons,
    value2?: string
}

export default function GatewayNode({ id, selected, data }: NodeProps<GatewayNodeData>) {

    const nodes = useStore((state) => state.nodes)
    const edges = useStore((state) => state.edges)
    const getAvailableVariableNames = useStore((state) => state.getAvailableVariableNames)
    const updateNodeData = useStore((state) => state.updateNodeData);
    const [availableVariableNames, setAvailableVariableNames] = useState<string[]>([])
    const [value1, setValue1] = useState(data.value1 || "{" + getAvailableVariableNames(id)[0] + "}");
    const [comparison, setComparison] = useState(data.comparison || Comparisons.EQUALS);
    const [value2, setValue2] = useState(data.value2 || "{" + getAvailableVariableNames(id)[0] + "}");

    useEffect(() => {
        setAvailableVariableNames(getAvailableVariableNames(id))
    }, [id, nodes, edges])

    useEffect(() => {
        updateNodeData<GatewayNodeData>(id, {
            backgroundColor: data.backgroundColor,
            value1: value1,
            comparison: comparison,
            value2: value2
        })
    }, [id, value1, comparison, value2, updateNodeData])

    return (
        <div style={{ backgroundColor: "transparent", position: "relative" }}>
            <ConditionOption
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
            />
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
                backgroundColor: data.backgroundColor || GatewayShapeStyle.backgroundColor,
                borderColor: selected ? selectedColor : undefined
            }} >
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
    backgroundColor: "white",
    border: "3px solid black",
}