import {DocsLayout} from 'fumadocs-ui/layouts/docs';
import {ReactNode} from 'react';
import {baseOptions} from '@/app/layout.config';
import {source} from '@/lib/source';
import HomepageNavigation from "@/components/landing/HomepageNavigation";
import ScrollToTop from "@/app/docs/ScrollToTop";

export default function Layout({ children }: { children: ReactNode }) {

    return <div>
        <ScrollToTop />
        <HomepageNavigation/>
        <DocsLayout tree={source.pageTree} {...baseOptions} disableThemeSwitch>
            {children}
        </DocsLayout>
    </div>
}
