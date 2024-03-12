import React, {useEffect, useState} from 'react';
import {activityShapeStyle} from "../nodes/ActivityNode";
import {startNodeShapeStyle} from "../nodes/StartNode";
import {GatewayShapeStyle} from "../nodes/GatewayNode";
import {endNodeShapeStyle} from "../nodes/EndNode";
import {NodeTypes} from "../../../model/NodeTypes";
import {challengeShapeStyle} from "../nodes/ChallengeNode";
import {infoNodeShapeStyle} from "../nodes/InfoNode";
import {eventShapeStyle} from "../nodes/GamificationEventNode";
import useStore from "../../../store";

export default function NodesToolbar() {
    const onDragStart = (event: any, nodeType: String, nodeData: any) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, nodeData }));
        event.dataTransfer.effectAllowed = 'move';
    };

    const nodes = useStore((state) => state.nodes)
    const [isStartAlreadyPlaced, setIsStartAlreadyPlaced] = useState<boolean>(false)

    useEffect(() => {
        setIsStartAlreadyPlaced(nodes.filter(node => node.type === NodeTypes.START_NODE).length !== 0)
    }, [nodes])

    return (
        <aside>
            <div style={{
                borderRadius: 10,
                padding: 16,
                background: "white",
                border: "1px solid black",
                display: "flex",
                flexDirection: "column",
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                Start
                <div draggable={!isStartAlreadyPlaced}
                    style={{ ...startNodeShapeStyle, marginBottom: 10, borderColor: isStartAlreadyPlaced ? "lightgray" : undefined }}
                    onDragStart={(event) =>
                        onDragStart(event, NodeTypes.START_NODE, {})
                    }
                />
                End
                <div draggable style={{ ...endNodeShapeStyle,  marginBottom: 10 }} onDragStart={(event) =>
                    onDragStart(event, NodeTypes.END_NODE, {})
                } />
                Activity
                <div draggable style={{ ...activityShapeStyle, marginBottom: 10 }} onDragStart={(event) =>
                    onDragStart(event, NodeTypes.ACTIVITY_NODE, {})
                } />
                Gateway
                <div draggable style={{ ...GatewayShapeStyle, marginBottom: 15, marginTop: 5 }} onDragStart={(event) =>
                    onDragStart(event, NodeTypes.GATEWAY_NODE, {})
                } />
                Challenge
                <div draggable style={{ ...challengeShapeStyle, marginBottom: 10 }} onDragStart={(event) => {
                    onDragStart(event, NodeTypes.CHALLENGE_NODE, { backgroundColor: "#eeffee"})
                }} />
                Info
                <div draggable style={{ ...infoNodeShapeStyle, marginBottom: 10 }} onDragStart={(event) => {
                    onDragStart(event, NodeTypes.INFO_NODE, {})
                }} />
                Gam. Event
                <div draggable style={{ ...eventShapeStyle, marginBottom: 10}} onDragStart={(event) => {
                    onDragStart(event, NodeTypes.GAMIFICATION_EVENT_NODE, {})
                }} />
            </div>
        </aside>
    );
};