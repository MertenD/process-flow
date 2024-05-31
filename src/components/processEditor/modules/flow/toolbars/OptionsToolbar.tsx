"use client"

import React, {useState} from "react";
import {Node, useOnSelectionChange} from "reactflow";
import {getActivityOptionsDefinition} from "@/components/processEditor/modules/flow/nodes/ActivityNode";
import {NodeTypes} from "@/model/NodeTypes";
import DynamicOptions from "@/components/processEditor/modules/flow/toolbars/dynamicOptions/DynamicOptions";
import {getGatewayOptionsDefinition} from "@/components/processEditor/modules/flow/nodes/GatewayNode";
import {
    getGamificationEventOptionsDefinition
} from "@/components/processEditor/modules/flow/nodes/GamificationEventNode";
import {getChallengeOptionsDefinition} from "@/components/processEditor/modules/flow/nodes/ChallengeNode";

export default function OptionsToolbar() {

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
            options = <DynamicOptions optionsDefinition={ getActivityOptionsDefinition(selectedNode.id) } />
            break
        case NodeTypes.GATEWAY_NODE:
            options = <DynamicOptions optionsDefinition={ getGatewayOptionsDefinition(selectedNode.id) } />
            break
        case NodeTypes.GAMIFICATION_EVENT_NODE:
            options = <DynamicOptions optionsDefinition={ getGamificationEventOptionsDefinition(selectedNode.id) } />
            break
        case NodeTypes.CHALLENGE_NODE:
            options = <DynamicOptions optionsDefinition={ getChallengeOptionsDefinition(selectedNode.id) } />
            break
        default:
            options = <h2 className="text-2xl font-semibold">{ selectedNode.type }</h2>
            break
    }

    return <aside className="w-[300px] h-full p-3 border-l overflow-y-auto overflow-x-hidden">
        { options }
    </aside>
}