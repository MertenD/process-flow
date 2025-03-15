"use client"

import type React from "react"
import {useEffect, useState} from "react"
import {Card, CardContent} from "@/components/ui/card"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {Input} from "@/components/ui/input"
import {activityShapeStyle} from "../nodes/ActivityNode"
import {startNodeShapeStyle} from "../nodes/StartNode"
import {GatewayShapeStyle} from "../nodes/GatewayNode"
import {endNodeShapeStyle} from "../nodes/EndNode"
import {NodeTypes} from "@/model/NodeTypes"
import useStore from "@/stores/store"
import type {NodeDefinitionPreview} from "@/model/NodeDefinition"
import DynamicIcon from "@/components/DynamicIcon";
import {Flag, Merge, Play, Plus, Split, X} from "lucide-react";
import {AndSplitShapeStyle} from "@/components/processEditor/nodes/AndSplitNode";
import {AndJoinShapeStyle} from "@/components/processEditor/nodes/AndJoinNode";

interface NodesToolbarProps {
    nodeDefinitionPreviews: NodeDefinitionPreview[]
}

export default function NodesToolbar({nodeDefinitionPreviews}: Readonly<NodesToolbarProps>) {
    const nodes = useStore((state) => state.nodes)
    const [isStartAlreadyPlaced, setIsStartAlreadyPlaced] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [filteredActivities, setFilteredActivities] = useState<NodeDefinitionPreview[]>(nodeDefinitionPreviews)

    useEffect(() => {
        setIsStartAlreadyPlaced(nodes.filter((node) => node.type === NodeTypes.START_NODE).length !== 0)
    }, [nodes])

    useEffect(() => {
        setFilteredActivities(
            nodeDefinitionPreviews.filter((activity) => activity.name.toLowerCase().includes(searchTerm.toLowerCase())),
        )
    }, [searchTerm, nodeDefinitionPreviews])

    const onDragStart = (event: React.DragEvent, nodeType: string, nodeData: any) => {
        event.dataTransfer.setData("application/reactflow", JSON.stringify({nodeType, nodeData}))
        event.dataTransfer.effectAllowed = "move"
    }

    const NodeItem = ({ label, icon, style, nodeType, nodeData = {}, disabled = false,}: {
        label?: string
        icon?: React.ReactNode
        style: any
        nodeType: string
        nodeData?: any
        disabled?: boolean
    }) => (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                        <div
                            draggable={!disabled}
                            style={{...style, opacity: disabled ? 0.5 : 1}}
                            className="flex justify-center items-center border-2 border-primary cursor-move"
                            onDragStart={(event) => !disabled && onDragStart(event, nodeType, nodeData)}
                        >
                            { icon }
                        </div>
                </TooltipTrigger>
                <TooltipContent className="bg-primary">
                    <p>{disabled ? `Already placed ${label}` : `${label}`}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )

    return (
        <Card className="max-w-[220px]">
            <CardContent className="p-4">
                <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-4">Start/End</h3>
                    <div className="flex flex-row gap-x-4 gap-y-4 flex-wrap">
                        <NodeItem
                            label="Start"
                            icon={<Play className="w-4 h-4 stroke-primary"/>}
                            style={startNodeShapeStyle}
                            nodeType={NodeTypes.START_NODE}
                            disabled={isStartAlreadyPlaced}
                        />
                        <NodeItem
                            label="End"
                            icon={<Flag className="w-4 h-4 stroke-primary"/>}
                            style={endNodeShapeStyle}
                            nodeType={NodeTypes.END_NODE}
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-4">Gateway</h3>
                    <div className="flex flex-row gap-x-4 gap-y-4 flex-wrap">
                        <NodeItem
                            label="Gateway"
                            icon={<Plus className="stroke-primary" />}
                            style={GatewayShapeStyle}
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
                    </div>
                </div>

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
                                    icon={<DynamicIcon name={nodeDefinitionPreview.icon} className="stroke-primary" />}
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
            </CardContent>
        </Card>
    )
}

