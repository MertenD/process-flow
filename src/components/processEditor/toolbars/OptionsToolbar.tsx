"use client"

import React, {useState} from "react";
import {Node, useOnSelectionChange} from "reactflow";
import {getActivityOptionsDefinition} from "@/components/processEditor/nodes/ActivityNode";
import {NodeTypes} from "@/model/NodeTypes";
import DynamicOptions from "@/components/processEditor/toolbars/dynamicOptions/DynamicOptions";
import {getGatewayOptionsDefinition} from "@/components/processEditor/nodes/GatewayNode";
import {getStartOptionsDefinition} from "@/components/processEditor/nodes/StartNode";

export interface OptionsToolbarProps {
    teamId: number
}

export default function OptionsToolbar({ teamId }: OptionsToolbarProps) {

    const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);

    useOnSelectionChange({
        onChange: ({ nodes, edges }) => {
            if (nodes && nodes.length === 1) {
                setSelectedNode(nodes[0]);
            } else {
                setSelectedNode(undefined);
            }
        },
    });

    if (!selectedNode) {
        return <></>
    }

    let options = <></>
    switch (selectedNode.type) {
        // TODO Add all nodes
        case NodeTypes.ACTIVITY_NODE:
            options = <DynamicOptions optionsDefinition={ getActivityOptionsDefinition(selectedNode.id) } teamId={teamId} />
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

    return <aside className="w-[300px] h-full p-3 border-l overflow-y-auto overflow-x-hidden">
        { options }
    </aside>
}