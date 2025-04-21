import { getInTeamSource } from '@/lib/source';
import {
    DocsPage,
    DocsBody,
    DocsDescription,
    DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function Page(props: {
    params: Promise<{ slug?: string[], teamId: number }>;
}) {
    const params = await props.params;
    const page = getInTeamSource(params.teamId).getPage(params.slug);
    if (!page) notFound();

    const MDX = page.data.body;

    return (
        <DocsPage toc={page.data.toc} full={page.data.full}>
            <DocsTitle>{page.data.title}</DocsTitle>
            <DocsDescription>{page.data.description}</DocsDescription>
            <DocsBody>
                <MDX components={{ ...defaultMdxComponents }} />
            </DocsBody>
        </DocsPage>
    );
}

export async function generateStaticParams(props: {
    params: { slug?: string[], teamId: number };
}) {
    return getInTeamSource(props.params.teamId).generateParams();
}

export async function generateMetadata(props: {
    params: Promise<{ slug?: string[], teamId: number }>;
}) {
    const params = await props.params;
    const page = getInTeamSource(params.teamId).getPage(params.slug);
    if (!page) notFound();

    return {
        title: page.data.title,
        description: page.data.description,
    };
}
