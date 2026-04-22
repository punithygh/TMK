"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { FileText, Scale, Store, Star, AlertTriangle, ChevronRight } from "lucide-react";

export default function TermsPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Header Section */}
      <div className="bg-slate-900 pt-28 pb-20 px-4 relative overflow-hidden">
        {/* Abstract Background Design */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-violet-500/10 blur-[100px]"></div>
          <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[80px]"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-violet-500/10 rounded-2xl mb-6 shadow-inner border border-violet-500/20">
            <Scale className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
            {t("ಸೇವಾ ", "Terms of ")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
              {t("ನಿಯಮಗಳು", "Service")}
            </span>
          </h1>
          <p className="text-violet-400/80 text-sm md:text-base max-w-2xl mx-auto font-medium tracking-widest uppercase">
            {lang === "kn" ? "ಕೊನೆಯದಾಗಿ ನವೀಕರಿಸಿದ್ದು: ಏಪ್ರಿಲ್ 2026" : "LAST UPDATED: APRIL 2026"}
          </p>
        </div>
      </div>

      {/* 2. Main Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-6 md:p-10 space-y-10">
          
          {/* Intro Paragraph */}
          <section className="border-b border-slate-100 pb-8 text-center md:text-left">
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium">
              {lang === "kn" 
                ? "ತುಮಕೂರು ಕನೆಕ್ಟ್ ಅನ್ನು ಪ್ರವೇಶಿಸುವ ಮತ್ತು ಬಳಸುವ ಮೂಲಕ, ಈ ಒಪ್ಪಂದದ ನಿಯಮಗಳು ಮತ್ತು ನಿಬಂಧನೆಗಳಿಗೆ ಬದ್ಧರಾಗಿರಲು ನೀವು ಒಪ್ಪಿಕೊಳ್ಳುತ್ತೀರಿ." 
                : "By accessing and using Tumakuru Connect, you accept and agree to be bound by the terms and provisions of this agreement."}
            </p>
          </section>

          {/* Point 1 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-violet-50 text-violet-500 p-2.5 rounded-xl border border-violet-100">
                <FileText size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                {t("1. ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಬಳಕೆ", "1. Use of the Platform")}
              </h2>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl relative overflow-hidden group hover:border-violet-200 transition-colors">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Scale size={80} />
              </div>
              <p className="text-slate-700 leading-relaxed relative z-10">
                {lang === "kn" 
                  ? "ತುಮಕೂರು ಕನೆಕ್ಟ್ ಒಂದು ಸ್ಥಳೀಯ ಸರ್ಚ್ ಡೈರೆಕ್ಟರಿಯಾಗಿದೆ. ಬಳಕೆದಾರರು ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಅನ್ನು ಕೇವಲ ಕಾನೂನುಬದ್ಧ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಬಳಸಲು ಒಪ್ಪಿಕೊಳ್ಳುತ್ತಾರೆ. ಸ್ಪ್ಯಾಮ್, ತಪ್ಪು ಮಾಹಿತಿ ಅಥವಾ ಹಾನಿಕಾರಕ ವಿಷಯವನ್ನು ಹರಡಲು ನೀವು ವೆಬ್‌ಸೈಟ್ ಅನ್ನು ಬಳಸಬಾರದು." 
                  : "Tumakuru Connect is a local search directory. Users agree to use the platform only for lawful purposes. You must not use the website to distribute spam, false information, or harmful content."}
              </p>
            </div>
          </section>

          {/* Point 2 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-sky-50 text-sky-500 p-2.5 rounded-xl border border-sky-100">
                <Store size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                {t("2. ಬ್ಯುಸಿನೆಸ್ ಲಿಸ್ಟಿಂಗ್‌ಗಳು", "2. Business Listings")}
              </h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-start gap-4">
                <ChevronRight className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 text-sm leading-relaxed">
                  {lang === "kn" 
                    ? '"ಉಚಿತ ಲಿಸ್ಟಿಂಗ್" ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ತಾವು ಒದಗಿಸುವ ಮಾಹಿತಿ, ಫೋಟೋಗಳು ಮತ್ತು ಸಂಪರ್ಕ ವಿವರಗಳ ನಿಖರತೆಗೆ ವ್ಯಾಪಾರ ಮಾಲೀಕರೇ ಜವಾಬ್ದಾರರಾಗಿರುತ್ತಾರೆ.' 
                    : 'Business owners are responsible for the accuracy of the information, photos, and contact details they provide during the "Free Listing" process.'}
                </span>
              </li>
              <li className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-start gap-4">
                <ChevronRight className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 text-sm leading-relaxed">
                  {lang === "kn" 
                    ? "ನಮ್ಮ ಸಮುದಾಯ ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಉಲ್ಲಂಘಿಸುವ ಅಥವಾ ಕೃತಿಸ್ವಾಮ್ಯ-ಉಲ್ಲಂಘಿಸುವ ವಸ್ತುಗಳನ್ನು ಒಳಗೊಂಡಿರುವ ಯಾವುದೇ ಲಿಸ್ಟಿಂಗ್ ಅನ್ನು ಪರಿಶೀಲಿಸುವ, ಸಂಪಾದಿಸುವ ಅಥವಾ ತೆಗೆದುಹಾಕುವ ಹಕ್ಕನ್ನು ತುಮಕೂರು ಕನೆಕ್ಟ್ ಕಾಯ್ದಿರಿಸಿಕೊಂಡಿದೆ." 
                    : "Tumakuru Connect reserves the right to review, edit, or remove any listing that violates our community guidelines or contains copyright-infringing material."}
                </span>
              </li>
            </ul>
          </section>

          {/* Point 3 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-50 text-amber-500 p-2.5 rounded-xl border border-amber-100">
                <Star size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                {t("3. ವಿಮರ್ಶೆಗಳು ಮತ್ತು ರೇಟಿಂಗ್‌ಗಳು", "3. Reviews and Ratings")}
              </h2>
            </div>
            <div className="bg-slate-50 border-l-4 border-amber-400 p-6 rounded-r-2xl">
              <p className="text-slate-700 leading-relaxed">
                {lang === "kn" 
                  ? "ಪಟ್ಟಿ ಮಾಡಲಾದ ವ್ಯವಹಾರಗಳಿಗೆ ಬಳಕೆದಾರರು ವಿಮರ್ಶೆಗಳನ್ನು ಸಲ್ಲಿಸಬಹುದು. ವಿಮರ್ಶೆಗಳು ನೈಜ ಅನುಭವಗಳನ್ನು ಆಧರಿಸಿರಬೇಕು. ನಿಂದನೀಯ ಭಾಷೆ, ದ್ವೇಷದ ಭಾಷಣ ಅಥವಾ ನಕಲಿ ಪ್ರಚಾರದ ವಿಮರ್ಶೆಗಳನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಲಾಗುತ್ತದೆ." 
                  : "Users can submit reviews for listed businesses. Reviews must be based on genuine experiences. Abusive language, hate speech, or fake promotional reviews will be permanently deleted."}
              </p>
            </div>
          </section>

          {/* Point 4 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 text-red-500 p-2.5 rounded-xl border border-red-100">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                {t("4. ವಾರಂಟಿಗಳ ಹಕ್ಕುತ್ಯಾಗ", "4. Disclaimer of Warranties")}
              </h2>
            </div>
            <div className="bg-slate-50 border-l-4 border-red-400 p-6 rounded-r-2xl">
              <p className="text-slate-700 leading-relaxed">
                {lang === "kn" 
                  ? "ನಾವು ಗ್ರಾಹಕರು ಮತ್ತು ವ್ಯವಹಾರಗಳ ನಡುವಿನ ಸೇತುವೆಯಾಗಿ ಮಾತ್ರ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತೇವೆ. ನಮ್ಮ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ನಲ್ಲಿ ಪಟ್ಟಿ ಮಾಡಲಾದ ವ್ಯವಹಾರಗಳು ನೀಡುವ ಉತ್ಪನ್ನಗಳು ಅಥವಾ ಸೇವೆಗಳ ಗುಣಮಟ್ಟವನ್ನು ನಾವು ಖಾತರಿಪಡಿಸುವುದಿಲ್ಲ." 
                  : "We act only as a bridge between consumers and businesses. We do not guarantee the quality of products or services offered by the businesses listed on our platform."}
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
