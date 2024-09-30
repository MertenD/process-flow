"use client"

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { endNodeShapeStyle } from "../nodes/EndNode"
import { activityShapeStyle } from "../nodes/ActivityNode"
import { GatewayShapeStyle } from "../nodes/GatewayNode"
import { NodeTypes } from "@/model/NodeTypes"

export interface OnCanvasNodesToolbarProps {
    open: boolean
    position: { x: number; y: number }
    onClose: (nodeType: NodeTypes | null) => void
}

export default function OnCanvasNodesToolbar(props: OnCanvasNodesToolbarProps) {
    const { onClose, open, position } = props
    const width = 240
    const height = 350

    const [windowWidth, setWindowWidth] = useState(0)
    const [windowHeight, setWindowHeight] = useState(0)

    useEffect(() => {
        const updateWindowDimensions = () => {
            setWindowWidth(window.innerWidth)
            setWindowHeight(window.innerHeight)
        }

        updateWindowDimensions()
        window.addEventListener('resize', updateWindowDimensions)

        return () => window.removeEventListener('resize', updateWindowDimensions)
    }, [])

    const handleClose = () => {
        onClose(null)
    }

    const handleNodeSelected = (nodeType: NodeTypes) => {
        onClose(nodeType)
    }

    const NodeItem = ({ label, style, nodeType }: { label: string, style: any, nodeType: NodeTypes }) => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full mb-4 p-0 h-auto hover:bg-secondary"
                        onClick={() => handleNodeSelected(nodeType)}
                    >
                        <div className="flex flex-col items-center py-3">
                            <span className="text-sm mb-2">{label}</span>
                            <div style={{ ...style }} className="border-2 border-primary" />
                        </div>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Add {label} node</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent
                className="p-0 shadow-lg"
                style={{
                    position: "fixed",
                    margin: 0,
                    left: Math.max(Math.min(position.x, windowWidth - width), width),
                    top: Math.max(Math.min(position.y, windowHeight - height), height),
                    width: width,
                    maxWidth: 'none',
                }}
            >
                <DialogHeader className="p-4 pb-2">
                    <DialogTitle>Select Node</DialogTitle>
                </DialogHeader>
                <div className="p-4 bg-background flex flex-col items-stretch justify-center">
                    <NodeItem
                        label="End"
                        style={endNodeShapeStyle}
                        nodeType={NodeTypes.END_NODE}
                    />
                    <NodeItem
                        label="Activity"
                        style={activityShapeStyle}
                        nodeType={NodeTypes.ACTIVITY_NODE}
                    />
                    <NodeItem
                        label="Gateway"
                        style={GatewayShapeStyle}
                        nodeType={NodeTypes.GATEWAY_NODE}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}