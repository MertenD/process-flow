import {Edge, Node} from "reactflow";

export type BpmnDto = {
    nodes: Node[],
    edges: Edge[]
}

export function mergeBpmnDto(bpmnDtos: BpmnDto[]): BpmnDto {
    return {
        nodes: bpmnDtos.flatMap((bpmnDto: BpmnDto) => bpmnDto.nodes),
        edges: bpmnDtos.flatMap((bpmnDto: BpmnDto) => bpmnDto.edges)
    } as BpmnDto
}