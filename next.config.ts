import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 🚨 100% BULLETPROOF EXTERNAL IMAGE WHITELISTING 🚨
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      // 🚀 ಹೊಸದು: Google ಇಮೇಜ್ ಲಿಂಕ್‌ಗಳನ್ನು ಅಲೋ ಮಾಡುವುದು
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      // 🚀 ಹೊಸದು: ನೀವು ಬೇರೆ ಯಾವುದೇ ವೆಬ್‌ಸೈಟ್‌ನ ಲಿಂಕ್ ಹಾಕಿದ್ದರೂ (ಉದಾ: placeholder)
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
      // 🚀 ಹೊಸದು: Cloudinary ಅಥವಾ AWS S3 ಬಳಸಿದ್ದರೆ (ಭವಿಷ್ಯಕ್ಕಾಗಿ)
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