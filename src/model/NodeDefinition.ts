import {OptionsDefinition} from "@/model/OptionsModel";
import {ExecutionMode} from "@/model/database/database.types";

export interface NodeDefinition {
    name: string
    shortDescription: string
    markdownDescription: string
    executionMode: ExecutionMode
    optionsDefinition: OptionsDefinition
}