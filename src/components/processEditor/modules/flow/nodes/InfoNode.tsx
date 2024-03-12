import React, {useEffect, useState} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import useStore, {handleStyle, selectedColor} from "../../../store";
import OptionsContainer from "../../form/OptionsContainer";
import TextAreaOption from "../../form/TextAreaOption";

export type InfoNodeData = {
    backgroundColor?: string
    infoText?: string
}

export default function InfoNode({ id, selected, data}: NodeProps<InfoNodeData>) {

    const updateNodeData = useStore((state) => state.updateNodeData)
    const [infoText, setInfoText] = useState(data.infoText || "")

    useEffect(() => {
        updateNodeData<InfoNodeData>(id, {
            backgroundColor: data.backgroundColor,
            infoText: infoText
        })
    }, [data.backgroundColor, infoText])

    return (
        <div style={{
            ...infoNodeShapeStyle,
            backgroundColor: data.backgroundColor || infoNodeShapeStyle.backgroundColor,
            borderColor: selected ? selectedColor : undefined
        }}>
            <Handle style={handleStyle} type="source" position={Position.Right}/>
            <Handle style={handleStyle} type="target" position={Position.Left}/>
            <OptionsContainer width={250}>
                <TextAreaOption
                    title={ "Show an info text to the user" }
                    placeholder={ "Text" }
                    value={ infoText }
                    onValueChanged={ newValue => setInfoText(newValue) }
                />
            </OptionsContainer>
        </div>
    )
}

export const infoNodeShapeStyle = {
    minWidth: 50,
    minHeight: 50,
    borderRadius: 6,
    backgroundColor: "white",
    border: "3px solid black",
}