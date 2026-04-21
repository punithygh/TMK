"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Hexagon, 
  Facebook, 
  Instagram, 
  Youtube, 
  Heart, 
  Home, 
  Layers, 
  PlusCircle, 
  User 
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  // ಭವಿಷ್ಯದಲ್ಲಿ Context/Cookie ಇಂದ ಭಾಷೆಯನ್ನು ಪಡೆಯಬಹುದು. ಸದ್ಯಕ್ಕೆ 'kn' ಡಿಫಾಲ್ಟ್.
  const [lang, setLang] = useState<"kn" | "en">("kn");
  const [isAuth, setIsAuth] = useState(false); // Auth ಸ್ಟೇಟ್ (ಡೆಮೊ)

  // 🚨 1. SEO Links Data (For clean mapping)
  const categoryLinks = [
    { labelKn: "ಹೋಟೆಲ್‌ಗಳು", labelEn: "Hotels", query: "Hotel" },
    { labelKn: "ಆಸ್ಪತ್ರೆಗಳು", labelEn: "Hospitals", query: "Hospital" },
    { labelKn: "ರೆಸ್ಟೋರೆಂಟ್‌ಗಳು", labelEn: "Restaurants", query: "Restaurant" },
    { labelKn: "ಪಿಜಿ (PGs)", labelEn: "PGs", query: "PG" },
    { labelKn: "ಪ್ಲಂಬರ್‌ಗಳು", labelEn: "Plumbers", query: "Plumber" },
    { labelKn: "ಎಲೆಕ್ಟ್ರಿಷಿಯನ್", labelEn: "Electricians", query: "Electrician" },
    { labelKn: "ಕಲ್ಯಾಣ ಮಂಟಪಗಳು", labelEn: "Wedding Planners", query: "Wedding" },
    { labelKn: "ರಿಯಲ್ ಎಸ್ಟೇಟ್", labelEn: "Real Estate", query: "Real Estate" },
    { labelKn: "ಕಾರು ಬಾಡಿಗೆ", labelEn: "Car Rentals", query: "Car" },
    { labelKn: "ಬ್ಯೂಟಿ ಪಾರ್ಲರ್", labelEn: "Beauty Parlors", query: "Beauty" },
    { labelKn: "ಜಿಮ್ ಮತ್ತು ಫಿಟ್‌ನೆಸ್", labelEn: "Gym & Fitness", query: "Gym" },
  ];

  const areaLinks = [
    { labelKn: "ಸಿದ್ದಗಂಗಾ ಎಕ್ಸ್‌ಟೆನ್ಶನ್", labelEn: "Siddaganga Extension", query: "Siddaganga" },
    { labelKn: "ಸರಸ್ವತಿಪುರಂ", labelEn: "Saraswathipuram", query: "Saraswathipuram" },
    { labelKn: "ಬಟವಾಡಿ", labelEn: "Batawadi", query: "Batawadi" },
    { labelKn: "ಅಶೋಕ ನಗರ", labelEn: "Ashok Nagar", query: "Ashok Nagar" },
    { labelKn: "ಕ್ಯಾತಸಂದ್ರ", labelEn: "Kyathsandra", query: "Kyathsandra" },
    { labelKn: "ಎಸ್.ಎಸ್. ಪುರಂ", labelEn: "S.S. Puram", query: "S.S. Puram" },
    { labelKn: "ಗುಬ್ಬಿ", labelEn: "Gubbi", query: "Gubbi" },
    { labelKn: "ಮಧುಗಿರಿ", labelEn: "Madhugiri", query: "Madhugiri" },
    { labelKn: "ಸಿರಾ ರಸ್ತೆ", labelEn: "Sira Road", query: "Sira Road" },
    { labelKn: "ಬಿ.ಎಚ್ ರಸ್ತೆ", labelEn: "B.H Road", query: "B.H Road" },
    { labelKn: "ಕುವೆಂಪುನಗರ", labelEn: "Kuvenpunagar", query: "Kuvenpunagar" },
    { labelKn: "ಸದಾಶಿವನಗರ", labelEn: "Sadashivanagar", query: "Sadashivanagar" },
  ];

  return (
    <>
      <div className="w-full mt-auto">
        {/* ====== 1. SEO FOOTER (Dark Background) ====== */}
        <div className="bg-[#02060f] border-t border-slate-800 py-10 px-4 sm:px-6">
          <div className="max-w-[1300px] mx-auto flex flex-col gap-8">
            
            {/* Categories */}
            <div>
              <h4 className="text-white text-[13px] md:text-sm mb-3 md:mb-4 uppercase font-bold tracking-wider text-center md:text-left w-full">
                {lang === "kn" ? "ತುಮಕೂರಿನ ಕ್ಯಾಟಗರಿಗಳನ್ನು ಅನ್ವೇಷಿಸಿ" : "Explore Tumkur Categories"}
              </h4>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-3 gap-y-2 md:gap-y-3">
                {categoryLinks.map((link, idx) => (
                  <Link 
                    key={`cat-${idx}`} 
                    href={`/listings?q=${link.query}`}
                    className={`text-slate-400 text-[11px] md:text-xs hover:text-sky-400 transition-colors ${idx !== categoryLinks.length - 1 ? "md:border-r md:border-slate-700 md:pr-3" : ""}`}
                  >
                    {lang === "kn" ? link.labelKn : link.labelEn}
                  </Link>
                ))}
              </div>
            </div>

            {/* Areas */}
            <div>
              <h4 className="text-white text-[13px] md:text-sm mb-3 md:mb-4 uppercase font-bold tracking-wider text-center md:text-left w-full">
                {lang === "kn" ? "ತುಮಕೂರಿನ ಪ್ರಸಿದ್ಧ ಪ್ರದೇಶಗಳು" : "Popular Areas in Tumkur"}
              </h4>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-3 gap-y-2 md:gap-y-3">
                {areaLinks.map((link, idx) => (
                  <Link 
                    key={`area-${idx}`} 
                    href={`/listings?q=${link.query}`}
                    className={`text-slate-400 text-[11px] md:text-xs hover:text-sky-400 transition-colors ${idx !== areaLinks.length - 1 ? "md:border-r md:border-slate-700 md:pr-3" : ""}`}
                  >
                    {lang === "kn" ? link.labelKn : link.labelEn}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ====== 2. MAIN FOOTER (Slightly Lighter Background) ====== */}
        <footer className="bg-slate-900 pt-10 pb-5 px-4 sm:px-6">
          <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row flex-wrap gap-10 justify-between items-center md:items-start">
            
            {/* Brand Column */}
            <div className="flex-1 min-w-[250px] flex flex-col items-center md:items-start w-full">
              <Link href="/" className="flex items-center gap-3 mb-4 no-underline group">
                <div className="bg-gradient-to-br from-sky-500 to-sky-400 w-[26px] md:w-8 h-[26px] md:h-8 rounded-lg flex items-center justify-center shrink-0">
                  <Hexagon className="text-white w-4 md:w-5 h-4 md:h-5 fill-white/20" />
                </div>
                <div className="font-extrabold text-[18px] md:text-xl text-white tracking-tight uppercase whitespace-nowrap">
                  TUMAKURU<span className="text-sky-400">CONNECT</span>
                </div>
              </Link>
              
              <p className="text-slate-400 text-[12px] md:text-[13px] leading-relaxed mb-4 text-center md:text-left max-w-[95%] md:max-w-sm">
                {lang === "kn" 
                  ? "ನಮ್ಮ ತುಮಕೂರಿನ ಸಮಗ್ರ ಮಾಹಿತಿ, ವ್ಯಾಪಾರ ಮತ್ತು ಸೇವೆಗಳ ಅತಿದೊಡ್ಡ ಡಿಜಿಟಲ್ ಡೈರೆಕ್ಟರಿ. ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಎಲ್ಲವನ್ನೂ ಹುಡುಕಿ, ಸಂಪರ್ಕಿಸಿ!" 
                  : "Namma Tumkur's largest digital directory for businesses, services, and local information. Find and connect with just one click!"}
              </p>
              
              <div className="flex gap-6 justify-center md:justify-start">
                <a href="https://www.facebook.com/TumakuruConnect" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white hover:-translate-y-1 transition-all duration-300">
                  <Facebook className="w-6 h-6 text-[#1877F2]" />
                </a>
                <a href="https://www.instagram.com/tumakuru_connect" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white hover:-translate-y-1 transition-all duration-300">
                  {/* Instagram gradient icon placeholder using lucide */}
                  <Instagram className="w-6 h-6 text-[#E1306C]" />
                </a>
                <a href="https://youtube.com/@foodiegeeks23" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white hover:-translate-y-1 transition-all duration-300">
                  <Youtube className="w-6 h-6 text-[#FF0000]" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex-1 min-w-[150px] flex flex-col items-center md:items-start w-full">
              <h3 className="text-[13px] md:text-sm text-white font-bold uppercase tracking-wider mb-3 md:mb-4">
                {lang === "kn" ? "ಕ್ವಿಕ್ ಲಿಂಕ್ಸ್" : "Quick Links"}
              </h3>
              <ul className="flex flex-col gap-2 md:gap-3 items-center md:items-start">
                <li><Link href="/about" className="text-slate-400 text-xs md:text-[13px] hover:text-sky-400 transition-colors">{lang === "kn" ? "ನಮ್ಮ ಬಗ್ಗೆ" : "About Us"}</Link></li>
                <li><Link href="/contact" className="text-slate-400 text-xs md:text-[13px] hover:text-sky-400 transition-colors">{lang === "kn" ? "ಸಂಪರ್ಕಿಸಿ" : "Contact Us"}</Link></li>
                <li><Link href="/free-listing" className="text-slate-400 text-xs md:text-[13px] hover:text-sky-400 transition-colors">{lang === "kn" ? "ಉಚಿತ ಲಿಸ್ಟಿಂಗ್" : "Free Listing"}</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="flex-1 min-w-[150px] flex flex-col items-center md:items-start w-full">
              <h3 className="text-[13px] md:text-sm text-white font-bold uppercase tracking-wider mb-3 md:mb-4">
                {lang === "kn" ? "ಕಾನೂನು" : "Legal"}
              </h3>
              <ul className="flex flex-col gap-2 md:gap-3 items-center md:items-start">
                <li><Link href="/privacy" className="text-slate-400 text-xs md:text-[13px] hover:text-sky-400 transition-colors">{lang === "kn" ? "ಗೌಪ್ಯತೆ ನೀತಿ" : "Privacy Policy"}</Link></li>
                <li><Link href="/terms" className="text-slate-400 text-xs md:text-[13px] hover:text-sky-400 transition-colors">{lang === "kn" ? "ಸೇವಾ ನಿಯಮಗಳು" : "Terms of Service"}</Link></li>
              </ul>
            </div>

          </div>

          {/* Copyright */}
          <div className="max-w-[1300px] mx-auto mt-6 md:mt-8 pt-4 border-t border-slate-800 flex justify-center items-center gap-1 text-[11px] md:text-sm text-slate-500 whitespace-nowrap pb-16 md:pb-0">
            &copy; 2026 Tumakuru Connect. Designed with <Heart className="w-3 h-3 md:w-4 md:h-4 text-red-500 fill-red-500" /> for Tumkur.
          </div>
        </footer>
      </div>

      {/* ====== 3. MOBILE BOTTOM NAVIGATION (App-like sticky bar) ====== */}
      {/* 🚨 md:hidden ensures it completely disappears on desktop */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#050b14]/98 backdrop-blur-md border-t border-slate-800 z-[9999] flex justify-around items-center pt-2 pb-safe-bottom shadow-[0_-4px_15px_rgba(0,0,0,0.5)]">
        <Link href="/" className={`flex flex-col items-center justify-center gap-1 text-[10px] w-16 ${pathname === '/' ? 'text-sky-400' : 'text-slate-400 hover:text-sky-400'}`}>
          <Home className="w-5 h-5" />
          <span>{lang === "kn" ? "ಮುಖಪುಟ" : "Home"}</span>
        </Link>
        <Link href="/categories" className={`flex flex-col items-center justify-center gap-1 text-[10px] w-16 ${pathname.startsWith('/categories') ? 'text-sky-400' : 'text-slate-400 hover:text-sky-400'}`}>
          <Layers className="w-5 h-5" />
          <span>{lang === "kn" ? "ವರ್ಗಗಳು" : "Categories"}</span>
        </Link>
        <Link href="/free-listing" className={`flex flex-col items-center justify-center gap-1 text-[10px] w-16 ${pathname === '/free-listing' ? 'text-sky-400' : 'text-slate-400 hover:text-sky-400'}`}>
          <PlusCircle className="w-5 h-5" />
          <span>{lang === "kn" ? "ಲಿಸ್ಟಿಂಗ್" : "Listing"}</span>
        </Link>
        
        {isAuth ? (
          <Link href="/dashboard" className={`flex flex-col items-center justify-center gap-1 text-[10px] w-16 ${pathname === '/dashboard' ? 'text-sky-400' : 'text-slate-400 hover:text-sky-400'}`}>
            <User className="w-5 h-5" />
            <span>{lang === "kn" ? "ಪ್ರೊಫೈಲ್" : "Profile"}</span>
          </Link>
        ) : (
          <Link href="/login" className={`flex flex-col items-center justify-center gap-1 text-[10px] w-16 ${pathname === '/login' ? 'text-sky-400' : 'text-slate-400 hover:text-sky-400'}`}>
            <User className="w-5 h-5" />
            <span>{lang === "kn" ? "ಲಾಗಿನ್" : "Login"}</span>
          </Link>
        )}
      </div>
    </>
  );
}