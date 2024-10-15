"use client"

import ReactFlow, {
    Background,
    BackgroundVariant, Connection,
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
import SaveButton from "@/components/processEditor/toolbars/buttons/SaveButton";
import CreateInstanceButton from "@/components/processEditor/toolbars/buttons/CreateInstanceButton";
import "@/styles/globals.css";
import OptionsToolbar from "@/components/processEditor/toolbars/OptionsToolbar";
import DeleteProcessButton from "@/components/processEditor/toolbars/buttons/DeleteProcessButton";
import loadProcessModelFromDatabase from "@/actions/load-process-model-from-database";
import ExportButton from "@/components/processEditor/toolbars/buttons/ExportButton";
import UndoButton from "@/components/processEditor/toolbars/buttons/UndoButton";
import useUndoRedo from "@/components/processEditor/hooks/useUndoRedo";
import RedoButton from "@/components/processEditor/toolbars/buttons/RedoButton";
import useStore, {edgeStyle} from "@/stores/store";

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
}

function DragAndDropFlow({ processModelId }: Readonly<DragAndDropFlowProps>) {
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
            case NodeTypes.CHALLENGE_NODE:
                yOffset = 198
                zIndex = 0
                break
            case NodeTypes.GAMIFICATION_EVENT_NODE:
                yOffset = 25
                zIndex = 3
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

    // Update which nodes belong to a challenge
    useEffect(() => {
        if (!isDragging) {
            nodes.filter((node: Node) =>
                node.type !== NodeTypes.CHALLENGE_NODE &&
                node.type !== NodeTypes.START_NODE &&
                node.type !== NodeTypes.END_NODE
            ).forEach((node: Node) => {
                const intersectingChallenges = reactFlowInstance.getIntersectingNodes(node)
                    .filter((node) => node.type === NodeTypes.CHALLENGE_NODE)
                    .filter((node) => node.data.isResizing === undefined || node.data.isResizing === false)
                // if the node already is part of a group and did not leave it, leave it as it is and don't change the parent
                if (node.parentId !== undefined && intersectingChallenges.map(node => node.id).includes(node.parentId)) {
                    return
                }

                // If the node had no parent it will be added
                if (intersectingChallenges[0] !== undefined && node.parentId === undefined) {
                    updateNodeParent(node, intersectingChallenges[0], undefined)
                // If the node had a parent and was moved to another parent
                } else if (intersectingChallenges[0] !== undefined && node.parentId !== undefined && node.parentId !== intersectingChallenges[0].id) {
                    updateNodeParent(node, intersectingChallenges[0], getNodeById(node.parentId))
                // If the node had a parent it will be removed
                } else if (intersectingChallenges[0] === undefined && node.parentId !== undefined) {
                    updateNodeParent(node, undefined, getNodeById(node.parentId))
                }
            })
        }
    }, [nodes])

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
            className="bg-accent"
        >
            <Controls />
            <Background variant={BackgroundVariant.Dots} />
            <Panel position="top-left">
                <NodesToolbar />
            </Panel>
            <MiniMap nodeColor={(node) => {
                if (node.type === NodeTypes.CHALLENGE_NODE) {
                    return node.data.backgroundColor + "88"
                }
                return node.data.backgroundColor || "gray"
            }} nodeStrokeWidth={3} zoomable pannable className="bg-accent" />
            <OnCanvasNodesToolbar
                open={openOnCanvasNodeSelector}
                position={lastEventPosition}
                onClose={(nodeType: NodeTypes | null) => {
                    setOpenOnCanvasNodeSelector(false)

                    if (nodeType !== null && connectStartParams.current !== null && connectStartParams.current?.nodeId !== null) {
                        const id = addNodeAtPosition(reactFlowInstance.project(lastEventPosition), nodeType, processModelId)
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
    processModelName: string
    teamId: number
}

export default function BpmnEditor({ processModelId, processModelName, teamId }: Readonly<BpmnEditorProps>) {
    return (
        <ReactFlowProvider>
            <div className="flex flex-row w-full h-full">
                <div className="w-full h-full flex flex-col">
                    <div className="w-full p-3 flex flex-row space-x-2 border-b">
                        <SaveButton processModelId={processModelId}/>
                        <CreateInstanceButton processModelId={processModelId}/>
                        <ExportButton/>
                        <div className="h-full w-1 bg-secondary rounded-2xl"/>
                        <UndoButton/>
                        <RedoButton/>
                        <div className="h-full w-1 bg-secondary rounded-2xl"/>
                        <DeleteProcessButton teamId={teamId} processModelId={processModelId}
                                             processModelName={processModelName}/>
                    </div>
                    <div className="w-full h-full pl-2 bg-accent">
                        <DragAndDropFlow processModelId={processModelId}/>
                    </div>
                </div>
                <OptionsToolbar teamId={teamId} />
            </div>
        </ReactFlowProvider>
    )
}