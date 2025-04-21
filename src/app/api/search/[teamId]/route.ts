import { getInTeamSource } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import {NextRequest} from "next/server";

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(
    request: NextRequest,
    context: { params: { teamId: string } }
) {
    const teamId = parseInt(context.params.teamId, 10);
    const source = getInTeamSource(teamId);
    const { GET: originalGet } = createFromSource(source);
    // @ts-ignore
    return originalGet(request, context);
}