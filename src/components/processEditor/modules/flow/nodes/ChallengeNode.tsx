import React, {memo, useEffect, useState} from 'react';
import {NodeProps} from 'reactflow';
import {NodeResizer, ResizeDragEvent, ResizeParams} from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import useStore, {selectedColor} from "../../../store";
import {ChallengeType} from "@/model/ChallengeType";
import {GamificationType} from "@/model/GamificationType";
import {PointsGamificationOptionsData} from "../../gamification/PointsGamificationOptions";
import {BadgeGamificationOptionsData} from "../../gamification/BadgeGamificationOptions";
import {
    OptionsCheckbox,
    OptionsDefinition,
    OptionsInput,
    OptionsRow,
    OptionsSelect,
    OptionsSelectWithCustom,
    OptionsSeparator,
    OptionsStructureSpecialValues,
    OptionsStructureType
} from "@/components/processEditor/modules/flow/toolbars/dynamicOptions/OptionsModel";
import {PointsType} from "@/model/PointsType";
import {PointsApplicationMethod} from "@/model/PointsApplicationMethod";
import {Comparisons} from "@/model/Comparisons";
import {BadgeType} from "@/model/BadgeType";
import {setDefaultValues} from "@/components/processEditor/modules/flow/toolbars/dynamicOptions/DynamicOptions";

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

export function getChallengeOptionsDefinition(nodeId: string): OptionsDefinition {
    return {
        title: "Challenge Options",
        nodeId: nodeId,
        structure: [
            {
                type: OptionsStructureType.SELECT,
                label: "Challenge type",
                defaultValue: ChallengeType.TIME_CHALLENGE,
                keyString: "challengeType",
                options: [
                    {
                        values: [ ChallengeType.TIME_CHALLENGE ],
                        dependentStructure: [
                            {
                                type: OptionsStructureType.INPUT,
                                label: "Time in seconds",
                                placeholder: "Seconds",
                                keyString: "secondsToComplete"
                            } as OptionsInput
                        ]
                    }
                ]
            } as OptionsSelect,
            {
                type: OptionsStructureType.SEPARATOR
            } as OptionsSeparator,
            {
                type: OptionsStructureType.SELECT,
                label: "Reward type",
                defaultValue: GamificationType.NONE,
                keyString: "rewardType",
                options: [
                    {
                        values: [GamificationType.NONE],
                        dependentStructure: []
                    },
                    {
                        values: [GamificationType.POINTS],
                        dependentStructure: [
                            {
                                type: OptionsStructureType.SELECT,
                                label: "Points type",
                                defaultValue: PointsType.EXPERIENCE,
                                keyString: "gamificationOptions.pointType",
                                options: [
                                    { values: Object.values(PointsType) }
                                ]
                            } as OptionsSelect,
                            {
                                type: OptionsStructureType.ROW,
                                structure: [
                                    {
                                        type: OptionsStructureType.SELECT,
                                        label: "Effect",
                                        defaultValue: PointsApplicationMethod.INCREMENT_BY,
                                        keyString: "gamificationOptions.pointsApplicationMethod",
                                        options: [
                                            { values: Object.values(PointsApplicationMethod) }
                                        ]
                                    } as OptionsSelect,
                                    {
                                        type: OptionsStructureType.INPUT,
                                        label: "Amount",
                                        placeholder: "20",
                                        keyString: "gamificationOptions.pointsForSuccess"
                                    } as OptionsInput
                                ]
                            } as OptionsRow,
                            {
                                type: OptionsStructureType.SEPARATOR
                            } as OptionsSeparator,
                            {
                                type: OptionsStructureType.CHECKBOX,
                                defaultValue: false,
                                label: "Gamification condition",
                                keyString: "gamificationOptions.hasCondition",
                                options: [
                                    {
                                        values: [true],
                                        dependentStructure: [
                                            {
                                                type: OptionsStructureType.SELECT_WITH_CUSTOM,
                                                label: "Value 1",
                                                keyString: "gamificationOptions.value1",
                                                options: [ { values: [ OptionsStructureSpecialValues.AVAILABLE_VARIABLES ] } ]
                                            } as OptionsSelectWithCustom,
                                            {
                                                type: OptionsStructureType.SELECT,
                                                label: "Comparison",
                                                keyString: "gamificationOptions.comparison",
                                                defaultValue: Comparisons.EQUALS,
                                                options: [ { values: Object.values(Comparisons) } ]
                                            } as OptionsSelect,
                                            {
                                                type: OptionsStructureType.SELECT_WITH_CUSTOM,
                                                label: "Value 2",
                                                keyString: "gamificationOptions.value2",
                                                options: [ { values: [ OptionsStructureSpecialValues.AVAILABLE_VARIABLES ] } ]
                                            } as OptionsSelectWithCustom
                                        ]
                                    }
                                ]
                            } as OptionsCheckbox,
                        ]
                    },
                    {
                        values: [GamificationType.BADGES],
                        dependentStructure: [
                            {
                                type: OptionsStructureType.INPUT,
                                label: "Badge type",
                                keyString: "gamificationOptions.badgeType",
                                suggestions: Object.values(BadgeType),
                            } as OptionsInput
                        ]
                    }
                ]
            } as OptionsSelect
        ]
    }
}

export default memo(function ChallengeNode({ id, selected, data }: NodeProps<ChallengeNodeData>) {

    const minWidth = 360, minHeight = 200
    const defaultWidth = 600, defaultHeight = 400

    const getChildren = useStore((state) => state.getChildren)
    const updateNodeParent = useStore((state) => state.updateNodeParent)
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

    const updateNodeData = useStore((state) => state.updateNodeData)

    useEffect(() => {
        const optionsDefinition = getChallengeOptionsDefinition(id);
        const updatedData = { ...data };
        setDefaultValues(optionsDefinition.structure, updatedData);
        updateNodeData<ChallengeNodeData>(id, updatedData);
    }, [])

    const onResizeStart = () => {
        setIsResizing(true)
        const childrenNodes = getChildren(id)
        childrenNodes.map((node) => {
            updateNodeParent(node, undefined, getNodeById(id) || undefined)
        })
    }

    const onResize = (event: ResizeDragEvent, params: ResizeParams) => {
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
            <div style={{ ...challengeShapeStyle, width: width, height: height, backgroundColor: backgroundColor + "99" }} className="border-2 border-foreground" >
                <div className="flex flex-col border-2 w-min p-2 rounded-md m-2 border-black">
                    <span style={{ whiteSpace: 'nowrap' }}>{ data.challengeType }</span>
                    <span style={{ whiteSpace: 'nowrap' }}>{ data.rewardType }</span>
                </div>
            </div>
        </>
    )
})

export const challengeShapeStyle = {
    minWidth: 50,
    minHeight: 50,
    borderRadius: 6,
    backgroundColor: "rgba(200,255,200,0.25)",
}