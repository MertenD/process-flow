import {Handle, NodeProps, Position} from "reactflow";
import useStore, {handleStyle, selectedColor} from "../../../store";
import {activityShapeStyle} from "./ActivityNode";
import React, {useEffect, useState} from "react";
import OptionsContainer from "../../form/OptionsContainer";
import DropdownOption from "../../form/DropdownOption";
import {GamificationType} from "../../../model/GamificationType";
import GamificationOptions from "../../gamification/GamificationOptions";
import {PointsGamificationOptionsData} from "../../gamification/PointsGamificationOptions";
import {BadgeGamificationOptionsData} from "../../gamification/BadgeGamificationOptions";

export type GamificationEventNodeData = {
    backgroundColor?: string
    gamificationType? : GamificationType
    gamificationOptions?: PointsGamificationOptionsData | BadgeGamificationOptionsData
}

export default function GamificationEventNode({ id, selected, data}: NodeProps<GamificationEventNodeData>) {

    const updateNodeData = useStore((state) => state.updateNodeData)
    const [gamificationType, setGamificationType] = useState(data.gamificationType || GamificationType.NONE)
    const [gamificationOptions, setGamificationOptions] = useState(data.gamificationOptions || {})

    useEffect(() => {
        updateNodeData<GamificationEventNodeData>(id, {
            backgroundColor: data.backgroundColor,
            gamificationType: gamificationType,
            gamificationOptions: gamificationType === GamificationType.NONE ? {} : gamificationOptions
        })
    }, [id, gamificationType, gamificationOptions, updateNodeData])

    return (
        <div style={{
            ...eventShapeStyle,
            backgroundColor: data.backgroundColor || activityShapeStyle.backgroundColor,
            borderColor: selected ? selectedColor : undefined
        }}>
            <Handle style={handleStyle} type="source" position={Position.Right}/>
            <Handle style={handleStyle} type="target" position={Position.Left}/>
            <OptionsContainer>
                <DropdownOption
                    title={ "Gamification type" }
                    values={ Object.values(GamificationType) }
                    selectedValue={ gamificationType }
                    onValueChanged={ newValue => setGamificationType(newValue as GamificationType) }
                />
                <GamificationOptions
                    parentNodeId={ id }
                    gamificationType={ gamificationType }
                    gamificationOptions={ gamificationOptions }
                    onChange={ gamificationOptions => setGamificationOptions(gamificationOptions) }
                />
            </OptionsContainer>
        </div>
    )
}

export const eventShapeStyle = {
    minWidth: 50,
    minHeight: 50,
    borderRadius: 6,
    backgroundColor: "white",
    border: "3px solid black",
    borderStyle: "double",
    borderWidth: 5
}