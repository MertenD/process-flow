"use client"

import ReactFlow, {
    Background,
    BackgroundVariant,
    Connection,
    Controls,
    Edge,
    MiniMap,
    Node,
    OnConnectStartParams,
    Panel,
    ReactFlowProvider,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {shallow} from 'zustand/shallow'
import React, {useCallback, useEffect, useRef, useState} from "react";
import NodesToolbar from "./toolbars/NodesToolbar";
import {v4 as uuidv4} from 'uuid';
import OnCanvasNodesToolbar from "./toolbars/OnCanvasNodesSelector";
import {NodeTypes} from "@/model/NodeTypes";
import "@/styles/globals.css";
import OptionsToolbar from "@/components/processEditor/toolbars/OptionsToolbar";
import loadProcessModelFromDatabase from "@/actions/load-process-model-from-database";
import useUndoRedo from "@/components/processEditor/hooks/useUndoRedo";
import useStore, {edgeStyle} from "@/stores/store";
import {EditorToolbar} from "@/components/processEditor/toolbars/EditorToolbar";
import {NodeDefinitionPreview} from "@/model/NodeDefinition";

const selector = (state: any) => ({
    getNextNodeId: state.getNextNodeId,
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    nodeTypes: state.nodeTypes,
    getNodeById: state.getNodeById,
    updateNodeParent: state.updateNodeParent
});

export interface DragAndDropFlowProps {
    processModelId: number
    nodeDefinitionPreviews: NodeDefinitionPreview[]
}

function DragAndDropFlow({ processModelId, nodeDefinitionPreviews }: Readonly<DragAndDropFlowProps>) {
    const { takeSnapshot } = useUndoRedo();

    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, nodeTypes, getNodeById, updateNodeParent } = useStore(selector, shallow);

    const connectStartParams = useRef<OnConnectStartParams | null>(null);
    const reactFlowWrapper = useRef(null);
    const reactFlowInstance = useReactFlow();

    const [openOnCanvasNodeSelector, setOpenOnCanvasNodeSelector] = React.useState(false);
    const [lastEventPosition, setLastEventPosition] = React.useState<{x: number, y: number}>({x: 0, y: 0})
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        loadProcessModelFromDatabase(processModelId).then((value: { nodes: Node[], edges: Edge[] } | undefined) => {
            const nodes = value?.nodes
            const edges = value?.edges

            if (nodes === undefined) {
                alert("Error loading nodes from database")
                reactFlowInstance.setNodes([])
                return
            }
            reactFlowInstance.setNodes(nodes)
            // Run this to update the data of nodes that have a parent in the beginning (e.g. background color)
            nodes.forEach((node) => {
                if (node.parentId !== undefined) {
                    updateNodeParent(node, getNodeById(node.parentId), getNodeById(node.parentId))
                }
            })

            if (edges === undefined) {
                alert("Error loading edges from database")
                reactFlowInstance.setEdges([])
                return
            }
            reactFlowInstance.setEdges(edges)
        })
    }, [getNodeById, processModelId, reactFlowInstance, updateNodeParent]);

    const onDragOver = useCallback((event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: any) => {
        event.preventDefault();

        // @ts-ignore
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const { nodeType, nodeData } = JSON.parse(event.dataTransfer.getData('application/reactflow'));

        // check if the dropped element is valid
        if (typeof nodeType === 'undefined' || !nodeType) {
            return;
        }

        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        addNodeAtPosition(position, nodeType, nodeData)
    }, [addNodeAtPosition, reactFlowInstance]);

    const onConnectStart = useCallback((event: any, node: OnConnectStartParams) => {
        connectStartParams.current = node;
    }, []);

    const onConnectEnd = useCallback(
        (event: any) => {
            const targetIsPane = event.target.classList.contains('react-flow__pane');
            const targetIsChallengeNode = event.target.parentElement.classList.contains("react-flow__node-challengeNode")

            if ((targetIsPane || targetIsChallengeNode) && connectStartParams.current?.handleType === "source" && reactFlowWrapper.current !== null) {
                setLastEventPosition({ x: event.clientX, y: event.clientY })
                setOpenOnCanvasNodeSelector(true)
            }
        },
        [reactFlowInstance.project]
    );

    function addNodeAtPosition(position: {x: number, y: number}, nodeType: NodeTypes, data: any = {}): string {
        let yOffset = 0
        let zIndex = 0

        takeSnapshot()

        switch(nodeType) {
            case NodeTypes.START_NODE:
                yOffset = 15
                zIndex = 6
                break
            case NodeTypes.END_NODE:
                yOffset = 15
                zIndex = 5
                break
            case NodeTypes.ACTIVITY_NODE:
                yOffset = 25
                zIndex = 1
                break
            case NodeTypes.GATEWAY_NODE:
                yOffset = 15
                zIndex = 4
                break
        }

        const id = uuidv4();
        const newNode = {
            id,
            type: nodeType,
            position: { ...position, y: position.y - yOffset },
            zIndex: zIndex,
            data: data,
        } as Node;

        reactFlowInstance.addNodes(newNode);

        return id
    }

    const onNodeDragStart = useCallback(() => {
        setIsDragging(true)
    }, [])

    const onNodeDragStop = useCallback(() => {
        setIsDragging(false)
    }, [])

    return (
        <ReactFlow ref={reactFlowWrapper}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={(connection: Connection ) => {
                takeSnapshot()
                onConnect(connection)
            }}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onDragOver={onDragOver}
            onNodeDragStart={() => {
                takeSnapshot()
                onNodeDragStart()
            }}
            onNodeDragStop={onNodeDragStop}
            onNodesDelete={() => {
                takeSnapshot()
            }}
            onEdgesDelete={() => {
                takeSnapshot()
            }}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            selectNodesOnDrag={false}
            defaultEdgeOptions={{
                type: "smoothstep",
            }}
            deleteKeyCode={["Backspace", "Delete"]}
        >
            <Controls />
            <Background variant={BackgroundVariant.Dots} />
            <Panel position="top-left">
                <NodesToolbar nodeDefinitionPreviews={nodeDefinitionPreviews} />
            </Panel>
            <MiniMap nodeColor={(node) => {
                return node.data.backgroundColor || "gray"
            }} nodeStrokeWidth={3} zoomable pannable />
            <OnCanvasNodesToolbar
                open={openOnCanvasNodeSelector}
                position={lastEventPosition}
                nodeDefinitionPreviews={nodeDefinitionPreviews}
                onClose={(nodeType: NodeTypes | null, nodeData?: any) => {
                    setOpenOnCanvasNodeSelector(false)

                    if (nodeType !== null && connectStartParams.current !== null && connectStartParams.current?.nodeId !== null) {
                        const id = addNodeAtPosition(reactFlowInstance.project(lastEventPosition), nodeType, nodeData)
                        reactFlowInstance.addEdges({
                            id,
                            source: connectStartParams.current.nodeId,
                            sourceHandle: connectStartParams.current?.handleId,
                            target: id,
                            ...edgeStyle
                        });
                    }
                }}
            />
        </ReactFlow>
    );
}

export interface BpmnEditorProps {
    processModelId: number
    teamId: number
    nodeDefinitionPreviews: NodeDefinitionPreview[]
}

export default function BpmnEditor({ processModelId, teamId, nodeDefinitionPreviews }: Readonly<BpmnEditorProps>) {
    return (
        <ReactFlowProvider>
            <div className="flex flex-row w-full h-full">
                <div className="w-full h-full flex flex-col">
                    <EditorToolbar processModelId={processModelId} />
                    <div className="w-full h-full pl-2">
                        <DragAndDropFlow processModelId={processModelId} nodeDefinitionPreviews={nodeDefinitionPreviews} />
                    </div>
                </div>
                <OptionsToolbar teamId={teamId} />
            </div>
        </ReactFlowProvider>
    )
}