"use client"

import React, {useEffect, useState} from "react";
import {Node, useOnSelectionChange} from "reactflow";
import {NodeTypes} from "@/model/NodeTypes";
import DynamicOptions from "@/components/processEditor/toolbars/dynamicOptions/DynamicOptions";
import {getGatewayOptionsDefinition} from "@/components/processEditor/nodes/GatewayNode";
import {getStartOptionsDefinition} from "@/components/processEditor/nodes/StartNode";
import {OptionsDefinition} from "@/model/OptionsModel";
import getNodeDefinition from "@/actions/shop/get-node-definition";

export interface OptionsToolbarProps {
    teamId: number
}

export default function OptionsToolbar({ teamId }: OptionsToolbarProps) {

    const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);
    const [activityOptionsDefinition, setActivityOptionsDefinition] = useState<OptionsDefinition | null>(null);
    
    useEffect(() => {
        if (selectedNode && selectedNode.type === NodeTypes.ACTIVITY_NODE) {
            // TODO Replace with actual node definition id from database which this activity should represent
            getNodeDefinition(1).then((nodeDefinition) => {
                const optionsDefinition = {
                    ...nodeDefinition.optionsDefinition,
                    nodeId: selectedNode.id
                }
                setActivityOptionsDefinition(optionsDefinition);
            })
        }
    }, [selectedNode]);
    
    useOnSelectionChange({
        onChange: ({ nodes, edges }) => {
            if (nodes && nodes.length === 1) {
                setSelectedNode(nodes[0]);
            } else {
                setSelectedNode(undefined);
            }
        },
    });
    
    if (!selectedNode || !activityOptionsDefinition) {
        return <></>
    }

    let options: React.JSX.Element
    switch (selectedNode.type) {
        // TODO Add all nodes
        case NodeTypes.ACTIVITY_NODE:
            options = <DynamicOptions optionsDefinition={ activityOptionsDefinition } teamId={teamId} />
            break
        case NodeTypes.GATEWAY_NODE:
            options = <DynamicOptions optionsDefinition={ getGatewayOptionsDefinition(selectedNode.id) } teamId={teamId} />
            break
        case NodeTypes.START_NODE:
            options = <DynamicOptions optionsDefinition={ getStartOptionsDefinition(selectedNode.id) } teamId={teamId} />
            break
        default:
            options = <h2 className="text-2xl font-semibold">{ selectedNode.type }</h2>
            break
    }

    return <aside className="w-[400px] h-full p-3 border-l overflow-y-auto overflow-x-hidden">
        { options }
    </aside>
}