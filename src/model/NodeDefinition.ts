import {OptionsDefinition} from "@/model/OptionsModel";
import {ExecutionMode} from "@/model/database/database.types";

export interface NodeDefinition {
    id: string
    name: string
    shortDescription: string
    markdownDocumentation: string
    executionMode: ExecutionMode
    optionsDefinition: OptionsDefinition
}