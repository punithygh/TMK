import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// 🚨 Viewport Config
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2563eb",
};

// 🚀 Premium SEO Metadata
export const metadata: Metadata = {
  title: {
    default: "Tumakuru Connect | #1 Local Directory",
    template: "%s | Tumakuru Connect",
  },
  description: "Tumkur's premium business directory, local search engine, and community hub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 🚨 CRITICAL BUG FIX: suppressHydrationWarning ಸೇರಿಸಲಾಗಿದೆ. 
    // ಇದು ಬ್ರೌಸರ್ ಎಕ್ಸ್‌ಟೆನ್ಶನ್‌ಗಳು ಮಾಡುವ ಬದಲಾವಣೆಗಳಿಂದ ಬರುವ ಕ್ರಾಶ್ ಅನ್ನು ತಡೆಯುತ್ತದೆ.
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-grow w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}