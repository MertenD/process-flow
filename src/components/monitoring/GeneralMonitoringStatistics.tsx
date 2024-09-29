'use client'

import React, {useState, useMemo} from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts'

export type TrendData = {
    [key: string]: { date: string; started: number; completed: number }[];
};

export interface GeneralMonitoringStatisticsProps {
    totalInstances: number
    totalCompleted: number
    totalInProgress: number
    totalOnHold: number
    trendData: TrendData
}

export default function GeneralMonitoringStatistics({
    totalInstances,
    totalCompleted,
    totalInProgress,
    totalOnHold,
    trendData
}: GeneralMonitoringStatisticsProps) {

    const [selectedModel, setSelectedModel] = useState<string>('Alle')

    const filteredTrendData = useMemo(() => {
        if (selectedModel === 'Alle') {
            console.log("Alle")
            const combinedData: { date: string, started: number, completed: number }[] = [];
            const dates = Object.values(trendData).flat().map(entry => entry.date);
            const uniqueDates = Array.from(new Set(dates));

            uniqueDates.forEach(date => {
                let startedSum = 0;
                let completedSum = 0;

                Object.values(trendData).forEach(modelData => {
                    const entry = modelData.find(e => e.date === date);
                    if (entry) {
                        startedSum += entry.started;
                        completedSum += entry.completed;
                    }
                });

                combinedData.push({date: date, started: startedSum, completed: completedSum});
            });

            console.log("Combined", combinedData)
            return combinedData;
        } else {
            console.log(selectedModel)
            return trendData[selectedModel as keyof TrendData];
        }
    }, [selectedModel, trendData]);

    return (
        <div className="space-y-8 mb-8">
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gesamtinstanzen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalInstances}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Abgeschlossen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCompleted}</div>
                        <p className="text-xs text-muted-foreground">
                            {((totalCompleted / totalInstances) * 100).toFixed(1)}% der Gesamtinstanzen
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Bearbeitung</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalInProgress}</div>
                        <p className="text-xs text-muted-foreground">
                            {((totalInProgress / totalInstances) * 100).toFixed(1)}% der Gesamtinstanzen
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Blockiert</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOnHold}</div>
                        <p className="text-xs text-muted-foreground">
                            {((totalOnHold / totalInstances) * 100).toFixed(1)}% der Gesamtinstanzen
                        </p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>Trend der Prozessinstanzen</span>
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Wähle ein Prozessmodell"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem key={"all"} value={"Alle"}>
                                    Alle
                                </SelectItem>
                                {Object.keys(trendData).map((model: string) => (
                                    <SelectItem key={model} value={model}>
                                        {model}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={filteredTrendData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="date"/>
                            <YAxis/>
                            <Tooltip/>
                            <Legend/>
                            <Line type="linear" dataKey="started" stroke="#8884d8" name="Gestartete Instanzen"/>
                            <Line type="linear" dataKey="completed" stroke="#82ca9d" name="Abgeschlossene Instanzen"/>
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}