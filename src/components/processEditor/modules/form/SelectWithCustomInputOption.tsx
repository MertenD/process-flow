import React, {useEffect, useState} from 'react';

export const CUSTOM_INPUT_VALUE = "customInput"

export interface SelectWithCustomInputOptionProps {
    values: string[],
    selectedValue: string,
    onValueChanged: (newValue: string) => void
}

export default function SelectWithCustomInputOption(props: SelectWithCustomInputOptionProps) {

    const [customInput, setCustomInput] = useState(false);
    const [selectValue, setSelectValue] = useState(props.selectedValue)

    useEffect(() => {
        const isCustom = !props.values.includes(props.selectedValue.replaceAll("{", "").replaceAll("}", ""))
        if (isCustom) {
            setCustomInput(true)
            setSelectValue(CUSTOM_INPUT_VALUE)
        } else {
            setCustomInput(false)
            setSelectValue(props.selectedValue)
        }
    }, [props.values])

    const handleSelectChange = (event: any) => {
        if (event.target.value === CUSTOM_INPUT_VALUE) {
            props.onValueChanged("")
            setCustomInput(true);
        } else {
            setCustomInput(false)
            props.onValueChanged(event.target.value);
        }
    };

    const handleCustomInputChange = (event: any) => {
        props.onValueChanged(event.target.value)
    }

    return (
        <div style={{
            width: "100%"
        }}>
            <select
                style={{
                    width: "100%"
                }}
                value={selectValue}
                name="value"
                className="nodrag"
                onChange={handleSelectChange}
            >
                {props.values.map((value) => {
                    return <option key={value} value={"{" + value + "}"}>
                        {value}
                    </option>
                })}
                <option value={CUSTOM_INPUT_VALUE}>[custom value]</option>
            </select>
            {customInput && (
                <input
                    style={{
                        width: "94%"
                    }}
                    name="value"
                    type="text"
                    className="nodrag"
                    placeholder="Value"
                    value={props.selectedValue}
                    onChange={event => handleCustomInputChange(event)}
                />
            )}
        </div>
    );
}