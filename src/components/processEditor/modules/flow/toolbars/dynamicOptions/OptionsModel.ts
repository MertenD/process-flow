export enum OptionsStructureType {
    TEXT = "text",
    INPUT = "input",
    VARIABLE_NAME_INPUT = "VariableNameInput",
    MULTIPLE_VARIABLE_NAME_INPUT = "MultipleVariableNameInput",
    SELECT = "select",
    SELECT_WITH_CUSTOM = "Select with custom",
    TEXTAREA = "textarea",
    CHECKBOX = "checkbox",
    SEPARATOR = "separator",
    ROW = "row",
}

export enum OptionsStructureSpecialValues {
    AVAILABLE_VARIABLES = "{availableVariables}",
    AVAILABLE_ROLES = "{availableRoles}",
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

export interface OptionsText extends OptionsBase {
    text: string
}

export interface OptionsInput extends OptionsBase {
    label: string
    placeholder: string
    suggestions?: string[]
}

export interface OptionsVariableNameInput extends OptionsBase {
    label: string
    placeholder: string
}

export interface OptionsMultipleVariableNameInput extends OptionsBase {
    label: string
    placeholder: string
}

export interface OptionsTextarea extends OptionsBase {
    label: string
    placeholder: string
}

export interface OptionsSelect extends NestedOptionsBase {
    label: string
    defaultValue: string
}

export interface OptionsSelectWithCustom extends OptionsSelect {}

export interface OptionsCheckbox extends NestedOptionsBase {
    label: string
    defaultValue: boolean
}

export interface OptionsSeparator extends StructureOptionBase {
    orientation?: "horizontal" | "vertical"
}

// TODO Label for row?
export interface OptionsRow extends OptionsBase {
    structure: OptionsBase[]
}