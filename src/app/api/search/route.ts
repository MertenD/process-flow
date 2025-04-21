import { landingSource } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export const { GET } = createFromSource(landingSource);