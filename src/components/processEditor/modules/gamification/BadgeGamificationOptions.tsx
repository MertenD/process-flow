import React, {useEffect, useState} from "react"
import {BadgeType} from "../../model/BadgeType";
import useStore from "../../store";
import OptionalConditionOption from "../form/OptionalConditionOption";
import {Comparisons} from "../../model/Comparisons";
import SelectWithCustomInputOption from "../form/SelectWithCustomInputOption";

export type BadgeGamificationOptionsData = {
    badgeType?: string,
    hasCondition?: boolean
    value1?: string,
    comparison?: Comparisons,
    value2?: string
}

interface BadgeGamificationOptionsProps {
    parentNodeId: string,
    parentVariableName: string,
    gamificationOptions: BadgeGamificationOptionsData
    onChange: (gamificationOptions: BadgeGamificationOptionsData) => void
    withoutOptionalCondition?: boolean
}

export default function BadgeGamificationOptions(props: BadgeGamificationOptionsProps) {

    const nodes = useStore((state) => state.nodes)
    const edges = useStore((state) => state.edges)
    const getAvailableVariableNames = useStore((state) => state.getAvailableVariableNames)
    const [availableVariableNames, setAvailableVariableNames] = useState<string[]>([])
    const [badgeType, setBadgeType] = useState(props.gamificationOptions.badgeType || BadgeType.EXPLORER_BADGE)
    const [hasCondition, setHasCondition] = useState<boolean>(props.gamificationOptions.hasCondition || false)
    const [value1, setValue1] = useState(props.gamificationOptions.value1 || "{" + getAvailableVariableNames(props.parentNodeId,  props.parentVariableName)[0] + "}");
    const [comparison, setComparison] = useState(props.gamificationOptions.comparison || Comparisons.EQUALS);
    const [value2, setValue2] = useState(props.gamificationOptions.value2 || "{" + getAvailableVariableNames(props.parentNodeId,  props.parentVariableName)[0] + "}");

    useEffect(() => {
        setAvailableVariableNames(getAvailableVariableNames(props.parentNodeId, props.parentVariableName))
    }, [props.parentNodeId, props.parentVariableName, nodes, edges])

    useEffect(() => {
        props.onChange({
            badgeType: badgeType,
            hasCondition: hasCondition,
            value1: value1,
            comparison: comparison,
            value2: value2
        })
    }, [badgeType, hasCondition, value1, comparison, value2])

    return (
        <>
            <span style={{
                flexWrap: "wrap",
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10
            }}>
                <div style={{
                    flex: 1,
                    textAlign: "start"
                }}>
                    Badge Type:
                </div>
                <div style={{
                    flex: 1
                }}>
                    <SelectWithCustomInputOption
                        values={ Object.values(BadgeType) }
                        selectedValue={ badgeType.valueOf() }
                        onValueChanged={ newValue => setBadgeType(newValue) }
                    />
                </div>
            </span>
            { (props.withoutOptionalCondition === undefined || !props.withoutOptionalCondition) && <OptionalConditionOption
                hasCondition={hasCondition}
                setHasCondition={ newValue => setHasCondition(newValue) }
                variables={availableVariableNames}
                value1={value1}
                onValue1Changed={newValue => setValue1(newValue) }
                selectedComparison={ comparison }
                onComparisonChanges={ newComparison => setComparison(newComparison) }
                value2={ value2 }
                onValue2Changed={newValue => setValue2(newValue) }
            /> }
        </>
    )
}