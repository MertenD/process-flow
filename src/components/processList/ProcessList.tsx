import "@/styles/processList.css";
import {createClient} from '@/utils/supabase/server';
import {redirect} from "next/navigation";
import CreateProcessButton from "@/components/processList/CreateProcessButton";

export interface ProcessListProps {
    userId: string;
    teamId: string;
    selectedProcessId?: string;
}

export default async function ProcessList({ userId, teamId, selectedProcessId }: Readonly<ProcessListProps>) {

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
        <section className="processList flex flex-col h-full">
            <h2>Process List</h2>
            <div className="flex flex-col flex-1 space-y-2">
                <form>
                    { processes?.map((process, index) => {
                        return <button
                            key={`${process.id}`}
                            className={`w-full p-4 bg-amber-50 rounded-xl ${selectedProcessId?.toString() === process.id.toString() ? "bg-green-100" : ""}`}
                            formAction={handleProcessClick.bind(null, process.id)}
                        >
                            {process.name}
                        </button>
                    }) }
                </form>
            </div>
            <CreateProcessButton teamId={teamId} userId={userId} />
        </section>
    );
}