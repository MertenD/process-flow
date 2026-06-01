import createNextIntlPlugin from 'next-intl/plugin';
import { createMDX } from 'fumadocs-mdx/next';

const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    serverExternalPackages: ['@prisma/client', 'prisma'],
    images: {
        domains: ['skillicons.dev'],
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            const originalEntry = config.externals
            config.externals = [
                ...(Array.isArray(originalEntry) ? originalEntry : [originalEntry]).filter(Boolean),
                ({ request }, callback) => {
                    if (request && (request.startsWith('better-auth') || request.startsWith('@better-auth'))) {
                        return callback(null, `commonjs ${request}`)
                    }
                    callback()
                },
            ]
        }
        return config
    },
};

export default withNextIntl(
    withMDX(
        nextConfig
    )
);