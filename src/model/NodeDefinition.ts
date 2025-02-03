import {OptionsDefinition} from "@/model/OptionsModel";
import {ExecutionMode} from "@/model/database/database.types";
import {IconName} from "@/components/DynamicIcon";

export interface NodeDefinitionPreview {
    id: number | undefined
    name: string
    icon: IconName | undefined
    shortDescription: string
    executionMode: ExecutionMode
    executionUrl: string
}

export interface NodeDefinition extends NodeDefinitionPreview {
    markdownDocumentation: string
    optionsDefinition: OptionsDefinition
}