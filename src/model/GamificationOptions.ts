import {Enums} from "@/types/database.types";

export interface GamificationOptions {
    value1: string,
    value2: string,
    badgeType: string,
    pointType: Enums<"point_type">,
    comparison: Enums<"comparisons">,
    hasCondition: boolean,
    pointsForSuccess: number,
    pointsApplicationMethod: Enums<"points_application_method">
}