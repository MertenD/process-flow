import React from "react"

export interface OptionsContainerProps {
    width?: number
    outline?: boolean
    children: React.ReactNode
}

export default function OptionsContainer(props: OptionsContainerProps) {

    return (
        <div style={{
            width: props.width || 300,
            border: props.outline ? "1px solid black": undefined,
            borderRadius: props.outline ? 10 : undefined,
            margin: props.outline ? 10 : undefined,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: "wrap"
        }}>
            { props.children }
        </div>
    )
}