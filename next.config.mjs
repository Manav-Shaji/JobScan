import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  exclude: [
    /^\/api\/auth\/.*$/i,
    /^\/auth/i,
    /^\/app/i,
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
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
            }
        ];
    },
    experimental: {
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

export default withSerwist(nextConfig);
