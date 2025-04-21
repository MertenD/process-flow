import { docs, meta } from '@/../.source';
import { createMDXSource } from 'fumadocs-mdx';
import { loader } from 'fumadocs-core/source';

export const landingSource = loader({
    baseUrl: '/docs',
    source: createMDXSource(docs, meta)
});

export function getInTeamSource(teamId: number) {
    return loader({
        baseUrl: `/${teamId}/docs`,
        source: createMDXSource(docs, meta),
    });
}