import React from "react"
import {Comparisons} from "../../model/Comparisons";
import ConditionOption from "./ConditionOption";

export interface OptionalConditionOptionsProps {
    hasCondition: boolean
    setHasCondition: (newValue: boolean) => void
    variables: string[]
    value1: string
    onValue1Changed: (newVariable: string) => void
    selectedComparison: Comparisons
    onComparisonChanges: (newComparison: Comparisons) => void
    value2: string
    onValue2Changed: (newValueToCompare: string) => void
    conditionOptionsSpanStyle?: any
}

export default function OptionalConditionOption(props: OptionalConditionOptionsProps) {

    return (
        <>
            <div style={{ width: "100%", textAlign: "left", marginBottom: 5}}>
                Under condition (optional):
                <input
                    style={{
                        marginLeft: 10
                    }}
                    type="checkbox"
                    defaultChecked={props.hasCondition}
                    onChange={() => props.setHasCondition(!props.hasCondition)}
                />
            </div>
            { props.hasCondition && (
                <ConditionOption
                    variables={ props.variables }
                    value1={ props.value1 }
                    onValue1Changed={newVariable => props.onValue1Changed(newVariable) }
                    selectedComparison={ props.selectedComparison }
                    onComparisonChanged={newComparison => props.onComparisonChanges(newComparison) }
                    value2={ props.value2 }
                    onValue2Changed={newValueToCompare => props.onValue2Changed(newValueToCompare) }
                    conditionOptionsSpanStyle={ props.conditionOptionsSpanStyle }
                />
            )}
        </>
    )
}