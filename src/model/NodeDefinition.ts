import {OptionsDefinition} from "@/model/OptionsModel";
import {ExecutionMode} from "@/model/database/database.types";

export interface NodeDefinitionPreview {
    id: number | undefined
    name: string
    shortDescription: string
    executionMode: ExecutionMode
    executionUrl: string
}

export interface NodeDefinition extends NodeDefinitionPreview {
    markdownDocumentation: string
    optionsDefinition: OptionsDefinition
}