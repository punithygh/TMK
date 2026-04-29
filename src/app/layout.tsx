import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";

// Components
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// 🚨 ಅತಿ ಮುಖ್ಯ: LanguageProvider ಇಂಪೋರ್ಟ್ ಮಾಡುವುದು ಕಡ್ಡಾಯ 🚨
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-montserrat",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#050b14",
};

export const metadata: Metadata = {
  title: {
    default: "Tumkurconnect | #1 Local Directory & Search",
    template: "%s | Tumkurconnect",
  },
  description: "Tumkurconnect is Tumkur's #1 local directory. Search for the best businesses, hotels, hospitals, real estate, and local services.",
  keywords: ["Tumkurconnect", "Tumkur business directory", "Tumkur local services", "best businesses in Tumkur"],
  alternates: {
    canonical: "https://www.tumakuruconnect.com",
    languages: {
      "en": "https://www.tumakuruconnect.com?lang=en",
      "kn": "https://www.tumakuruconnect.com?lang=kn",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kn" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${montserrat.variable} font-sans antialiased bg-white text-gray-900 dark:bg-[#050b14] dark:text-white min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* 🚨 CRITICAL FIX: ಇಡೀ ಆ್ಯಪ್ ಅನ್ನು LanguageProvider ಒಳಗೆ ಹಾಕಲೇಬೇಕು 🚨 */}
          <AuthProvider>
            <LanguageProvider>
              
              <Navbar />
              
              <main className="flex-grow w-full pt-[75px] md:pt-[85px] pb-16 md:pb-0">
                {children}
              </main>
              
              <Footer />
              
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
        
        {/* PWA Service Worker Registration - FIXED FOR LOCAL DEV */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                  // 🚨 CRITICAL FIX: UNREGISTER Service Worker in local dev to prevent 404 cache chunk errors!
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for(let registration of registrations) {
                      registration.unregister();
                      console.log('ServiceWorker unregistered for local development');
                    }
                  });
                } else {
                  // Register normally in production
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('SW registration failed: ', err);
                  });
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}