import React from "react"

export interface TitleOptionProps {
    placeholder: string
    value: string
    onValueChanged: (newValue: string) => void
}

export default function TitleOption(props: TitleOptionProps) {

    return (
        <input
            style={{ width: "100%", marginBottom: 10 }}
            type="text"
            placeholder={ props.placeholder }
            defaultValue={ props.value }
            className="nodrag"
            onChange={(event) => {
                props.onValueChanged(event.target.value)
            }}
        />
    )
}