import "@/styles/processList.css";
import { createClient } from '@/utils/supabase/server';

export default async function ProcessList() {

    const supabase = createClient();
    const { data: roles } = await supabase.from("role").select();

    return (
        <section className="processList">
            <h2>Process List</h2>
            <ul>
                <li className="processListItem">{JSON.stringify(roles, null, 2)}</li>
                <li className="processListItem">Process 2</li>
                <li className="processListItem">Process 3</li>
                <li className="processListItem">Process 4</li>
                <li className="processListItem">Process 5</li>
            </ul>
        </section>
    );
}