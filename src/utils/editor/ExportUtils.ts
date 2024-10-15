"use client"

import {Edge, Node} from "reactflow";
import {BpmnDto} from "@/model/Bpmn";
import {NodeTypes} from "@/model/NodeTypes";
import {ActivityNodeData} from "@/components/processEditor/nodes/ActivityNode";
import {GatewayNodeData} from "@/components/processEditor/nodes/GatewayNode";

export const onExport = (
    nodes: Node[],
    edges: Edge[],
    getNodeById: (nodeId: string) => Node | null
) => {

    const transformedBpmn = {
        nodes: nodes,
        edges: edges
    } as BpmnDto

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
                                    case NodeTypes.GATEWAY_NODE:
                                        return createGatewayNode(node, transformedBpmn.edges)
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
                                                                x: node.parentId !== undefined ? node.position.x + (getNodeById(node.parentId)?.position.x || 0) : node.position.x,
                                                                y: node.parentId !== undefined ? node.position.y + (getNodeById(node.parentId)?.position.y || 0) : node.position.y,
                                                                width: node.width,
                                                                height: node.height
                                                            }
                                                        }
                                                    ]
                                                }
                                            })
                                            switch (node.type as NodeTypes) {
                                                case NodeTypes.ACTIVITY_NODE:
                                                    shapes.push({
                                                        "bpmndi:BPMNShape": {
                                                            id: "DataObjectReference_" + node.id.replaceAll("-", "") + "_di",
                                                            bpmnElement: "DataObjectReference_" + node.id.replaceAll("-", ""),
                                                            children: [
                                                                {
                                                                    "dc:Bounds": {
                                                                        x: node.parentId !== undefined ? node.position.x + 10 + (getNodeById(node.parentId)?.position.x || 0) : node.position.x + 10,
                                                                        y: node.parentId !== undefined ? node.position.y - 150 + (getNodeById(node.parentId)?.position.y || 0) : node.position.y - 150,
                                                                        width: 40,
                                                                        height: 60
                                                                    }
                                                                },
                                                                {
                                                                    "bpmndi:BPMNLabel": {
                                                                        children: [
                                                                            {
                                                                                "dc:Bounds": {
                                                                                    x: node.parentId !== undefined ? node.position.x + 50 + (getNodeById(node.parentId)?.position.x || 0) : node.position.x + 50,
                                                                                    y: node.parentId !== undefined ? node.position.y - 150 + (getNodeById(node.parentId)?.position.y || 0) : node.position.y - 150,
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
                                                                        x: node.parentId !== undefined ? node.position.x + 30 + (getNodeById(node.parentId)?.position.x || 0) : node.position.x + 30,
                                                                        y: node.parentId !== undefined ? node.position.y - 90 + (getNodeById(node.parentId)?.position.y || 0) : node.position.y - 90
                                                                    }
                                                                },
                                                                {
                                                                    "di:waypoint": {
                                                                        x: node.parentId !== undefined ? node.position.x + 30 + (getNodeById(node.parentId)?.position.x || 0) : node.position.x + 30,
                                                                        y: node.parentId !== undefined ? node.position.y + (getNodeById(node.parentId)?.position.y || 0) : node.position.y
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

