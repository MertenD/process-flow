import React from "react"

export interface TextOptionProps {
    title: string,
    placeholder: string,
    value: string,
    suggestions?: { name: string, value: string}[],
    onValueChanged: (newValue: string) => void
}

export default function TextOption(props: TextOptionProps) {

    return (
        <span style={{
            flexWrap: "wrap",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
        }}>
            { props.title + ":" }
            <input
                id={props.title}
                key={props.title}
                style={{
                    marginLeft: 10
                }}
                type="text"
                placeholder={ props.placeholder }
                defaultValue={ props.value }
                className="nodrag"
                onChange={(event) => {
                    props.onValueChanged(event.target.value)
                }}
                list={"suggestions" + props.title}
            />
                <datalist id={"suggestions" + props.title}>
                {
                    (props.suggestions || []).map(suggestion => {
                        return <option value={suggestion.value}>
                            { suggestion.name }
                        </option>
                    })
                }
                </datalist>
        </span>
    )
}