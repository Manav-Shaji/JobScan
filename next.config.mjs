import bundleAnalyzer from '@next/bundle-analyzer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    outputFileTracingRoot: __dirname,
    async redirects() {
        return [
            { source: '/login', destination: '/auth', permanent: true },
            { source: '/auth/login', destination: '/auth', permanent: true },
            { source: '/auth/register', destination: '/auth?mode=signup', permanent: true },
        ];
    },
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" }, // Extension origins vary, '*' is easiest or explicit matching if cookies are needed
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
                ]
            },
            {
                source: "/(.*)",
                headers: [
                    { key: "X-DNS-Prefetch-Control", value: "on" },
                    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
                    { key: "X-Frame-Options", value: "SAMEORIGIN" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "Referrer-Policy", value: "origin-when-cross-origin" },
                    { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https:;" }
                ]
            }
        ];
    },
    experimental: {
        reactCompiler: true,
        optimizePackageImports: [
            'lucide-react',
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast'
        ],
    },
    images: {
        formats: ['image/avif', 'image/webp'],
    },
};

export default withBundleAnalyzer(nextConfig);
