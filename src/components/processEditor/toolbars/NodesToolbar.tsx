"use client"

import React, {useEffect, useState} from 'react'
import {Card, CardContent} from "@/components/ui/card"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {activityShapeStyle} from "../nodes/ActivityNode"
import {startNodeShapeStyle} from "../nodes/StartNode"
import {GatewayShapeStyle} from "../nodes/GatewayNode"
import {endNodeShapeStyle} from "../nodes/EndNode"
import {NodeTypes} from "@/model/NodeTypes"
import useStore from "@/stores/store"
import {NodeDefinitionPreview} from "@/model/NodeDefinition";

interface NodesToolbarProps {
    nodeDefinitionPreviews: NodeDefinitionPreview[]
}

export default function NodesToolbar({ nodeDefinitionPreviews }: Readonly<NodesToolbarProps>) {
    const onDragStart = (event: React.DragEvent, nodeType: string, nodeData: any) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, nodeData }))
        event.dataTransfer.effectAllowed = 'move'
    }

    const nodes = useStore((state) => state.nodes)
    const [isStartAlreadyPlaced, setIsStartAlreadyPlaced] = useState<boolean>(false)

    useEffect(() => {
        setIsStartAlreadyPlaced(nodes.filter(node => node.type === NodeTypes.START_NODE).length !== 0)
    }, [nodes])

    const NodeItem = ({ label, style, nodeType, nodeData = {}, disabled = false, isMarginBottomDisabled = false }: {
        label: string,
        style: any,
        nodeType: string,
        nodeData?: any,
        disabled?: boolean,
        isMarginBottomDisabled?: boolean
    }) => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={`flex flex-col items-center ${isMarginBottomDisabled ? "" : "mb-4"}`}>
                        <div
                            draggable={!disabled}
                            style={{ ...style, opacity: disabled ? 0.5 : 1 }}
                            className="border-2 border-primary cursor-move"
                            onDragStart={(event) => !disabled && onDragStart(event, nodeType, nodeData)}
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{disabled ? `Already placed ${label}` : `${label}`}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )

    return (
        <Card className="w-20">
            <CardContent className="p-4">
                <NodeItem
                    label="Start"
                    style={startNodeShapeStyle}
                    nodeType={NodeTypes.START_NODE}
                    disabled={isStartAlreadyPlaced}
                />
                <NodeItem
                    label="End"
                    style={endNodeShapeStyle}
                    nodeType={NodeTypes.END_NODE}
                />
                { nodeDefinitionPreviews.map((nodeDefinitionPreview) => (
                    <NodeItem
                        key={`Activity-Node-${nodeDefinitionPreview.id}`}
                        label={nodeDefinitionPreview.name}
                        style={activityShapeStyle}
                        nodeType={NodeTypes.ACTIVITY_NODE}
                        nodeData={{
                            nodeDefinitionId: nodeDefinitionPreview.id,
                        }}
                    />
                )) }
                <NodeItem
                    label="Gateway"
                    style={GatewayShapeStyle}
                    nodeType={NodeTypes.GATEWAY_NODE}
                />
            </CardContent>
        </Card>
    )
}