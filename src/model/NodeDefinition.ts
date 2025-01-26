import {OptionsDefinition} from "@/model/OptionsModel";
import {ExecutionMode} from "@/model/database/database.types";

export interface NodeDefinitionPreview {
    id: number
    name: string
    shortDescription: string
    executionMode: ExecutionMode
}

export interface NodeDefinition extends NodeDefinitionPreview {
    markdownDocumentation: string
    optionsDefinition: OptionsDefinition
}