import { PointsType } from '@/model/PointsType'
import { Comparisons } from '@/model/Comparisons'
import { PointsApplicationMethod } from '@/model/PointsApplicationMethod'

export interface GamificationOptions {
    value1: string
    value2: string
    badgeType: string
    pointType: PointsType
    comparison: Comparisons
    hasCondition: boolean
    pointsForSuccess: number
    pointsApplicationMethod: PointsApplicationMethod
}
