"use server"

import {NodeDefinition} from "@/model/NodeDefinition";
import {
    OptionsCheckbox,
    OptionsInput, OptionsRow,
    OptionsSelect, OptionsSelectWithCustom,
    OptionsSeparator,
    OptionsStructureSpecialValues,
    OptionsStructureType, OptionsTextarea
} from "@/model/OptionsModel";
import {GamificationType} from "@/model/GamificationType";
import {PointsType} from "@/model/PointsType";
import {PointsApplicationMethod} from "@/model/PointsApplicationMethod";
import {Comparisons} from "@/model/Comparisons";
import {BadgeType} from "@/model/BadgeType";
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export default async function getNodeDefinition(nodeDefinitionId: number): Promise<NodeDefinition> {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: result, error } = await supabase
        .from("node_definition")
        .select("definition")
        .eq("id", nodeDefinitionId)
        .single<{ definition: NodeDefinition }>()

    if (error || !result) {
        throw new Error("Failed to fetch node definition with id 1")
    }

    const nodeDefinition = result.definition

    nodeDefinition.optionsDefinition.structure = [
        {
            type: OptionsStructureType.INPUT,
            label: "Title",
            placeholder: "Activity title",
            keyString: "task"
        } as OptionsInput,
        {
            type: OptionsStructureType.TEXTAREA,
            label: "Description",
            placeholder: "Activity description",
            keyString: "description"
        } as OptionsTextarea,
        {
            type: OptionsStructureType.SEPARATOR,
        } as OptionsSeparator,
        ...nodeDefinition.optionsDefinition.structure
    ]

    if (nodeDefinition.executionMode === "Manual") {
        // Add role selection for manual nodes
        nodeDefinition.optionsDefinition.structure.push(
            {
                type: OptionsStructureType.SEPARATOR
            } as OptionsSeparator,
            {
                type: OptionsStructureType.SELECT,
                label: "Assigned role",
                defaultValue: "",
                keyString: "assignedRole",
                options: [ { values: [ OptionsStructureSpecialValues.AVAILABLE_ROLES ] } ]
            } as OptionsSelect
        )

        // Add gamification options for manual nodes
        nodeDefinition.optionsDefinition.structure.push(
            {
                type: OptionsStructureType.SEPARATOR
            } as OptionsSeparator,
            {
                type: OptionsStructureType.SELECT,
                label: "Gamification type",
                defaultValue: GamificationType.NONE,
                keyString: "gamificationType",
                options: [
                    {
                        values: [GamificationType.NONE],
                        dependentStructure: []
                    },
                    {
                        values: [GamificationType.POINTS],
                        dependentStructure: [
                            {
                                type: OptionsStructureType.SELECT,
                                label: "Points type",
                                defaultValue: PointsType.EXPERIENCE,
                                keyString: "gamificationOptions.pointType",
                                options: [
                                    { values: Object.values(PointsType) }
                                ]
                            } as OptionsSelect,
                            {
                                type: OptionsStructureType.ROW,
                                structure: [
                                    {
                                        type: OptionsStructureType.SELECT,
                                        label: "Effect",
                                        defaultValue: PointsApplicationMethod.INCREMENT_BY,
                                        keyString: "gamificationOptions.pointsApplicationMethod",
                                        options: [
                                            { values: Object.values(PointsApplicationMethod) }
                                        ]
                                    } as OptionsSelect,
                                    {
                                        type: OptionsStructureType.INPUT,
                                        label: "Amount",
                                        placeholder: "20",
                                        keyString: "gamificationOptions.pointsForSuccess"
                                    } as OptionsInput
                                ]
                            } as OptionsRow,
                            {
                                type: OptionsStructureType.SEPARATOR
                            } as OptionsSeparator,
                            {
                                type: OptionsStructureType.CHECKBOX,
                                defaultValue: false,
                                label: "Gamification condition",
                                keyString: "gamificationOptions.hasCondition",
                                options: [
                                    {
                                        values: [true],
                                        dependentStructure: [
                                            {
                                                type: OptionsStructureType.SELECT_WITH_CUSTOM,
                                                label: "Value 1",
                                                keyString: "gamificationOptions.value1",
                                                options: [ { values: [ OptionsStructureSpecialValues.AVAILABLE_VARIABLES ] } ]
                                            } as OptionsSelectWithCustom,
                                            {
                                                type: OptionsStructureType.SELECT,
                                                label: "Comparison",
                                                keyString: "gamificationOptions.comparison",
                                                defaultValue: Comparisons.EQUALS,
                                                options: [ { values: Object.values(Comparisons) } ]
                                            } as OptionsSelect,
                                            {
                                                type: OptionsStructureType.SELECT_WITH_CUSTOM,
                                                label: "Value 2",
                                                keyString: "gamificationOptions.value2",
                                                options: [ { values: [ OptionsStructureSpecialValues.AVAILABLE_VARIABLES ] } ]
                                            } as OptionsSelectWithCustom
                                        ]
                                    }
                                ]
                            } as OptionsCheckbox,
                        ]
                    },
                    {
                        values: [GamificationType.BADGES],
                        dependentStructure: [
                            {
                                type: OptionsStructureType.INPUT,
                                label: "Badge type",
                                keyString: "gamificationOptions.badgeType",
                                suggestions: Object.values(BadgeType),
                            } as OptionsInput
                        ]
                    }
                ]
            } as OptionsSelect
        )
    }

    return nodeDefinition
}