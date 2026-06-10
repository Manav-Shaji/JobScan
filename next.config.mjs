import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
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
    experimental: {
        allowedDevOrigins: ['chalice-helium-rift.ngrok-free.dev'],
        optimizePackageImports: [
            'lucide-react',
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            'date-fns',
            'recharts'
        ],
    },
    images: {
        formats: ['image/avif', 'image/webp'],
    },
};

export default withPWA(nextConfig);
