import React from "react"

export interface TextAreaOptionProps {
    title: string,
    placeholder: string,
    value: string,
    onValueChanged: (newValue: string) => void

}

export default function TextAreaOption(props: TextAreaOptionProps) {

    return (
        <>
            <div style={{
                width: 235,
                textAlign: "left"
            }}>
                { props.title + ":" }
            </div>
            <textarea
                style={{
                    marginTop: 10,
                    resize: "none"
                }}
                placeholder={ props.placeholder }
                defaultValue={ props.value }
                className="nodrag"
                onChange={(event) => {
                    props.onValueChanged(event.target.value)
                }}
                rows={4}
                cols={30}
            />
        </>
    )
}