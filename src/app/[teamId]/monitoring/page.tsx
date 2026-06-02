import ProcessModelsStatistics, { ModelStatisticsData } from "@/components/monitoring/ProcessModelsStatistics"
import GeneralMonitoringStatistics, { TrendData } from "@/components/monitoring/GeneralMonitoringStatistics"
import React from "react"
import { redirect } from "next/navigation"
import { FlowElement, FlowElementInstance, ProcessInstance, ProcessModel, ProcessModelInstanceState } from "@/model/database/database.types"
import { getTranslations } from "next-intl/server"
import { requireSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export type FlowElementInstanceWithFlowElement = FlowElementInstance & { flow_element: FlowElement & { name: string } }

type ProcessInstanceWithFlowElements = Omit<ProcessInstance, 'flow_element_instance'> & {
    flow_element_instance: FlowElementInstanceWithFlowElement[]
}

type ProcessModelWithInstances = ProcessModel & {
    process_instance: ProcessInstanceWithFlowElements[]
}

export default async function MonitoringPage({ params }: Readonly<{ params: Promise<{ teamId: string }> }>) {

    const { teamId: _teamId } = await params
    const teamId = Number(_teamId)

    const t = await getTranslations("monitoring")

    const session = await requireSession().catch(() => null)
    if (!session?.user) redirect("/authenticate")

    const rawModels = await prisma.processModel.findMany({
        where: { belongsTo: BigInt(teamId) },
        include: {
            processInstances: {
                include: {
                    flowElementInstances: {
                        include: { flowElement: true }
                    }
                }
            }
        }
    })

    // Map to the shape expected by components
    const processModels: ProcessModelWithInstances[] = rawModels.map(m => ({
        id: Number(m.id),
        created_at: m.createdAt.toISOString(),
        name: m.name,
        description: m.description,
        created_by: m.createdBy,
        updated_by: m.updatedBy,
        updated_at: m.updatedAt?.toISOString() ?? null,
        belongs_to: Number(m.belongsTo),
        process_instance: m.processInstances.map(pi => ({
            id: Number(pi.id),
            created_at: pi.createdAt.toISOString(),
            process_model_id: Number(pi.processModelId),
            status: pi.status as any,
            completed_at: pi.completedAt?.toISOString() ?? null,
            flow_element_instance: pi.flowElementInstances.map(fei => ({
                id: Number(fei.id),
                created_at: fei.createdAt.toISOString(),
                instance_of: Number(fei.instanceOf),
                status: fei.status as any,
                is_part_of: Number(fei.isPartOf),
                completed_at: fei.completedAt?.toISOString() ?? null,
                completed_by: fei.completedBy,
                status_message: fei.statusMessage,
                flow_element: {
                    ...(fei.flowElement as any),
                    id: Number(fei.flowElement.id),
                    model_id: Number(fei.flowElement.modelId),
                    name: ((fei.flowElement.data as any)?.task as string) ?? ""
                }
            }))
        }))
    }))

    function createTrendData(data: ProcessModelWithInstances[], from: Date, to: Date): TrendData {
        if (!data) return {}
        const trendDataFromDb: TrendData = {}
        const dateList: string[] = []
        for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
            dateList.push(d.toISOString().split("T")[0])
        }
        for (const model of data) {
            const modelName = model.name
            if (!trendDataFromDb[modelName]) trendDataFromDb[modelName] = []
            dateList.forEach(date => trendDataFromDb[modelName].push({ date, started: 0, completed: 0 }))
            for (const instance of model.process_instance ?? []) {
                const instanceCreationDate = instance.created_at.split("T")[0]
                let dateEntry = trendDataFromDb[modelName].find(d => d.date === instanceCreationDate)
                if (!dateEntry) {
                    dateEntry = { date: instanceCreationDate, started: 0, completed: 0 }
                    trendDataFromDb[modelName].push(dateEntry)
                }
                dateEntry.started += 1
                if (instance.status === "Completed") dateEntry.completed += 1
            }
        }
        return trendDataFromDb
    }

    function createModelData(data: ProcessModelWithInstances[]): ModelStatisticsData[] {
        if (!data) return []
        return data.map(model => {
            const instanceStates = model.process_instance.reduce((acc, instance) => {
                const state = instance.status
                acc[state] = (acc[state] || 0) + 1
                return acc
            }, {} as { [key: string]: number })
            const stepForStepProgress = model.process_instance.reduce((acc, instance) => {
                instance.flow_element_instance.forEach(fei => {
                    if (["endNode","startNode","gatewayNode"].includes(fei.flow_element.type)) return
                    const stepName = fei.flow_element.name
                    if (!acc[stepName]) acc[stepName] = { amountInProgress: 0, amountCompleted: 0, amountBlocked: 0 }
                    if (fei.status === "Completed") acc[stepName].amountCompleted += 1
                    else if (["Created","In Progress","Todo"].includes(fei.status)) acc[stepName].amountInProgress += 1
                    else acc[stepName].amountBlocked += 1
                })
                return acc
            }, {} as { [key: string]: { amountInProgress: number; amountCompleted: number; amountBlocked: number } })
            return {
                id: model.id,
                name: model.name,
                instancesAmount: model.process_instance.length,
                instanceStates: Object.entries(instanceStates).map(([name, amount]) => ({ name: name as ProcessModelInstanceState, amount })),
                stepForStepProgress: Object.entries(stepForStepProgress).map(([step, amounts]) => ({ step, ...amounts }))
            }
        })
    }

    const dateAgo = new Date()
    dateAgo.setDate(dateAgo.getDate() - 30)
    const trendData = createTrendData(processModels, dateAgo, new Date())
    const totalInstances = processModels.reduce((acc, m) => acc + m.process_instance.length, 0)
    const totalCompleted = processModels.reduce((acc, m) => acc + m.process_instance.filter(i => i.status === "Completed").length, 0)
    const totalInProgress = processModels.reduce((acc, m) => acc + m.process_instance.filter(i => i.status === "Running").length, 0)
    const totalOnHold = processModels.reduce((acc, m) => acc + m.process_instance.filter(i => i.status === "Error").length, 0)
    const modelData = createModelData(processModels)
    const tasksData = processModels.flatMap(m => m.process_instance).flatMap(i => i.flow_element_instance)

    return <div className="w-full h-full overflow-y-auto">
        <div className="container mx-auto p-4 flex flex-col space-y-6">
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <GeneralMonitoringStatistics
                totalCompleted={totalCompleted}
                totalOnHold={totalOnHold}
                totalInstances={totalInstances}
                totalInProgress={totalInProgress}
                trendData={trendData}
            />
            <ProcessModelsStatistics modelData={modelData} tasksData={tasksData as any}/>
        </div>
    </div>
}
