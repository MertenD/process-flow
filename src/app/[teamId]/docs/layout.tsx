import {DocsLayout} from 'fumadocs-ui/layouts/docs';
import {ReactNode} from 'react';
import {baseOptions} from '@/app/layout.config';
import {getInTeamSource} from '@/lib/source';
import ScrollToTop from "@/app/docs/ScrollToTop";
import {RootProvider} from "fumadocs-ui/provider";

export default function Layout({ children, params }: { children: ReactNode, params: { teamId: number } }) {

    const source = getInTeamSource(params.teamId);

    return <RootProvider
        search={{
            options: {
                api: `/api/search/${params.teamId}`,

            },
        }}
    >
        <ScrollToTop />
        <DocsLayout tree={source.pageTree} {...baseOptions} disableThemeSwitch sidebar={{
            collapsible: false,
        }}>
            {children}
        </DocsLayout>
    </RootProvider>
}
