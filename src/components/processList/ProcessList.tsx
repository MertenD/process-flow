import "@/styles/processList.css";
import { createClient } from '@/utils/supabase/server';

export interface ProcessListProps {
    teamId: string;
}

export default async function ProcessList({ teamId }: ProcessListProps) {

    const supabase = createClient();
    const { data: processes } = await supabase
        .from("process_model")
        .select("*")
        .eq("belongs_to", teamId)

    return (
        <section className="processList">
            <h2>Process List</h2>
            <div className="flex flex-col space-y-2">
                { processes?.map((process, index) => {
                    return <button className="p-4 bg-amber-50 rounded-2xl" key={index}>
                        {process.name}
                    </button>
                }) }
            </div>
        </section>
    );
}