"use client"

import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {endNodeShapeStyle} from "../nodes/EndNode";
import {activityShapeStyle} from "../nodes/ActivityNode";
import {GatewayShapeStyle} from "../nodes/GatewayNode";
import {NodeTypes} from "../../../model/NodeTypes";
import {challengeShapeStyle} from "../nodes/ChallengeNode";
import {infoNodeShapeStyle} from "../nodes/InfoNode";
import {eventShapeStyle} from "../nodes/GamificationEventNode";
import { useEffect, useState } from 'react';

export interface OnCanvasNodesToolbarProps {
    open: boolean;
    position: {x: number, y: number}
    onClose: (nodeType: NodeTypes | null) => void;
}

export default function OnCanvasNodesToolbar(props: OnCanvasNodesToolbarProps) {
    const { onClose, open, position } = props;
    // Change width and height when adding new elements to toolbar
    const width = 160
    const height = 500

    const [windowWidth, setWindowWidth] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleClose = () => {
        onClose(null)
    }

    const handleNodeSelected = (nodeType: NodeTypes) => {
        onClose(nodeType);
    };

    return (
        <Dialog PaperProps={{
            sx: {
                position: "fixed",
                m: 0,
                left: Math.min(position.x, windowWidth - width - 16),
                top: Math.min(position.y, windowHeight - height - 16)
            }
        }} onClose={handleClose} open={open}>
            <DialogTitle>Select Node</DialogTitle>
            <div style={{
                paddingBottom: 16,
                background: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                End
                <div style={{ ...endNodeShapeStyle,  marginBottom: 10 }} onClick={() => {
                    handleNodeSelected(NodeTypes.END_NODE)
                }}/>
                Activity
                <div style={{ ...activityShapeStyle, marginBottom: 10 }} onClick={() => {
                    handleNodeSelected(NodeTypes.ACTIVITY_NODE)
                }}/>
                Gateway
                <div style={{ ...GatewayShapeStyle, marginBottom: 15, marginTop: 5 }} onClick={() => {
                    handleNodeSelected(NodeTypes.GATEWAY_NODE)
                }} />
                Info
                <div style={{ ...infoNodeShapeStyle, marginBottom: 15 }} onClick={() => {
                    handleNodeSelected(NodeTypes.INFO_NODE)
                }} />
                Gam. Event
                <div style={{ ...eventShapeStyle, marginBottom: 15}} onClick={() => {
                    handleNodeSelected(NodeTypes.GAMIFICATION_EVENT_NODE)
                }} />
            </div>
        </Dialog>
    );
}