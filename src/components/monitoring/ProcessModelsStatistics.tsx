'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { ProcessModelInstanceState } from "@/types/database.types";
import AllTasksTable from "@/components/monitoring/AllTasksTable";
import {FlowElementInstanceWithFlowElement} from "@/app/[teamId]/monitoring/page";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export interface ModelStatisticsData {
  id: number;
  name: string;
  instancesAmount: number;
  instanceStates: { name: ProcessModelInstanceState; amount: number }[];
  stepForStepProgress: { step: string; amountInProgress: number; amountCompleted: number, amountBlocked: number }[];
}

export interface ProcessModelsStatisticsProps {
    modelData: ModelStatisticsData[]
    tasksData: FlowElementInstanceWithFlowElement[]
}

function ProcessModelStatisticsDetail({ data, tasksData }: { data: ModelStatisticsData, tasksData: FlowElementInstanceWithFlowElement[] }) {
  return (
    <div className="space-y-6 mt-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Instanzen-Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.instanceStates}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ name, percent }: { name: ProcessModelInstanceState, percent: number }) => {
                      let showName = name.toString()
                      if (name === "Completed") {
                          showName = "Fertig"
                      } else if (name === "Running") {
                          showName = "Läuft gerade"
                      } else if (name === "Error") {
                          showName = "Blockiert"
                      }
                      return`${showName} ${(percent * 100).toFixed(0)}%`
                  }}
                >
                  {data.instanceStates.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Aufgaben-Fortschritt</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.stepForStepProgress} >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="step" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amountInProgress" name="Bereit oder in Bearbeitung" fill="#0088FE" />
                <Bar dataKey="amountCompleted" name="Fertig" fill="#00C49F" />
                <Bar dataKey="amountBlocked" name="Blockiert" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
        <Card className="grid-cols-2 w-full">
            <CardHeader>
                <CardTitle>Alle Aufgaben</CardTitle>
            </CardHeader>
            <CardContent>
                <AllTasksTable data={tasksData.filter(task =>
                    data.id === task.flow_element.model_id
                )} />
            </CardContent>
        </Card>
    </div>
  )
}

export default function ProcessModelsStatistics({ modelData, tasksData }: ProcessModelsStatisticsProps) {
  const [openModells, setOpenModells] = useState<number[]>([])

  const toggleModell = (id: number) => {
    setOpenModells(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    )
  }

  return (
      
      <Card>
        <CardHeader>
          <CardTitle>Prozessmodelle Übersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modelData.map((data: ModelStatisticsData) => (
              <Collapsible 
                key={data.id}
                open={openModells.includes(data.id)}
                onOpenChange={() => toggleModell(data.id)}
              >
                <CollapsibleTrigger className="w-full" asChild>
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer bg-muted rounded-lg hover:bg-muted-foreground/10"
                    aria-label={`${data.name} Details anzeigen oder ausblenden`}
                  >
                    <div>
                      <h3 className="text-lg font-semibold">{data.name}</h3>
                      <p className="text-sm text-muted-foreground">Anzahl Instanzen: {data.instancesAmount}</p>
                    </div>
                    <div className="flex items-center justify-center w-6 h-6">
                      {openModells.includes(data.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ProcessModelStatisticsDetail data={data} tasksData={tasksData} />
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
  )
}