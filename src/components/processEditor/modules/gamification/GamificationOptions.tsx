import React from "react"
import {GamificationType} from "../../model/GamificationType";
import PointsGamificationOptions, {PointsGamificationOptionsData} from "./PointsGamificationOptions";
import BadgeGamificationOptions, {BadgeGamificationOptionsData} from "./BadgeGamificationOptions";

export interface GamificationTypeOptionsProps {
    parentNodeId: string
    gamificationType: GamificationType
    parentVariableName?: string
    gamificationOptions: PointsGamificationOptionsData | BadgeGamificationOptionsData
    onChange: (gamificationOptions: PointsGamificationOptionsData | BadgeGamificationOptionsData) => void
    withoutOptionalCondition?: boolean
}

export default function GamificationOptions(props: GamificationTypeOptionsProps) {

    return (
        <>
            {
                (() => {
                    switch (props.gamificationType) {
                        case (GamificationType.POINTS):
                            return <PointsGamificationOptions
                                parentNodeId={props.parentNodeId}
                                parentVariableName={props.parentVariableName || ""}
                                gamificationOptions={props.gamificationOptions as PointsGamificationOptionsData}
                                onChange={(gamificationOptions: PointsGamificationOptionsData) => {
                                    props.onChange(gamificationOptions)
                                }}
                                withoutOptionalCondition={props.withoutOptionalCondition || false}
                            />
                        case GamificationType.BADGES:
                            return <BadgeGamificationOptions
                                parentNodeId={props.parentNodeId}
                                parentVariableName={props.parentVariableName || ""}
                                gamificationOptions={props.gamificationOptions as BadgeGamificationOptionsData}
                                onChange={(gamificationOptions: BadgeGamificationOptionsData) => {
                                    props.onChange(gamificationOptions)
                                }}
                                withoutOptionalCondition={props.withoutOptionalCondition || false}
                            />
                    }
                })()
            }
        </>
    )
}