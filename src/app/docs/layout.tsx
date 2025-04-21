import {DocsLayout} from 'fumadocs-ui/layouts/docs';
import {ReactNode} from 'react';
import {baseOptions} from '@/app/layout.config';
import {landingSource} from '@/lib/source';
import HomepageNavigation from "@/components/landing/HomepageNavigation";
import ScrollToTop from "@/app/docs/ScrollToTop";
import {RootProvider} from "fumadocs-ui/provider";

export default function Layout({ children }: { children: ReactNode }) {

    return <RootProvider>
        <ScrollToTop />
        <HomepageNavigation/>
        <DocsLayout tree={landingSource.pageTree} {...baseOptions} disableThemeSwitch>
            {children}
        </DocsLayout>
    </RootProvider>
}
