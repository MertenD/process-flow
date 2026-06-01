"use server"

import { prisma } from "@/lib/prisma"
import { NodeDefinition } from "@/model/NodeDefinition"
import {
    OptionsCheckbox,
    OptionsInput, OptionsRow,
    OptionsSelect, OptionsSelectWithCustom,
    OptionsSeparator,
    OptionsStructureSpecialValues,
    OptionsStructureType, OptionsTextarea
} from "@/model/OptionsModel"
import { GamificationType } from "@/model/GamificationType"
import { PointsType } from "@/model/PointsType"
import { PointsApplicationMethod } from "@/model/PointsApplicationMethod"
import { Comparisons } from "@/model/Comparisons"
import { BadgeType } from "@/model/BadgeType"

export default async function getNodeDefinition(nodeDefinitionId: number): Promise<NodeDefinition> {

    const result = await prisma.nodeDefinition.findUnique({
        where: { id: BigInt(nodeDefinitionId) },
        select: { definition: true },
    })

    if (!result) throw new Error("Failed to fetch node definition with id " + nodeDefinitionId)

    const nodeDefinition = result.definition as unknown as NodeDefinition

    nodeDefinition.optionsDefinition.structure = [
        {
            type: OptionsStructureType.INPUT,
            label: "Title",
            placeholder: "Activity title",
            keyString: "task",
        } as OptionsInput,
        {
            type: OptionsStructureType.TEXTAREA,
            label: "Description",
            placeholder: "Activity description",
            keyString: "description",
        } as OptionsTextarea,
        {
            type: OptionsStructureType.SEPARATOR,
        } as OptionsSeparator,
        ...nodeDefinition.optionsDefinition.structure,
    ]

    if (nodeDefinition.executionMode === "Manual") {
        nodeDefinition.optionsDefinition.structure.push(
            { type: OptionsStructureType.SEPARATOR } as OptionsSeparator,
            {
                type: OptionsStructureType.SELECT,
                label: "Assigned role",
                defaultValue: "",
                keyString: "assignedRole",
                options: [{ values: [OptionsStructureSpecialValues.AVAILABLE_ROLES] }],
            } as OptionsSelect
        )

        nodeDefinition.optionsDefinition.structure.push(
            { type: OptionsStructureType.SEPARATOR } as OptionsSeparator,
            {
                type: OptionsStructureType.SELECT,
                label: "Gamification type",
                defaultValue: GamificationType.NONE,
                keyString: "gamificationType",
                options: [
                    { values: [GamificationType.NONE], dependentStructure: [] },
                    {
                        values: [GamificationType.POINTS],
                        dependentStructure: [
                            {
                                type: OptionsStructureType.SELECT,
                                label: "Points type",
                                defaultValue: PointsType.EXPERIENCE,
                                keyString: "gamificationOptions.pointType",
                                options: [{ values: Object.values(PointsType) }],
                            } as OptionsSelect,
                            {
                                type: OptionsStructureType.ROW,
                                structure: [
                                    {
                                        type: OptionsStructureType.SELECT,
                                        label: "Effect",
                                        defaultValue: PointsApplicationMethod.INCREMENT_BY,
                                        keyString: "gamificationOptions.pointsApplicationMethod",
                                        options: [{ values: Object.values(PointsApplicationMethod) }],
                                    } as OptionsSelect,
                                    {
                                        type: OptionsStructureType.INPUT,
                                        label: "Amount",
                                        placeholder: "20",
                                        keyString: "gamificationOptions.pointsForSuccess",
                                    } as OptionsInput,
                                ],
                            } as OptionsRow,
                            { type: OptionsStructureType.SEPARATOR } as OptionsSeparator,
                            {
                                type: OptionsStructureType.CHECKBOX,
                                defaultValue: false,
                                label: "Gamification condition",
                                keyString: "gamificationOptions.hasCondition",
                                options: [{
                                    values: [true],
                                    dependentStructure: [
                                        { type: OptionsStructureType.SELECT_WITH_CUSTOM, label: "Value 1", keyString: "gamificationOptions.value1", options: [{ values: [OptionsStructureSpecialValues.AVAILABLE_VARIABLES] }] } as OptionsSelectWithCustom,
                                        { type: OptionsStructureType.SELECT, label: "Comparison", keyString: "gamificationOptions.comparison", defaultValue: Comparisons.EQUALS, options: [{ values: Object.values(Comparisons) }] } as OptionsSelect,
                                        { type: OptionsStructureType.SELECT_WITH_CUSTOM, label: "Value 2", keyString: "gamificationOptions.value2", options: [{ values: [OptionsStructureSpecialValues.AVAILABLE_VARIABLES] }] } as OptionsSelectWithCustom,
                                    ],
                                }],
                            } as OptionsCheckbox,
                        ],
                    },
                    {
                        values: [GamificationType.BADGES],
                        dependentStructure: [
                            { type: OptionsStructureType.INPUT, label: "Badge type", keyString: "gamificationOptions.badgeType", suggestions: Object.values(BadgeType) } as OptionsInput,
                        ],
                    },
                ],
            } as OptionsSelect
        )
    }

    return nodeDefinition
}
