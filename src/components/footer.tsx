"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Heart, 
  Home, 
  Layers, 
  PlusCircle, 
  User 
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const pathname = usePathname();
  const { lang } = useLanguage();
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
        <div className="bg-gray-50 dark:bg-[#02060f] border-t border-gray-200 dark:border-slate-800 py-10 px-4 sm:px-6">
          <div className="max-w-[1300px] mx-auto flex flex-col gap-8">
            
            {/* Categories */}
            <div>
              <h4 className="text-slate-900 dark:text-white text-[13px] md:text-sm mb-3 md:mb-4 uppercase font-bold tracking-wider text-center md:text-left w-full">
                {lang === "kn" ? "ತುಮಕೂರಿನ ಕ್ಯಾಟಗರಿಗಳನ್ನು ಅನ್ವೇಷಿಸಿ" : "Explore Tumkur Categories"}
              </h4>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-3 gap-y-2 md:gap-y-3">
                {categoryLinks.map((link, idx) => (
                  <Link 
                    key={`cat-${idx}`} 
                    href={`/listings?q=${link.query}`}
                    className={`text-slate-500 dark:text-slate-400 text-[11px] md:text-xs hover:text-sky-600 dark:hover:text-sky-400 transition-colors ${idx !== categoryLinks.length - 1 ? "md:border-r border-slate-300 dark:border-slate-700 md:pr-3" : ""}`}
                  >
                    {lang === "kn" ? link.labelKn : link.labelEn}
                  </Link>
                ))}
              </div>
            </div>

            {/* Areas */}
            <div>
              <h4 className="text-slate-900 dark:text-white text-[13px] md:text-sm mb-3 md:mb-4 uppercase font-bold tracking-wider text-center md:text-left w-full">
                {lang === "kn" ? "ತುಮಕೂರಿನ ಪ್ರಸಿದ್ಧ ಪ್ರದೇಶಗಳು" : "Popular Areas in Tumkur"}
              </h4>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-3 gap-y-2 md:gap-y-3">
                {areaLinks.map((link, idx) => (
                  <Link 
                    key={`area-${idx}`} 
                    href={`/listings?q=${link.query}`}
                    className={`text-slate-500 dark:text-slate-400 text-[11px] md:text-xs hover:text-sky-600 dark:hover:text-sky-400 transition-colors ${idx !== areaLinks.length - 1 ? "md:border-r border-slate-300 dark:border-slate-700 md:pr-3" : ""}`}
                  >
                    {lang === "kn" ? link.labelKn : link.labelEn}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ====== 2. MAIN FOOTER (Slightly Lighter Background) ====== */}
        <footer className="bg-white dark:bg-slate-900 pt-10 pb-5 px-4 sm:px-6">
          <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row flex-wrap gap-10 justify-between items-center md:items-start">
            
            {/* 🌟 Brand Column (Updated Logo Here) 🌟 */}
            <div className="flex-1 min-w-[250px] flex flex-col items-center md:items-start w-full">
              <Link href="/" className="flex flex-col items-center md:items-start justify-center leading-none no-underline group mb-5">
                <div className="font-black text-[26px] md:text-[28px] tracking-tighter whitespace-nowrap flex items-center group-hover:scale-[1.02] transition-transform duration-300">
                  <span className="text-slate-900 dark:text-white drop-shadow-sm">Tumkur</span>
                  <div className="relative ml-[2px] flex flex-col justify-end">
                    <span className="text-red-600 dark:text-sky-400 italic -skew-x-7 drop-shadow-[0_0_12px_rgba(220,38,38,0.4)] dark:drop-shadow-[0_0_12px_rgba(14,165,233,0.8)]">
                      connect
                    </span>
                    <div className="absolute -bottom-[1px] left-0 w-full h-[2.5px] rounded-full bg-red-600 dark:bg-sky-400 shadow-[0_0_15px_rgba(220,38,38,0.5)] dark:shadow-[0_0_15px_rgba(14,165,233,1)]"></div>
                  </div>
                </div>
              </Link>
              
              <p className="text-slate-600 dark:text-slate-400 text-[12px] md:text-[15px] leading-relaxed mb-4 text-center md:text-left max-w-[95%] md:max-w-sm">
                {lang === "kn" 
                  ? "ಇದು ನಮ್ಮ ತುಮಕೂರು, ನಮ್ಮ ಹೆಮ್ಮೆ. ನಮ್ಮೂರ ಉದ್ಯಮ ಮತ್ತು ಸೇವೆಗಳನ್ನು ಹುಡುಕಲು ಅಲೆದಾಟ ಬೇಕಿಲ್ಲ, ಈಗ ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ!" 
                  : "Our Tumkur, Our Pride. No more searching for local businesses and services—everything is now just a click away!"}
              </p>
              
              <div className="flex gap-6 justify-center md:justify-start">
                <a href="https://www.facebook.com/TumakuruConnect" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-1 transition-all duration-300">
                  <Facebook className="w-6 h-6 text-[#1877F2]" />
                </a>
                <a href="https://www.instagram.com/tumakuru_connect" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-1 transition-all duration-300">
                  <Instagram className="w-6 h-6 text-[#E1306C]" />
                </a>
                <a href="https://youtube.com/@foodiegeeks23" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-1 transition-all duration-300">
                  <Youtube className="w-6 h-6 text-[#FF0000]" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex-1 min-w-[150px] flex flex-col items-center md:items-start w-full">
              <h3 className="text-[13px] md:text-sm text-slate-900 dark:text-white font-bold uppercase tracking-wider mb-3 md:mb-4">
                {lang === "kn" ? "ಕ್ವಿಕ್ ಲಿಂಕ್ಸ್" : "Quick Links"}
              </h3>
              <ul className="flex flex-col gap-2 md:gap-3 items-center md:items-start">
                <li><Link href="/about" className="relative text-slate-500 dark:text-slate-400 text-xs md:text-[13px] hover:text-sky-600 dark:hover:text-sky-400 transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-sky-500 dark:after:bg-sky-400 after:origin-bottom-right hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300 pb-0.5">{lang === "kn" ? "ನಮ್ಮ ಬಗ್ಗೆ" : "About Us"}</Link></li>
                <li><Link href="/contact" className="relative text-slate-500 dark:text-slate-400 text-xs md:text-[13px] hover:text-sky-600 dark:hover:text-sky-400 transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-sky-500 dark:after:bg-sky-400 after:origin-bottom-right hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300 pb-0.5">{lang === "kn" ? "ಸಂಪರ್ಕಿಸಿ" : "Contact Us"}</Link></li>
                <li><Link href="/free-listing" className="relative text-slate-500 dark:text-slate-400 text-xs md:text-[13px] hover:text-sky-600 dark:hover:text-sky-400 transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-sky-500 dark:after:bg-sky-400 after:origin-bottom-right hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300 pb-0.5">{lang === "kn" ? "ಉಚಿತ ಲಿಸ್ಟಿಂಗ್" : "Free Listing"}</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="flex-1 min-w-[150px] flex flex-col items-center md:items-start w-full">
              <h3 className="text-[13px] md:text-sm text-slate-900 dark:text-white font-bold uppercase tracking-wider mb-3 md:mb-4">
                {lang === "kn" ? "ಕಾನೂನು" : "Legal"}
              </h3>
              <ul className="flex flex-col gap-2 md:gap-3 items-center md:items-start">
                <li><Link href="/privacy" className="relative text-slate-500 dark:text-slate-400 text-xs md:text-[13px] hover:text-sky-600 dark:hover:text-sky-400 transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-sky-500 dark:after:bg-sky-400 after:origin-bottom-right hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300 pb-0.5">{lang === "kn" ? "ಗೌಪ್ಯತೆ ನೀತಿ" : "Privacy Policy"}</Link></li>
                <li><Link href="/terms" className="relative text-slate-500 dark:text-slate-400 text-xs md:text-[13px] hover:text-sky-600 dark:hover:text-sky-400 transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-sky-500 dark:after:bg-sky-400 after:origin-bottom-right hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300 pb-0.5">{lang === "kn" ? "ಸೇವಾ ನಿಯಮಗಳು" : "Terms of Service"}</Link></li>
              </ul>
            </div>

          </div>

          {/* Copyright */}
          <div className="max-w-[1300px] mx-auto mt-6 md:mt-8 pt-4 border-t border-gray-200 dark:border-slate-800 flex justify-center items-center gap-1 text-[11px] md:text-sm text-gray-500 whitespace-nowrap pb-24 md:pb-0">
            &copy; 2026 Tumkurconnect. Designed with <Heart className="w-3 h-3 md:w-4 md:h-4 text-red-500 fill-red-500" /> for Tumkur.
          </div>
        </footer>
      </div>

      {/* ====== 3. MOBILE BOTTOM NAVIGATION (100% Width) ====== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 w-full z-[9999]">
        <div className="w-full bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-t border-gray-200 dark:border-slate-800 flex justify-around items-center pt-3 pb-3 px-2 shadow-sm dark:shadow-[0_-5px_30px_rgba(0,0,0,0.5)] pb-safe-bottom">
          <Link href="/" className={`flex flex-col items-center justify-center gap-1.5 text-[10px] font-bold w-16 transition-transform hover:scale-110 ${pathname === '/' ? 'text-sky-500 dark:text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'text-slate-500 dark:text-slate-400'}`}>
            <Home className="w-[22px] h-[22px]" />
            <span>{lang === "kn" ? "ಮುಖಪುಟ" : "Home"}</span>
          </Link>
          <Link href="/#categories" className={`flex flex-col items-center justify-center gap-1.5 text-[10px] font-bold w-16 transition-transform hover:scale-110 ${pathname.includes('#categories') ? 'text-sky-500 dark:text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'text-slate-500 dark:text-slate-400'}`}>
            <Layers className="w-[22px] h-[22px]" />
            <span>{lang === "kn" ? "ವರ್ಗಗಳು" : "Categories"}</span>
          </Link>
          <Link href="/add-business" className={`flex flex-col items-center justify-center gap-1.5 text-[10px] font-bold w-16 transition-transform hover:scale-110 ${pathname === '/add-business' ? 'text-red-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'}`}>
            <PlusCircle className="w-[22px] h-[22px]" />
            <span>{lang === "kn" ? "ಬ್ಯುಸಿನೆಸ್" : "Business"}</span>
          </Link>
          
          {isAuth ? (
            <Link href="/dashboard" className={`flex flex-col items-center justify-center gap-1.5 text-[10px] font-bold w-16 transition-transform hover:scale-110 ${pathname === '/dashboard' ? 'text-sky-500 dark:text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'text-slate-500 dark:text-slate-400'}`}>
              <User className="w-[22px] h-[22px]" />
              <span>{lang === "kn" ? "ಪ್ರೊಫೈಲ್" : "Profile"}</span>
            </Link>
          ) : (
            <Link href="/login" className={`flex flex-col items-center justify-center gap-1.5 text-[10px] font-bold w-16 transition-transform hover:scale-110 ${pathname === '/login' ? 'text-sky-500 dark:text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'text-slate-500 dark:text-slate-400'}`}>
              <User className="w-[22px] h-[22px]" />
              <span>{lang === "kn" ? "ಲಾಗಿನ್" : "Login"}</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}