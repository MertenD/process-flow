export enum OptionsStructureType {
    INPUT = "input",
    SELECT = "select",
    TEXTAREA = "textarea",
    CHECKBOX = "checkbox",
    SEPARATOR = "separator",
    ROW = "row"
}

export interface OptionsDefinition {
    title: string,
    nodeId: string,
    structure: OptionsBase[]
}

export interface OptionsBase {
    type: OptionsStructureType
    defaultValue?: any
    keyString?: string
}

export interface NestedOptionsBase extends OptionsBase {
    options: {
        values: any[],
        dependentStructure?: OptionsBase[]
    }[]
}

export interface StructureOptionBase extends OptionsBase {}

export interface OptionsInput extends OptionsBase {
    label: string
    placeholder: string
    suggestions?: string[]
}

export interface OptionsTextarea extends OptionsBase {
    label: string
    placeholder: string
}

export interface OptionsSelect extends NestedOptionsBase {
    label: string
    defaultValue: string
}

export interface OptionsCheckbox extends NestedOptionsBase {
    label: string
    defaultValue: boolean
}

export interface OptionsSeparator extends StructureOptionBase {
    orientation?: "horizontal" | "vertical"
}

export interface OptionsRow extends OptionsBase {
    structure: OptionsBase[]
}