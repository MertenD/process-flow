"use client"

import React, {useCallback, useEffect, useState} from "react";
import {Node, useOnSelectionChange} from "reactflow";
import {NodeTypes} from "@/model/NodeTypes";
import DynamicOptions, {setDefaultValues} from "@/components/processEditor/toolbars/dynamicOptions/DynamicOptions";
import {getGatewayOptionsDefinition} from "@/components/processEditor/nodes/GatewayNode";
import {getStartOptionsDefinition} from "@/components/processEditor/nodes/StartNode";
import {OptionsDefinition} from "@/model/OptionsModel";
import getNodeDefinition from "@/actions/shop/get-node-definition";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {NodeDefinitionPreview} from "@/model/NodeDefinition";
import getSavedNodeDefinitions from "@/actions/shop/get-saved-node-definitions";
import {Separator} from "@/components/ui/separator";
import useStore from "@/stores/store";
import {ActivityNodeData} from "@/components/processEditor/nodes/ActivityNode";

export interface OptionsToolbarProps {
    teamId: number
}

export default function OptionsToolbar({ teamId }: OptionsToolbarProps) {

    const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);

    const [savedNodeDefinitions, setSavedNodeDefinitions] = useState<NodeDefinitionPreview[]>([]);
    const [activityOptionsDefinition, setActivityOptionsDefinition] = useState<OptionsDefinition | null>(null);

    const updateNodeData = useStore((state) => state.updateNodeData)

    const updateActivityOptionsDefinition = useCallback((nodeDefinitionId: number, selectedNode: Node) => {
        getNodeDefinition(nodeDefinitionId).then((nodeDefinition) => {
            const optionsDefinition = {
                ...nodeDefinition.optionsDefinition,
                nodeId: selectedNode.id
            }
            setActivityOptionsDefinition(optionsDefinition);

            // Update the node data with the default values from the node definition
            const updatedData = {
                ...selectedNode.data,
                nodeDefinitionId: nodeDefinitionId
            };
            setDefaultValues(nodeDefinition.optionsDefinition.structure, updatedData);
            updateNodeData<ActivityNodeData>(selectedNode.id, updatedData);
        })
    }, [updateNodeData]);
    
    useEffect(() => {
        if (selectedNode && selectedNode.type === NodeTypes.ACTIVITY_NODE) {
            getSavedNodeDefinitions(teamId).then((nodeDefinition) => {
                setSavedNodeDefinitions(nodeDefinition);
            })
        }
    }, [selectedNode, teamId]);

    useEffect(() => {
        const selectedNodeDefinitionId = (selectedNode?.data as ActivityNodeData)?.nodeDefinitionId;
        if (selectedNode && selectedNode.type === NodeTypes.ACTIVITY_NODE && selectedNodeDefinitionId) {
            updateActivityOptionsDefinition(selectedNodeDefinitionId, selectedNode);
        } else {
            setActivityOptionsDefinition(null);
        }
    }, [selectedNode, updateActivityOptionsDefinition]);

    useOnSelectionChange({
        onChange: ({nodes, edges}) => {
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

    let options: React.JSX.Element
    switch (selectedNode.type) {
        // TODO Add all nodes
        case NodeTypes.ACTIVITY_NODE:
            if (!activityOptionsDefinition) {
                options = <></>
            } else {
                options = <DynamicOptions optionsDefinition={activityOptionsDefinition} teamId={teamId}/>
            }
            break
        case NodeTypes.GATEWAY_NODE:
            options = <DynamicOptions optionsDefinition={getGatewayOptionsDefinition(selectedNode.id)} teamId={teamId}/>
            break
        case NodeTypes.START_NODE:
            options = <DynamicOptions optionsDefinition={getStartOptionsDefinition(selectedNode.id)} teamId={teamId}/>
            break
        default:
            options = <h2 className="text-2xl font-semibold">{selectedNode.type}</h2>
            break
    }

    return <aside className="w-[400px] h-full p-3 border-l overflow-y-auto overflow-x-hidden space-y-4">
        { selectedNode.type === NodeTypes.ACTIVITY_NODE && <div>
            <h2 className="text-lg font-bold mb-2">Select Activity type</h2>
            <Select
                defaultValue={(selectedNode?.data as ActivityNodeData)?.nodeDefinitionId?.toString() || ""}
                onValueChange={(newValue) => {
                    updateActivityOptionsDefinition(Number(newValue), selectedNode);
                }}

            >
                <SelectTrigger>
                    <SelectValue placeholder="Please select"/>
                </SelectTrigger>
                <SelectContent>
                    {savedNodeDefinitions.map((savedNodeDefinition) => (
                        <SelectItem key={`nodeDefinitionId-${savedNodeDefinition.id}`}
                                    value={savedNodeDefinition.id.toString()}>
                            {savedNodeDefinition.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div> }
        { selectedNode.type === NodeTypes.ACTIVITY_NODE && <Separator orientation="horizontal"/> }
        { options }
    </aside>
}