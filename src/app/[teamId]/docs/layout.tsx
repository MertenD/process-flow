import {DocsLayout} from 'fumadocs-ui/layouts/docs';
import {ReactNode} from 'react';
import {baseOptions} from '@/app/layout.config';
import {getInTeamSource} from '@/lib/source';
import ScrollToTop from "@/app/docs/ScrollToTop";

export default function Layout({ children, params }: { children: ReactNode, params: { teamId: number } }) {

    const source = getInTeamSource(params.teamId);

    return <div>
        <ScrollToTop />
        <DocsLayout tree={source.pageTree} {...baseOptions} disableThemeSwitch sidebar={{
            collapsible: false,
        }}>
            {children}
        </DocsLayout>
    </div>
}
