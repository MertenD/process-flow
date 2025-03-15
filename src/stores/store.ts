import { createWithEqualityFn } from 'zustand/traditional'
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Connection,
    Edge,
    EdgeChange,
    MarkerType,
    Node,
    NodeChange, NodeRemoveChange,
    OnConnect,
    OnEdgesChange,
    OnNodesChange
} from 'reactflow';
import ActivityNode from "../components/processEditor/nodes/ActivityNode";
import StartNode from "../components/processEditor/nodes/StartNode";
import GatewayNode from "../components/processEditor/nodes/GatewayNode";
import EndNode from "../components/processEditor/nodes/EndNode";
import {NodeTypes} from "@/model/NodeTypes";
import {PointsType} from "@/model/PointsType";
import AndSplitNode from "@/components/processEditor/nodes/AndSplitNode";
import AndJoinNode from "@/components/processEditor/nodes/AndJoinNode";

export type RFState = {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    updateNodeData: <NodeData>(nodeId: string, data: NodeData) => void;
    getPreviousNodes: (nodeId: string, alreadyAddedNodeIds?: string[]) => Node[];
    getNodeById: (nodeId: string) => Node | null;
    getChildren: (nodeId: string) => Node[];
    updateNodeParent: (nodeId: Node, newParent: Node | undefined, oldParent: Node | undefined) => void;
    getAvailableVariableNames: (ownNodeId: string, ownVariableNames?: string[]) => string[];
}

export const selectedColor = "blue"

export const edgeStyle = {
    markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "black",
        width: 100,
        height: 20
    },
    style: {
        stroke: "black",
        strokeWidth: 2
    }
}

export const handleStyle = {
    width: 8,
    height: 8
}

export const useStore = createWithEqualityFn<RFState>((set, get) => ({
    nodes: [],
    edges: [],
    nodeTypes: {
        activityNode: ActivityNode,
        startNode: StartNode,
        endNode: EndNode,
        gatewayNode: GatewayNode,
        andSplitNode: AndSplitNode,
        andJoinNode: AndJoinNode
    },
    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    onConnect: (connection: Connection) => {
        // 1. Source and target node can not be the same
        // 2. If the target has already an ingoing connection: delete old connection
        if (connection.source !== connection.target) {
            set({
                edges: get().edges.map((edge) => {
                    if (edge.source == connection.source && edge.sourceHandle == connection.sourceHandle) {
                        return null
                    }
                    return edge
                }).filter((edge) => edge !== null).map((edge) => edge as Edge)
            })
            set({
                edges: addEdge({
                    ...connection,
                    ...edgeStyle
                }, get().edges)
            });
        }
    },
    updateNodeData: <NodeData>(nodeId: string, data: NodeData) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    node.data = data;
                }
                return node;
            }),
        });
    },
    getPreviousNodes: (nodeId: string, alreadyAddedNodeIds: string[] = []): Node[] => {
        if (alreadyAddedNodeIds.includes(nodeId)) {
            return []
        }
        const inputEdges = get().edges.filter((edge) => edge.target === nodeId)
        const nodes = inputEdges.map((edge) => get().getNodeById(edge.source)).filter((node) => node !== null) as Node[]
        nodes.push(...nodes.flatMap((node) => {
            return get().getPreviousNodes(node.id, [...alreadyAddedNodeIds, nodeId])
        }))
        return nodes
    },
    getNodeById: (nodeId: string): Node | null => {
        let resultNode = null
        get().nodes.forEach((node) => {
            if (node.id === nodeId) {
                resultNode = node
            }
        })
        return resultNode;
    },
    getChildren: (nodeId: string): Node[] => {
        return get().nodes.filter((node) =>
            node.parentId !== undefined && node.parentId === nodeId
        )
    },
    // TODO EndNotes dürfen nicht zu einer Challenge gehören
    updateNodeParent: (nodeToUpdate: Node, newParent: Node | undefined, oldParent: Node | undefined) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeToUpdate.id) {
                    if (newParent === undefined) {
                        node.parentId = undefined
                        node.position = {
                            x: node.position.x + (oldParent !== undefined ? oldParent.position.x : 0),
                            y: node.position.y + (oldParent !== undefined ? oldParent.position.y : 0)
                        }
                        node.data = { ...node.data, backgroundColor: "white"}
                    } else {
                        node.parentId = newParent.id
                        const xOffset = newParent.position.x - (oldParent !== undefined ? oldParent.position.x : 0)
                        const yOffset = newParent.position.y - (oldParent !== undefined ? oldParent.position.y : 0)
                        node.position = {
                            x: node.position.x - xOffset,
                            y: node.position.y - yOffset
                        }
                        node.data = { ...node.data, backgroundColor: newParent.data.backgroundColor}
                    }
                }
                return node
            })
        })
    },
    getAvailableVariableNames: (ownNodeId: string, ownVariableNames: string[] | undefined = undefined): string[] => {
        // Get all available variable names from all previous nodes that are no decision nodes
        // also add the points type names
        // TODO Wenn ich dynamisch nodes mit beliebigen Variablen erlaube, dann muss ich hier auch die Variablen der Nodes berücksichtigen und nicht nur über node.data.variableName gehen
        return Array.from(new Set(
            get().getPreviousNodes(ownNodeId)
                .filter((node) => node.type !== NodeTypes.GATEWAY_NODE)
                .flatMap((node) => Object.values(node.data.outputs || {}))
                .concat(ownVariableNames)
                .filter(name => name !== undefined && name !== "")
                .concat(Object.values(PointsType))
                .map((name) => `{${name}}`)
        ))
    }
}));

export default useStore;