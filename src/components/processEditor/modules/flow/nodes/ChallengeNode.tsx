import React, {memo, useEffect, useState} from 'react';
import {NodeProps} from 'reactflow';
import {NodeResizer, ResizeDragEvent, ResizeEventParams} from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import useStore, {selectedColor} from "../../../store";
import OptionsContainer from "../../form/OptionsContainer";
import DropdownOption from "../../form/DropdownOption";
import {ChallengeType} from "../../../model/ChallengeType";
import {GamificationType} from "../../../model/GamificationType";
import GamificationOptions from "../../gamification/GamificationOptions";
import {PointsGamificationOptionsData} from "../../gamification/PointsGamificationOptions";
import {BadgeGamificationOptionsData} from "../../gamification/BadgeGamificationOptions";
import NumberOption from "../../form/NumberOption";

export type ChallengeNodeData = {
    width?: number,
    height?: number,
    backgroundColor?: string
    isResizing?: boolean
    challengeType?: ChallengeType
    secondsToComplete?: number
    rewardType?: GamificationType
    gamificationOptions?: PointsGamificationOptionsData | BadgeGamificationOptionsData
}

export default memo(function ChallengeNode({ id, selected, data }: NodeProps<ChallengeNodeData>) {

    const minWidth = 360, minHeight = 200
    const defaultWidth = 600, defaultHeight = 400

    const getChildren = useStore((state) => state.getChildren)
    const updateNodeParent = useStore((state) => state.updateNodeParent)
    const updateNodeData = useStore((state) => state.updateNodeData)
    const getNodeById = useStore((state) => state.getNodeById)
    const [isResizing, setIsResizing] = useState(false)
    const [backgroundColor, setBackgroundColor] = useState(data.backgroundColor || "#eeffee")
    const [width, setWidth] = useState(data.width || defaultWidth)
    const [height, setHeight] = useState(data.height || defaultHeight)
    const [challengeType, setChallengeType] = useState(data.challengeType || ChallengeType.TIME_CHALLENGE)
    const [secondsToComplete, setSecondsToComplete] = useState(data.secondsToComplete || 30)
    const [rewardType, setRewardType] = useState(data.rewardType || GamificationType.NONE)
    const [gamificationOptions, setGamificationOptions] = useState( data.gamificationOptions || {})

    useEffect(() => {
        updateNodeData<ChallengeNodeData>(id, {
            width: width,
            height: height,
            backgroundColor: backgroundColor,
            isResizing: isResizing,
            challengeType: challengeType,
            secondsToComplete: secondsToComplete,
            rewardType: rewardType,
            gamificationOptions: gamificationOptions
        })
    }, [width, height, backgroundColor, isResizing, challengeType, secondsToComplete, rewardType, gamificationOptions])

    const onResizeStart = () => {
        setIsResizing(true)
        const childrenNodes = getChildren(id)
        childrenNodes.map((node) => {
            updateNodeParent(node, undefined, getNodeById(id) || undefined)
        })
    }

    const onResize = (event: ResizeDragEvent, params: ResizeEventParams) => {
        setWidth(params.width)
        setHeight(params.height)
    }

    const onResizeEnd = () => {
        setIsResizing(false)
    }

    return (
        <>
            <NodeResizer
                nodeId={id}
                isVisible={selected}
                minWidth={minWidth}
                minHeight={minHeight}
                onResizeStart={onResizeStart}
                onResize={onResize}
                onResizeEnd={onResizeEnd}
                lineStyle={{
                    borderColor: selectedColor,
                    borderWidth: 2
                }}
                handleStyle={{
                    backgroundColor: selectedColor,
                    borderColor: selectedColor,
                    width: 15,
                    height: 15
                }}
            />
            <div style={{ ...challengeShapeStyle, width: width, height: height, backgroundColor: backgroundColor + "99" }} >
                <OptionsContainer outline={true}>
                    <DropdownOption
                        title={ "Challenge type" }
                        values={ Object.values(ChallengeType) }
                        selectedValue={ challengeType }
                        onValueChanged={ newValue => setChallengeType(newValue as ChallengeType) }
                    />
                    {
                        (() => {
                            switch (challengeType) {
                                case ChallengeType.TIME_CHALLENGE:
                                    return (
                                        <NumberOption
                                            title={ "Time in seconds" }
                                            placeholder={ "Seconds" }
                                            value={ secondsToComplete }
                                            onValueChanged={ newValue => setSecondsToComplete(newValue) }
                                        />
                                    )
                            }
                        })()
                    }
                    <DropdownOption
                        title={ "Reward type" }
                        values={ Object.values(GamificationType) }
                        selectedValue={ rewardType }
                        onValueChanged={ newValue => setRewardType(newValue as GamificationType) }
                    />
                    <GamificationOptions
                        parentNodeId={ id }
                        gamificationType={ rewardType }
                        gamificationOptions={ gamificationOptions }
                        onChange={ gamificationOptions => setGamificationOptions(gamificationOptions) }
                        withoutOptionalCondition={false}
                    />
                </OptionsContainer>
            </div>
        </>
    )
})

export const challengeShapeStyle = {
    minWidth: 50,
    minHeight: 50,
    borderRadius: 6,
    backgroundColor: "rgba(200,255,200,0.25)",
    border: "3px solid black",
}