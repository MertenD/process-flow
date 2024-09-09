import ProcessModelsStatistics, {ModelStatisticsData} from "@/components/ProcessModelsStatistics";
import GeneralMonitoringStatistics, {TrendData} from "@/components/GeneralMonitoringStatistics";
import React from "react";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {
    FlowElement,
    FlowElementInstance,
    ProcessInstance,
    ProcessModel,
    ProcessModelInstanceState
} from "@/types/database.types";

type ProcessInstanceWithFlowElements = Omit<ProcessInstance, 'flow_element_instance'> & {
    flow_element_instance: (FlowElementInstance & { flow_element: (FlowElement & { name: string }) })[]
};

type ProcessModelWithInstances = ProcessModel & {
    process_instance: ProcessInstanceWithFlowElements[];
};

export default async function MonitoringPage({ params }: Readonly<{ params: { teamId: string } }>) {

    const supabase = createClient()
    const {data: userData, error} = await supabase.auth.getUser()
    if (error || !userData.user) {
        redirect("/login")
    }

    const { data: processModels } = await supabase
        .from("process_model")
        .select(`*, process_instance(*, flow_element_instance(*, flow_element(*, name: data->task)))`)
        .eq("belongs_to", params.teamId)
        .returns<ProcessModelWithInstances[]>()

    async function createTrendData(data: ProcessModelWithInstances[] | null, from: Date, to: Date): Promise<TrendData> {

        if (!data) {
            return {};
        }

        const trendDataFromDb: TrendData = {};

        // Erstelle eine Liste aller Daten zwischen from und to
        const dateList: string[] = [];
        for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
            dateList.push(d.toISOString().split("T")[0]);
        }

        for (const model of processModels ?? []) {
            const modelName = model.name;
            if (!trendDataFromDb[modelName]) {
                trendDataFromDb[modelName] = [];
            }

            dateList.forEach(date => {
                trendDataFromDb[modelName].push({ date, started: 0, completed: 0 });
            });

            for (const instance of model.process_instance ?? []) {

                if (new Date(instance.created_at) < from || new Date(instance.created_at) > to ||
                    instance.completed_at && (new Date(instance.completed_at) < from || new Date(instance.completed_at) > to)
                ) {
                    continue;
                }

                const instanceCreationDate = instance.created_at.split("T")[0];
                let dateEntry = trendDataFromDb[modelName].find(data => data.date === instanceCreationDate);

                if (!dateEntry) {
                    dateEntry = { date: instanceCreationDate, started: 0, completed: 0 };
                    trendDataFromDb[modelName].push(dateEntry);
                }

                dateEntry.started += 1;
                if (instance.status === "Completed") {
                    dateEntry.completed += 1;
                }
            }
        }

        return trendDataFromDb;
    }

    function createModelData(data: ProcessModelWithInstances[] | null, from: Date, to: Date): ModelStatisticsData[] {
        if (!data) {
            return [];
        }

        return data.map(model => {
            const instanceStates = model.process_instance.reduce((acc, instance) => {
                //if (new Date(instance.created_at) >= from && new Date(instance.created_at) <= to ||
                //    instance.completed_at && (new Date(instance.completed_at) >= from && new Date(instance.completed_at) <= to)
                //) {
                    const state = instance.status;
                    if (!acc[state]) {
                        acc[state] = 0;
                    }
                    acc[state] += 1;
                //}
                return acc;
            }, {} as { [key: string]: number })

            const stepForStepProgress = model.process_instance.reduce((acc, instance) => {
                //if (new Date(instance.created_at) >= from && new Date(instance.created_at) <= to
                //    && instance.completed_at && (new Date(instance.completed_at) >= from && new Date(instance.completed_at) <= to)
                //) {
                    instance.flow_element_instance.forEach(flowElementInstance => {
                        if (flowElementInstance.flow_element.type === "endNode" ||
                            flowElementInstance.flow_element.type === "startNode" ||
                            flowElementInstance.flow_element.type === "gatewayNode"
                        ) {
                            return acc;
                        }

                        const stepName = flowElementInstance.flow_element.name
                        if (!acc[stepName]) {
                            acc[stepName] = {
                                amountInProgress: 0,
                                amountCompleted: 0,
                                amountBlocked: 0
                            }
                        }

                        if (flowElementInstance.status === "Completed") {
                            acc[stepName].amountCompleted += 1;
                        } else if (flowElementInstance.status === "Created" ||
                            flowElementInstance.status === "In Progress" ||
                            flowElementInstance.status === "Todo"
                        ) {
                            acc[stepName].amountInProgress += 1;
                        } else {
                            acc[stepName].amountBlocked += 1;
                        }
                    });
                //}
                return acc;
            }, {} as { [key: string]: {
                amountInProgress: number;
                amountCompleted: number;
                amountBlocked: number
            } });

            return {
                id: model.id,
                name: model.name,
                instancesAmount: model.process_instance.length,
                instanceStates: Object.entries(instanceStates).map(([name, amount]) => {
                    const typedName: ProcessModelInstanceState = name as ProcessModelInstanceState;
                    return ({ name: typedName, amount })
                }),
                stepForStepProgress: Object.entries(stepForStepProgress).map(([step, amounts]) => ({ step, ...amounts }))
            };
        });
    }

    const dateAgo = new Date();
    dateAgo.setDate(dateAgo.getDate() - 30);
    const trendData = await createTrendData(processModels, dateAgo, new Date());

    const totalInstances = processModels?.reduce((acc, model) => acc + (model.process_instance?.length ?? 0), 0) ?? 0;
    const totalCompleted = processModels?.reduce((acc, model) => acc + (model.process_instance?.filter(instance => instance.status === "Completed").length ?? 0), 0) ?? 0;
    const totalInProgress = processModels?.reduce((acc, model) => acc + (model.process_instance?.filter(instance => instance.status === "Running").length ?? 0), 0) ?? 0;
    const totalOnHold = processModels?.reduce((acc, model) => acc + (model.process_instance?.filter(instance => instance.status === "Error").length ?? 0), 0) ?? 0;

    const modelData = createModelData(processModels, dateAgo, new Date());

    return <div className="flex flex-col p-8 space-y-8">
        <h1 className="text-3xl font-bold">Prozess-Monitoring Dashboard</h1>
        <GeneralMonitoringStatistics
            totalCompleted={totalCompleted}
            totalOnHold={totalOnHold}
            totalInstances={totalInstances}
            totalInProgress={totalInProgress}
            trendData={trendData}
        />
        <ProcessModelsStatistics modelData={modelData}/>
    </div>
}