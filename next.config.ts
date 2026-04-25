import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // 🚨 100% BULLETPROOF EXTERNAL IMAGE WHITELISTING 🚨
    remotePatterns: [
      // 🚀 Supabase Storage — S3-compatible endpoint (ನಿಮ್ಮ ಬ್ಯುಸಿನೆಸ್ ಇಮೇಜ್‌ಗಳಿಗಾಗಿ)
      {
        protocol: "https",
        hostname: "yddhgsviyqmkxpnflpnu.supabase.co",
        port: "",
        pathname: "/storage/v1/s3/**",
      },
      // 🚀 Supabase Storage — Legacy storage endpoint
      {
        protocol: "https",
        hostname: "yddhgsviyqmkxpnflpnu.storage.supabase.co",
        port: "",
        pathname: "/**",
      },
      // ಲೋಕಲ್ ಸರ್ವರ್ ಸೆಟ್ಟಿಂಗ್ಸ್
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "10.135.87.238",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
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
};

export default nextConfig;