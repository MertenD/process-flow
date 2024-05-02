"use client"

import "@/styles/processList.css";
import { createClient } from '@/utils/supabase/client';
import {useEffect, useState} from "react";

export interface ProcessListProps {
    teamId: string;
    onProcessModelSelected: (processModelId: string) => void;
}

export default function ProcessList({ teamId, onProcessModelSelected }: Readonly<ProcessListProps>) {

    // TODO Replace any with type from database
    const [processes, setProcesses] = useState<null | any[]>([])

    useEffect(() => {
        const fetchProcesses = async () => {
            const supabase = createClient();
            const { data: processes } = await supabase
                .from("process_model")
                .select("*")
                .eq("belongs_to", teamId)
            setProcesses(processes)
        }

        fetchProcesses().then()
    }, [teamId])

    return (
        <section className="processList">
            <h2>Process List</h2>
            <div className="flex flex-col space-y-2">
                { processes?.map((process, index) => {
                    return <button className="p-4 bg-amber-50 rounded-2xl" key={index} onClick={() => {
                        onProcessModelSelected(process.id)
                    }}>
                        {process.name}
                    </button>
                }) }
            </div>
        </section>
    );
}