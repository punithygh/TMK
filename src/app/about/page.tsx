"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Info, Target, ShieldCheck, MapPin, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Header Section */}
      <div className="bg-slate-900 pt-28 pb-20 px-4 relative overflow-hidden">
        {/* Abstract Background Design */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-red-600/10 dark:bg-sky-500/10 blur-[100px]"></div>
          <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[80px]"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-red-50 dark:bg-sky-500/10 rounded-2xl mb-6 shadow-inner border border-red-200 dark:border-sky-500/20">
            <Info className="w-8 h-8 text-red-600 dark:text-sky-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
            {t("ತುಮಕೂರು ಕನೆಕ್ಟ್ ", "About Tumakuru ")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600 dark:from-sky-400 dark:to-blue-500">
              {t("ಬಗ್ಗೆ", "Connect")}
            </span>
          </h1>
          <p className="text-slate-300 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            {lang === "kn" 
              ? "ಇದು ನಮ್ಮ ತುಮಕೂರಿಗಾಗಿಯೇ ಮೀಸಲಾದ ನಿಮ್ಮ ನೆಚ್ಚಿನ ಸ್ಥಳೀಯ ಸರ್ಚ್ ಇಂಜಿನ್ ಮತ್ತು ಬ್ಯುಸಿನೆಸ್ ಡೈರೆಕ್ಟರಿ." 
              : "Your ultimate local search engine and business directory dedicated exclusively to Namma Tumkur."}
          </p>
        </div>
      </div>

      {/* 2. Main Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-6 md:p-10 space-y-12">
          
          {/* Intro Paragraph */}
          <section className="text-center">
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
              {lang === "kn" 
                ? "ವೇಗವಾದ, ವಿಶ್ವಾಸಾರ್ಹವಾದ ಮತ್ತು ಸಮಗ್ರವಾದ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸುವ ಮೂಲಕ ಸ್ಥಳೀಯ ವ್ಯವಹಾರಗಳು ಮತ್ತು ಗ್ರಾಹಕರ ನಡುವಿನ ಅಂತರವನ್ನು ಕಡಿಮೆ ಮಾಡುವುದು ನಮ್ಮ ಉದ್ದೇಶವಾಗಿದೆ." 
                : "Our mission is to bridge the gap between local businesses and consumers by providing fast, reliable, and comprehensive information."}
            </p>
          </section>

          {/* Vision */}
          <section className="bg-red-50 dark:bg-slate-900/50 rounded-2xl p-6 md:p-8 border border-red-100 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Target size={120} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-600 dark:bg-sky-500 text-white p-2 rounded-xl">
                <Target size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                {t("ನಮ್ಮ ದೃಷ್ಟಿಕೋನ", "Our Vision")}
              </h2>
            </div>
            <p className="text-slate-700 text-base md:text-lg leading-relaxed relative z-10">
              {lang === "kn" 
                ? "ಪ್ರತಿ ಸಣ್ಣ ಮತ್ತು ಮಧ್ಯಮ ವ್ಯವಹಾರವು ಆನ್‌ಲೈನ್ ಉಪಸ್ಥಿತಿಯನ್ನು ಹೊಂದಿರುವ ಮತ್ತು ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕನು ತನಗೆ ಬೇಕಾದುದನ್ನು ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಕಂಡುಕೊಳ್ಳುವ ಡಿಜಿಟಲ್ ಸಶಕ್ತ ತುಮಕೂರನ್ನು ನಾವು ಕಲ್ಪಿಸಿಕೊಂಡಿದ್ದೇವೆ - ಅದು ಅತ್ಯುತ್ತಮ ಹೋಟೆಲ್‌ಗಳು, ಉನ್ನತ ವೈದ್ಯರು, ವಿಶ್ವಾಸಾರ್ಹ ಪಿಜಿಗಳು ಅಥವಾ ತುರ್ತು ಸೇವೆಗಳಾಗಿರಬಹುದು." 
                : "We envision a digitally empowered Tumkur where every small and medium business has an online presence, and every citizen can find exactly what they need within seconds—be it the best lodges, top-rated doctors, reliable PGs, or emergency services."}
            </p>
          </section>

          {/* Why Choose Us */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
              {t("ನಮ್ಮನ್ನು ಏಕೆ ಆರಿಸಬೇಕು?", "Why Choose Us?")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white border border-slate-200 p-6 rounded-2xl hover:shadow-lg hover:border-red-300 dark:hover:border-sky-300 transition-all group">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <MapPin size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">
                  {t("100% ಲೋಕಲ್", "100% Local")}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t("ತುಮಕೂರಿಗಾಗಿ, ತುಮಕೂರಿಗರಿಂದ ನಿರ್ಮಿಸಲಾಗಿದೆ.", "Built for Tumkur, by Tumkurians.")}
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl hover:shadow-lg hover:border-red-300 dark:hover:border-sky-300 transition-all group">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">
                  {t("ಪರಿಶೀಲಿಸಿದ ಮಾಹಿತಿ", "Verified Listings")}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t("ನಾವು ನಿಖರವಾದ ಮತ್ತು ನವೀಕೃತ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಲು ಶ್ರಮಿಸುತ್ತೇವೆ.", "We strive to provide accurate and up-to-date information.")}
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl hover:shadow-lg hover:border-red-300 dark:hover:border-sky-300 transition-all group">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">
                  {t("ಉಚಿತ ಬ್ಯುಸಿನೆಸ್ ಬೆಳವಣಿಗೆ", "Free Business Growth")}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t("ಸ್ಥಳೀಯ ವ್ಯಾಪಾರಿಗಳು ಪ್ರತಿದಿನ ಸಾವಿರಾರು ಗ್ರಾಹಕರನ್ನು ತಲುಪಲು ನಾವು ಸಹಾಯ ಮಾಡುತ್ತೇವೆ.", "We help local vendors reach thousands of customers daily.")}
                </p>
              </div>

            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-slate-900 rounded-2xl p-8 md:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-blue-600/10"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-full mb-5">
                <Users className="w-8 h-8 text-red-500 dark:text-sky-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {t("ನಮ್ಮ ಜೊತೆ ಕೈಜೋಡಿಸಿ", "Join the Community")}
              </h2>
              <p className="text-slate-300 text-base mb-8 max-w-xl mx-auto">
                {lang === "kn" 
                  ? "ನೀವು ಸೇವೆಗಳನ್ನು ಹುಡುಕುತ್ತಿರುವ ಬಳಕೆದಾರರಾಗಿರಲಿ ಅಥವಾ ಬೆಳೆಯಲು ಬಯಸುವ ವ್ಯಾಪಾರ ಮಾಲೀಕರಾಗಿರಲಿ, ತುಮಕೂರು ಕನೆಕ್ಟ್ ನಿಮ್ಮ ವಿಶ್ವಾಸಾರ್ಹ ಪಾಲುದಾರ. ಬನ್ನಿ ಒಟ್ಟಿಗೆ ಬೆಳೆಯೋಣ!" 
                  : "Whether you are a user looking for services or a business owner looking to grow, Tumakuru Connect is your trusted partner. Let's grow together!"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/add-business" className="bg-red-600 hover:bg-red-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-red-600/30 dark:shadow-sky-500/30">
                  {t("ಬ್ಯುಸಿನೆಸ್ ಸೇರಿಸಿ", "Add Business")}
                </Link>
                <Link href="/listings" className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl transition-colors border border-slate-700">
                  {t("ಸೇವೆಗಳನ್ನು ಹುಡುಕಿ", "Explore Services")}
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
