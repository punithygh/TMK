import type { Metadata, Viewport } from "next";
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
    default: "Tumakuru Connect | #1 Local Directory & Search",
    template: "%s | Tumakuru Connect",
  },
  description: "Tumakuru Connect is Tumkur's #1 local directory. Search for the best businesses, hotels, hospitals, real estate, and local services.",
  keywords: ["Tumakuru Connect", "Tumkur business directory", "Tumakuru local services", "best businesses in Tumakuru"],
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
        className={`${poppins.variable} ${montserrat.variable} font-sans antialiased bg-slate-50 text-slate-900 dark:bg-[#050b14] dark:text-white min-h-screen flex flex-col`}
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
      </body>
    </html>
  );
}