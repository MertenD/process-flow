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
import {Input} from "@/components/ui/input";
import DynamicIcon from "@/components/DynamicIcon";
import type {NodeDefinitionPreview} from "@/model/NodeDefinition";
import {Flag, Merge, Plus, Split} from "lucide-react";
import {AndSplitShapeStyle} from "@/components/processEditor/nodes/AndSplitNode";
import {AndJoinShapeStyle} from "@/components/processEditor/nodes/AndJoinNode";

export interface OnCanvasNodesToolbarProps {
    open: boolean
    position: { x: number; y: number }
    onClose: (nodeType: NodeTypes | null, nodeData?: any) => void
    nodeDefinitionPreviews: NodeDefinitionPreview[]
}

export default function OnCanvasNodesToolbar(props: OnCanvasNodesToolbarProps) {
    const { onClose, open, position } = props
    const width = 240
    const height = 350
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [filteredActivities, setFilteredActivities] = useState<NodeDefinitionPreview[]>(props.nodeDefinitionPreviews)

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

    useEffect(() => {
        setFilteredActivities(
            props.nodeDefinitionPreviews.filter((activity) => activity.name.toLowerCase().includes(searchTerm.toLowerCase())),
        )
    }, [searchTerm, props.nodeDefinitionPreviews])

    const handleClose = () => {
        onClose(null)
    }

    const handleNodeSelected = (nodeType: NodeTypes, nodeData?: any) => {
        onClose(nodeType, nodeData)
    }

    const NodeItem = (
        { label, style, nodeType, icon, nodeData }: { label: string, style: any, icon?: React.ReactNode, nodeType: NodeTypes, nodeData?: any }
    ) => (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full h-full p-0 hover:bg-secondary"
                        onClick={() => handleNodeSelected(nodeType, nodeData)}
                    >
                        <div
                            style={{ ...style }}
                            className="flex my-3 justify-center items-center border-2 border-primary cursor-move"
                        >
                            { icon }
                        </div>
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-primary">
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
                <div className="p-4 bg-background flex flex-col space-y-4 items-stretch justify-center">
                    <NodeItem
                        label="End"
                        style={endNodeShapeStyle}
                        icon={<Flag className="w-4 h-4 stroke-primary"/>}
                        nodeType={NodeTypes.END_NODE}
                    />
                    <NodeItem
                        label="Gateway"
                        style={GatewayShapeStyle}
                        icon={<Plus className="w-4 h-4 stroke-primary" />}
                        nodeType={NodeTypes.GATEWAY_NODE}
                    />
                    <NodeItem
                        label={"AND Split"}
                        icon={<Split name="and-split" className="stroke-primary" />}
                        style={AndSplitShapeStyle}
                        nodeType={NodeTypes.AND_SPLIT_NODE}
                    />
                    <NodeItem
                        label={"AND Join"}
                        icon={<Merge name="and-join" className="stroke-primary" />}
                        style={AndJoinShapeStyle}
                        nodeType={NodeTypes.AND_JOIN_NODE}
                    />
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Activities</h3>
                        <Input
                            type="text"
                            placeholder="Search activities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-4"
                        />
                        <div className="max-h-60 overflow-y-auto">
                            <div className="flex flex-row gap-x-4 gap-y-4 flex-wrap">
                                {[...filteredActivities].map((nodeDefinitionPreview) => (
                                    <NodeItem
                                        key={`Activity-Node-${nodeDefinitionPreview.id}`}
                                        label={nodeDefinitionPreview.name}
                                        icon={<DynamicIcon name={nodeDefinitionPreview.icon}
                                                           className="stroke-primary"/>}
                                        style={activityShapeStyle}
                                        nodeType={NodeTypes.ACTIVITY_NODE}
                                        nodeData={{
                                            nodeDefinitionId: nodeDefinitionPreview.id,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}