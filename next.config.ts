import type { NextConfig } from "next";

// 🚀 TOP-LEVEL ENTERPRISE TRICK: Force IPv4 DNS Resolution
// This PERMANENTLY fixes the "UND_ERR_CONNECT_TIMEOUT" on Windows!
// Node.js 18+ tries IPv6 first by default, which can cause issues.
// This forces it to use IPv4 immediately.
import dns from "dns";
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); // Bypass Jio/Airtel DNS blocking in India
dns.setDefaultResultOrder('ipv4first');

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Responsive breakpoints — matches card (400), gallery (800), hero (1200) contexts
    deviceSizes: [400, 640, 750, 828, 1080, 1200, 1920],
    imageSizes:  [16, 32, 48, 64, 96, 128, 256, 400],
    // 🚨 100% BULLETPROOF EXTERNAL IMAGE WHITELISTING 🚨
    remotePatterns: [
      // ✅ 0. Cloudinary Storage (Enterprise Image Hosting)
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      // ಲೋಕಲ್ ಸರ್ವರ್ ಸೆಟ್ಟಿಂಗ್ಸ್
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "10.135.87.238",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      // ಇತರ ಎಕ್ಸ್‌ಟರ್ನಲ್ ಹೋಸ್ಟ್‌ಗಳು
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      }
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            // 🚨 BFCache Fix: Override dynamic Next.js and Django no-store headers
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/django-api/:path*',
        destination: 'http://127.0.0.1:8000/api/v1/:path*/', // Proxy API to Django directly with trailing slash appended
      },
      {
        source: '/media/:path*',
        destination: 'http://127.0.0.1:8000/media/:path*', // Proxy Media files to Django
      }
    ];
  },
};

export default nextConfig;