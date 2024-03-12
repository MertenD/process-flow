import {Edge, Node} from "reactflow";
import {BpmnDto} from "../model/Bpmn";

export function serializeToDto(nodes: Node[], edges: Edge[]): BpmnDto {
    return {
        nodes: nodes,
        edges: edges
    }
}