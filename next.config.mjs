import createNextIntlPlugin from 'next-intl/plugin';
import { createMDX } from 'fumadocs-mdx/next';

const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
};

export default withNextIntl(
    withMDX(
        nextConfig
    )
);