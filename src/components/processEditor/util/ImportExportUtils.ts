import {Edge, Node, ReactFlowInstance} from "reactflow";
import {BpmnDto, mergeBpmnDto} from "../model/Bpmn";
import {serializeToDto} from "./SerializationUtils";
import {v4 as uuidv4} from 'uuid';
import {NodeTypes} from "../model/NodeTypes";
import {ActivityNodeData} from "../modules/flow/nodes/ActivityNode";
import {InfoNodeData} from "../modules/flow/nodes/InfoNode";
import {GatewayNodeData} from "../modules/flow/nodes/GatewayNode";
import {ChallengeNodeData} from "../modules/flow/nodes/ChallengeNode";
import {GamificationEventNodeData} from "../modules/flow/nodes/GamificationEventNode";

export const onSave = (nodes: Node[], edges: Edge[]) => {
    const downloadableContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(serializeToDto(nodes, edges), null, 2));
    const anchorElement = document.getElementById('downloadSave');
    if (anchorElement !== null) {
        anchorElement.setAttribute("href", downloadableContent);
        anchorElement.setAttribute("download", "bpmn-diagram.json");
        anchorElement.click();
    }
}

export const onLoad = (changeEvent: any, reactFlowInstance: ReactFlowInstance) => {
    const fileReader = new FileReader();
    fileReader.readAsText(changeEvent.target.files[0], "UTF-8");
    fileReader.onload = progressEvent => {
        if (progressEvent.target !== null) {
            const bpmnDto = JSON.parse(String(progressEvent.target.result)) as BpmnDto

            // This whole process changes the id's of the nodes and adapts the edges as well to that change.
            // This is necessary so that the loaded nodes will be re-rendered and the loaded data is loaded into the node components
            const newIdPairs = bpmnDto.nodes.reduce((accumulator: Record<string, string>, node) => {
                accumulator[node.id] = uuidv4()
                return accumulator;
            }, {});
            const newNodes = bpmnDto.nodes.map((node: Node) => {
                return { ...node, id: newIdPairs[node.id], parentNode: node.parentNode !== undefined ? newIdPairs[node.parentNode] : undefined }
            })
            const newEdges = bpmnDto.edges.map((edge: Edge) => {
                return { ...edge, source: newIdPairs[edge.source], target: newIdPairs[edge.target]}
            })

            reactFlowInstance.setNodes(newNodes)
            reactFlowInstance.setEdges(newEdges)
        }
    };
}

export const onExport = (
    nodes: Node[],
    edges: Edge[],
    getChildren: (nodeId: string) => Node[],
    getNodeById: (nodeId: string) => Node | null
) => {

    const transformedBpmn = transformChallengesToRealBpmn(nodes, edges, getChildren, getNodeById)

    const bpmn = {
        "definitions": {
            id: "Definitions",
            targetNamespace: "http://www.omg.org/spec/BPMN/20100524/MODEL",
            exporter: "gbpmneditor (gbpmneditor.mertendieckmann.com)",
            xmlns: "http://www.omg.org/spec/BPMN/20100524/MODEL",
            "xmlns:xs": "http://www.w3.org/2001/XMLSchema-instance",
            "xs:schemaLocation": "http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd",
            "xmlns:bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI",
            "xmlns:dc": "http://www.omg.org/spec/DD/20100524/DC",
            "xmlns:di": "http://www.omg.org/spec/DD/20100524/DI",
            children: [
                {
                    "process": {
                        id: "Process_1b8z10m",
                        isExecutable: "false",
                        children: [
                            ...transformedBpmn.nodes.flatMap((node: Node) => {
                                switch (node.type as NodeTypes) {
                                    case NodeTypes.START_NODE:
                                        return createStartNode(node, transformedBpmn.edges)
                                    case NodeTypes.END_NODE:
                                        return createEndNode(node, transformedBpmn.edges)
                                    case NodeTypes.ACTIVITY_NODE:
                                        return createActivityNode(node, transformedBpmn.edges)
                                    case NodeTypes.INFO_NODE:
                                        return createInfoNode(node, transformedBpmn.edges)
                                    case NodeTypes.GATEWAY_NODE:
                                        return createGatewayNode(node, transformedBpmn.edges)
                                    case NodeTypes.CHALLENGE_NODE:
                                        return createChallengeNode(node, transformedBpmn.edges)
                                    case NodeTypes.GAMIFICATION_EVENT_NODE:
                                        return createGamificationEventNode(node, transformedBpmn.edges)
                                }
                            }),
                            ...transformedBpmn.edges.map((edge: Edge) => {
                                return {
                                    "sequenceFlow": {
                                        id: "IdFlow_" + edge.id.replaceAll("-", ""),
                                        sourceRef: "Id_" + edge.source.replaceAll("-", ""),
                                        targetRef: "Id_" + edge.target.replaceAll("-", ""),
                                        name: nodes.find((node) => node.id == edge.source && (node.type as NodeTypes) === NodeTypes.GATEWAY_NODE) !== undefined ? edge.sourceHandle : "",
                                        children: []
                                    }
                                }
                            })
                        ]
                    },
                    "bpmndi:BPMNDiagram": {
                        id: "BPMNDiagram_1",
                        children: [
                            {
                                "bpmndi:BPMNPlane": {
                                    id: "BPMNPlane_1",
                                    bpmnElement: "Process_1b8z10m",
                                    children: [
                                        ...transformedBpmn.nodes.flatMap((node: Node) => {
                                            let shapes = []
                                            shapes.push({
                                                "bpmndi:BPMNShape": {
                                                    bpmnElement: "Id_" + node.id.replaceAll("-", ""),
                                                    children: [
                                                        {
                                                            "dc:Bounds": {
                                                                x: node.parentNode !== undefined ? node.position.x + (getNodeById(node.parentNode)?.position.x || 0) : node.position.x,
                                                                y: node.parentNode !== undefined ? node.position.y + (getNodeById(node.parentNode)?.position.y || 0) : node.position.y,
                                                                width: node.type === NodeTypes.GAMIFICATION_EVENT_NODE ? 40 : node.width,
                                                                height: node.type === NodeTypes.GAMIFICATION_EVENT_NODE ? 40 : node.height
                                                            }
                                                        }
                                                    ]
                                                }
                                            })
                                            switch (node.type as NodeTypes) {
                                                case NodeTypes.ACTIVITY_NODE:
                                                case NodeTypes.CHALLENGE_NODE:
                                                case NodeTypes.GAMIFICATION_EVENT_NODE:
                                                    shapes.push({
                                                        "bpmndi:BPMNShape": {
                                                            id: "DataObjectReference_" + node.id.replaceAll("-", "") + "_di",
                                                            bpmnElement: "DataObjectReference_" + node.id.replaceAll("-", ""),
                                                            children: [
                                                                {
                                                                    "dc:Bounds": {
                                                                        x: node.parentNode !== undefined ? node.position.x + 10 + (getNodeById(node.parentNode)?.position.x || 0) : node.position.x + 10,
                                                                        y: node.parentNode !== undefined ? node.position.y - 150 + (getNodeById(node.parentNode)?.position.y || 0) : node.position.y - 150,
                                                                        width: 40,
                                                                        height: 60
                                                                    }
                                                                },
                                                                {
                                                                    "bpmndi:BPMNLabel": {
                                                                        children: [
                                                                            {
                                                                                "dc:Bounds": {
                                                                                    x: node.parentNode !== undefined ? node.position.x + 50 + (getNodeById(node.parentNode)?.position.x || 0) : node.position.x + 50,
                                                                                    y: node.parentNode !== undefined ? node.position.y - 150 + (getNodeById(node.parentNode)?.position.y || 0) : node.position.y - 150,
                                                                                    width: 150,
                                                                                    height: 30
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    })
                                                    shapes.push({
                                                        "bpmndi:BPMNEdge": {
                                                            id: "DataInputAssociation_" + node.id.replaceAll("-", "") + "_di",
                                                            bpmnElement: "DataInputAssociation_" + node.id.replaceAll("-", ""),
                                                            children: [
                                                                {
                                                                    "di:waypoint": {
                                                                        x: node.parentNode !== undefined ? node.position.x + 30 + (getNodeById(node.parentNode)?.position.x || 0) : node.position.x + 30,
                                                                        y: node.parentNode !== undefined ? node.position.y - 90 + (getNodeById(node.parentNode)?.position.y || 0) : node.position.y - 90
                                                                    }
                                                                },
                                                                {
                                                                    "di:waypoint": {
                                                                        x: node.parentNode !== undefined ? node.position.x + 30 + (getNodeById(node.parentNode)?.position.x || 0) : node.position.x + 30,
                                                                        y: node.parentNode !== undefined ? node.position.y + (getNodeById(node.parentNode)?.position.y || 0) : node.position.y
                                                                    }
                                                                },
                                                            ]
                                                        }
                                                    })
                                                    break
                                            }
                                            return shapes
                                        }),
                                        ...transformedBpmn.edges.map((edge: Edge) => {
                                            return {
                                                "bpmndi:BPMNEdge": {
                                                    bpmnElement: "IdFlow_" + edge.id.replaceAll("-", ""),
                                                }
                                            }
                                        })
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }

    const downloadableContent = "data:text/xml;charset=utf-8," + encodeURIComponent(jsonToPrettyXml(bpmn));
    const anchorElement = document.getElementById('downloadExport');
    if (anchorElement !== null) {
        anchorElement.setAttribute("href", downloadableContent);
        anchorElement.setAttribute("download", "bpmn-diagram-export.bpmn");
        anchorElement.click();
    }

    function createStartNode(node: Node, edges: Edge[]): any {
        return {
            "startEvent": {
                id: "Id_" + node.id.replaceAll("-", ""),
                children: [
                    ...getOutgoingEdgeChildren(edges, node),
                ]
            }
        }
    }

    function createEndNode(node: Node, edges: Edge[]): any {
        return {
            "endEvent": {
                id: "Id_" + node.id.replaceAll("-", ""),
                children: [
                    ...getIncomingEdgeChildren(edges, node),
                ]
            }
        }
    }

    function createActivityNode(node: Node, edges: Edge[]): any {
        const activityNodeData = node.data as ActivityNodeData
        const propertyId = "Property_" + node.id.replaceAll("-", "")
        const inputDataAssociationId = "DataInputAssociation_" + node.id.replaceAll("-", "")
        const dataObjectReferenceId = "DataObjectReference_" + node.id.replaceAll("-", "")
        const dataObjectId = "DataObject_" + node.id.replaceAll("-", "")

        return [
            {
                "task": {
                    id: "Id_" + node.id.replaceAll("-", ""),
                    name: activityNodeData.task,
                    children: [
                        {
                            "property": {
                                id: propertyId,
                            }
                        },
                        {
                            "dataInputAssociation": {
                                id: inputDataAssociationId,
                                sourceRef: dataObjectReferenceId,
                                children: [
                                    {
                                        "targetRef": {
                                            children: propertyId
                                        }
                                    }
                                ]
                            }
                        },
                        ...getIncomingEdgeChildren(edges, node),
                        ...getOutgoingEdgeChildren(edges, node),
                    ]
                }
            },
            {
                "dataObjectReference": {
                    id: dataObjectReferenceId,
                    name: JSON.stringify(activityNodeData),
                    dataObjectRef: dataObjectId
                }
            },
            {
                "dataObject": {
                    id: dataObjectId
                }
            }
        ]
    }

    function createInfoNode(node: Node, edges: Edge[]): any {
        const infoNodeData = node.data as InfoNodeData
        return {
            "task": {
                id: "Id_" + node.id.replaceAll("-", ""),
                name: infoNodeData.infoText,
                children: [
                    ...getIncomingEdgeChildren(edges, node),
                    ...getOutgoingEdgeChildren(edges, node)
                ]
            }
        }
    }

    function createGatewayNode(node: Node, edges: Edge[]): any {
        const gatewayNodeData = node.data as GatewayNodeData
        return {
            "exclusiveGateway": {
                id: "Id_" + node.id.replaceAll("-", ""),
                name: gatewayNodeData.value1 + " " + gatewayNodeData.comparison + " " + gatewayNodeData.value2,
                children: [
                    ...getIncomingEdgeChildren(edges, node),
                    ...getOutgoingEdgeChildren(edges, node)
                ]
            }
        }
    }

    function getOutgoingEdgeChildren(edges: Edge[], currentNode: Node): any {
        return edges.filter((edge) => edge.source === currentNode.id).map(edge => {
            return {
                "outgoing": {
                    children: "IdFlow_" + edge.id.replaceAll("-", "")
                }
            }
        })
    }

    function getIncomingEdgeChildren(edges: Edge[], currentNode: Node): any {
        return edges.filter((edge) => edge.target === currentNode.id).map(edge => {
            return {
                "incoming": {
                    children: "IdFlow_" + edge.id.replaceAll("-", "")
                }
            }
        })
    }

    function createChallengeNode(node: Node, edges: Edge[]): any {
        const challengeNodeData = node.data as ChallengeNodeData
        const propertyId = "Property_" + node.id.replaceAll("-", "")
        const inputDataAssociationId = "DataInputAssociation_" + node.id.replaceAll("-", "")
        const dataObjectReferenceId = "DataObjectReference_" + node.id.replaceAll("-", "")
        const dataObjectId = "DataObject_" + node.id.replaceAll("-", "")

        return [
            {
                "intermediateThrowEvent": {
                    id: "Id_" + node.id.replaceAll("-", ""),
                    name: challengeNodeData.challengeType,
                    children: [
                        {
                            "property": {
                                id: propertyId,
                            }
                        },
                        {
                            "dataInputAssociation": {
                                id: inputDataAssociationId,
                                sourceRef: dataObjectReferenceId,
                                children: [
                                    {
                                        "targetRef": {
                                            children: propertyId
                                        }
                                    }
                                ]
                            }
                        },
                        ...getIncomingEdgeChildren(edges, node),
                        ...getOutgoingEdgeChildren(edges, node),
                    ]
                }
            },
            {
                "dataObjectReference": {
                    id: dataObjectReferenceId,
                    name: JSON.stringify(challengeNodeData),
                    dataObjectRef: dataObjectId
                }
            },
            {
                "dataObject": {
                    id: dataObjectId
                }
            }
        ]
    }

    function createGamificationEventNode(node: Node, edges: Edge[]): any {
        const gamificationEventNodeData = node.data as GamificationEventNodeData
        const propertyId = "Property_" + node.id.replaceAll("-", "")
        const inputDataAssociationId = "DataInputAssociation_" + node.id.replaceAll("-", "")
        const dataObjectReferenceId = "DataObjectReference_" + node.id.replaceAll("-", "")
        const dataObjectId = "DataObject_" + node.id.replaceAll("-", "")

        return [
            {
                "intermediateThrowEvent": {
                    id: "Id_" + node.id.replaceAll("-", ""),
                    name: gamificationEventNodeData.gamificationType,
                    children: [
                        {
                            "property": {
                                id: propertyId,
                            }
                        },
                        {
                            "dataInputAssociation": {
                                id: inputDataAssociationId,
                                sourceRef: dataObjectReferenceId,
                                children: [
                                    {
                                        "targetRef": {
                                            children: propertyId
                                        }
                                    }
                                ]
                            }
                        },
                        ...getIncomingEdgeChildren(edges, node),
                        ...getOutgoingEdgeChildren(edges, node),
                    ]
                }
            },
            {
                "dataObjectReference": {
                    id: dataObjectReferenceId,
                    name: JSON.stringify(gamificationEventNodeData),
                    dataObjectRef: dataObjectId
                }
            },
            {
                "dataObject": {
                    id: dataObjectId
                }
            }
        ]
    }
}

function transformChallengesToRealBpmn(
    nodes: Node[],
    edges: Edge[],
    getChildren: (nodeId: string) => Node[],
    getNodeById: (nodeId: string) => Node | null
): BpmnDto {

    const challengeNodes = getChallengeNodes(nodes)
    const transformedChallengeStartAndStop = mergeBpmnDto(challengeNodes.map((challengeNode: Node) => {
        const firstChildren = getFirstChildrenInChallenge(challengeNode, edges, getChildren)
        const lastChildren = getLastChildrenInChallenge(challengeNode, edges, getChildren)

        const substitutedIngoingEdges = substituteIngoingEdges(firstChildren, challengeNode, edges)
        const substitutedOutgoingEdges = substituteOutgoingEdges(lastChildren, challengeNode, edges, nodes)

        return mergeBpmnDto([substitutedIngoingEdges, substitutedOutgoingEdges])
    }))

    const edgesOutsideOrInsideChallenges = edges.filter((edge) => getNodeById(edge.source)?.parentNode === getNodeById(edge.target)?.parentNode)

    const transformedNodes = [...nodes.filter((node) => node.type as NodeTypes !== NodeTypes.CHALLENGE_NODE), ...transformedChallengeStartAndStop.nodes]
    const transformedEdges = [...edgesOutsideOrInsideChallenges, ...transformedChallengeStartAndStop.edges]

    return {
        nodes: transformedNodes,
        edges: transformedEdges
    } as BpmnDto
}

function getChallengeNodes(nodes: Node[]): Node[] {
    return nodes.filter((node) => node.type as NodeTypes === NodeTypes.CHALLENGE_NODE)
}

function getFirstChildrenInChallenge(challengeNode: Node, edges: Edge[], getChildren: (nodeId: string) => Node[]) {
    let challengeChildren = getChildren(challengeNode.id)
    return challengeChildren.filter((node) => {
        // Get all incoming edges to the current child node
        const incomingEdges = edges.filter((edge) => edge.target === node.id)
        let isFirst = false
        // Check if any of the incoming edges to the current child node are from a node outside the challenge node's children
        incomingEdges.forEach((edge) => {
            const prevNodeId = edge.source
            if (!challengeChildren.map((node) => node.id).includes(prevNodeId)) {
                isFirst = true
            }
        })
        return isFirst
    })
}

function getLastChildrenInChallenge(challengeNode: Node, edges: Edge[], getChildren: (nodeId: string) => Node[]) {
    let challengeChildren = getChildren(challengeNode.id)
    // Get all the last children of the challenge node (i.e. children that have no outgoing edges to other children of the challenge node)
    return challengeChildren.filter((node) => {
        // Get all outgoing edges from the current child node
        const outgoingEdges = edges.filter((edge) => edge.source === node.id)
        let isLast = false
        // Check if any of the outgoing edges from the current child node are to a node outside of the challenge node's children
        outgoingEdges.forEach((edge) => {
            const nextNodeId = edge.target
            if (!challengeChildren.map((node) => node.id).includes(nextNodeId)) {
                isLast = true
            }
        })
        return isLast
    })
}

function substituteIngoingEdges(firstChildren: Node[], challengeNode: Node, edges: Edge[]): BpmnDto {

    // Array to store all new nodes
    let newNodes: Node[] = []
    // Array to store all new edges
    let newEdges: Edge[] = []

    // For each first child node of the challenge node
    firstChildren.map((node) => {
        // Get all incoming edges to the current first child node
        const incomingEdges = edges.filter((edge) => edge.target === node.id)
        // Generate a unique ID for a new outgoing edge
        const outgoingEdgeId = uuidv4()
        // Generate a unique ID for a new "Challenge Start" info node
        const challengeStartId = uuidv4()
        // Create a new "Challenge Start" info node
        const newChallengeStartNode = {
            id: challengeStartId,
            type: NodeTypes.CHALLENGE_NODE,
            position: {
                x: node.position.x + challengeNode.position.x - 100,
                y: node.position.y + challengeNode.position.y + (node.height || 0) / 2
            },
            width: 50,
            height: 50,
            data: {
                isStart: true,
                ...challengeNode.data
            }
        } as Node
        // Add the new "Challenge Start" node to
        newNodes.push(newChallengeStartNode)
        const newOutgoingEdge = {
            id: outgoingEdgeId,
            source: challengeStartId,
            target: node.id,
        } as Edge
        newEdges.push(newOutgoingEdge)
        incomingEdges.forEach((edge) => {
            const newIncomingEdge = {
                id: edge.id,
                source: edge.source,
                sourceHandle: edge.sourceHandle,
                target: challengeStartId
            } as Edge
            newEdges.push(newIncomingEdge)
        })
    })

    return {
        nodes: newNodes,
        edges: newEdges
    } as BpmnDto
}

function substituteOutgoingEdges(lastChildren: Node[], challengeNode: Node, edges: Edge[], nodes: Node[]): BpmnDto {

    // Array to store all new nodes
    let newNodes: Node[] = []
    // Array to store all new edges
    let newEdges: Edge[] = []

    lastChildren.map((node) => {
        const outgoingEdges = edges.filter((edge) => edge.source === node.id)
        outgoingEdges
            .filter((edge) => nodes.find((node => node.id === edge.target))?.parentNode === undefined)
            .forEach((outgoingEdge, index) => {
                const challengeEndId = uuidv4() + outgoingEdge.id
                const incomingEdgeId = uuidv4() + outgoingEdge.id
                const newChallengeEndNode = {
                    id: challengeEndId,
                    type: NodeTypes.CHALLENGE_NODE,
                    position: {
                        x: node.position.x + challengeNode.position.x + (node.width || 0) + 50,
                        y: (node.position.y + challengeNode.position.y + (node.height || 0) / 2) + (index === 0 ? 30 : -60)
                    },
                    width: 50,
                    height: 50,
                    parent: challengeNode.id,
                    data: {
                        isStart: false,
                        ...challengeNode.data
                    }
                } as Node
                newNodes.push(newChallengeEndNode)
                const newIncomingEdge = {
                    id: incomingEdgeId,
                    source: node.id,
                    sourceHandle: outgoingEdge?.sourceHandle,
                    target: challengeEndId,
                } as Edge
                newEdges.push(newIncomingEdge)
                const newOutgoingEdge = {
                    id: outgoingEdge?.id,
                    source: challengeEndId,
                    target: outgoingEdge?.target,
                    targetHandle: outgoingEdge?.targetHandle
                } as Edge
                newEdges.push(newOutgoingEdge)
            })
    })

    return {
        nodes: newNodes,
        edges: newEdges
    } as BpmnDto
}

function jsonToPrettyXml(json: any, spacing: string = ""): string {
    // Initialize a variable to store the generated XML code
    let xml = '';

    // Loop through each key in the JSON object
    for (const key in json) {

        // Check if the key is a property of the JSON object
        if (json.hasOwnProperty(key)) {
            // Get the value of the key in the JSON object
            const value = json[key];
            // Add the key as an XML element to the generated XML code
            xml += `${spacing}<${key}`;

            // Loop through each property in the value of the key
            for (const property in value) {
                // Check if the property is a property of the value and not "children"
                if (value.hasOwnProperty(property) && property !== 'children') {
                    // Add the property as an XML attribute to the element
                    xml += ` ${property}="${escapeXml(String(value[property]))}"`;
                }
            }

            // Check if the value has a "children" property
            if (value.children) {
                // If it does, add a closing bracket and a newline character to the element
                xml += '>\n';
                // Check if the value of "children" is a string
                if (typeof value.children === "string") {
                    // If it is, add the string as a text node to the element
                    xml += spacing + "\t" + value.children + "\n"
                } else {
                    // If it's not a string, loop through each child in the "children" array
                    for (const child of value.children) {
                        // Recursively convert the child to XML and add it to the element
                        xml += jsonToPrettyXml(child, spacing + "\t");
                    }
                }
                // Add the closing tag of the element
                xml += `${spacing}</${key}>\n`;
            } else {
                // If the value doesn't have a "children" property, add a closing tag with a forward slash
                xml += ' />\n'
            }
        }
    }

    // Return the generated XML code
    return xml;
}

function escapeXml(unsafe: string): string {
    console.log(unsafe)
    return unsafe.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;');
}

