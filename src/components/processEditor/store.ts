import create from 'zustand';
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
import ActivityNode from "./modules/flow/nodes/ActivityNode";
import StartNode from "./modules/flow/nodes/StartNode";
import GatewayNode from "./modules/flow/nodes/GatewayNode";
import EndNode from "./modules/flow/nodes/EndNode";
import ChallengeNode from "./modules/flow/nodes/ChallengeNode";
import {NodeTypes} from "./model/NodeTypes";
import {PointsType} from "./model/PointsType";
import InfoNode from "./modules/flow/nodes/InfoNode";
import GamificationEventNode from "./modules/flow/nodes/GamificationEventNode";

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
    getAvailableVariableNames: (ownNodeId: string, ownVariableName?: string) => string[];
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

export const useStore = create<RFState>((set, get) => ({
    nodes: [],
    edges: [],
    nodeTypes: {
        activityNode: ActivityNode,
        startNode: StartNode,
        endNode: EndNode,
        gatewayNode: GatewayNode,
        challengeNode: ChallengeNode,
        infoNode: InfoNode,
        gamificationEventNode: GamificationEventNode
    },
    onNodesChange: (changes: NodeChange[]) => {
        // Ungroup group if the deleted node is a group so the children are not deleted with the group
        const nodeId = (changes[0] as NodeRemoveChange).id || null
        if (changes[0].type === "remove" && nodeId !== null && get().getNodeById(nodeId)?.type === NodeTypes.CHALLENGE_NODE) {
            const children = get().getChildren(nodeId)
            set({
                nodes: get().nodes.map((node) => {
                    if (children.includes(node) && node.parentNode !== undefined) {
                        const oldParentNode = get().getNodeById(node.parentNode) as Node
                        node.parentNode = undefined
                        node.position = { x: node.position.x + oldParentNode.position.x, y: node.position.y + oldParentNode.position.y }
                        node.data = { ...node.data, backgroundColor: "white"}
                    }
                    return node
                })
            })
        }
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
            node.parentNode !== undefined && node.parentNode === nodeId
        )
    },
    // TODO EndNotes dürfen nicht zu einer Challenge gehören
    updateNodeParent: (nodeToUpdate: Node, newParent: Node | undefined, oldParent: Node | undefined) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeToUpdate.id) {
                    if (newParent === undefined) {
                        node.parentNode = undefined
                        node.position = {
                            x: node.position.x + (oldParent !== undefined ? oldParent.position.x : 0),
                            y: node.position.y + (oldParent !== undefined ? oldParent.position.y : 0)
                        }
                        node.data = { ...node.data, backgroundColor: "white"}
                    } else {
                        node.parentNode = newParent.id
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
    getAvailableVariableNames: (ownNodeId: string, ownVariableName: string | undefined = undefined): string[] => {
        // Get all available variable names from all previous nodes that are no decision nodes
        // also add the points type names
        return Array.from(new Set(
            get().getPreviousNodes(ownNodeId)
                .filter((node) => node.type !== NodeTypes.GATEWAY_NODE)
                .map((node) => node.data.variableName)
                .concat(ownVariableName)
                .filter(name => name !== undefined && name !== "")
                .concat(Object.values(PointsType))
        ))
    }
}));

export default useStore;