import "@/styles/processList.css";
import {createClient} from '@/utils/supabase/server';
import {redirect} from "next/navigation";

export interface ProcessListProps {
    teamId: string;
    selectedProcessId?: string;
}

export default async function ProcessList({ teamId, selectedProcessId }: Readonly<ProcessListProps>) {

    const supabase = createClient();
    const { data: processes } = await supabase
        .from("process_model")
        .select("*")
        .eq("belongs_to", teamId)

    async function handleProcessClick(processId: string) {
        "use server"

        redirect(`/${teamId}/editor/${processId}`)
    }

    return (
        <section className="processList h-full">
            <h2>Process List</h2>
            <div className="flex flex-col space-y-2">
                <form>
                    { processes?.map((process, index) => {
                        return <button
                            key={`${process.id}`}
                            className={`w-full p-4 bg-amber-50 rounded-2 ${selectedProcessId === process.id ? "bg-amber-100" : ""}`}
                            formAction={handleProcessClick.bind(null, process.id)}
                        >
                            {process.name}
                        </button>
                    }) }
                </form>
            </div>
        </section>
    );
}