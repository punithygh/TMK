"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Shield, Lock, Database, Mail, Search, FileText } from "lucide-react";

export default function PrivacyPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Header Section */}
      <div className="bg-slate-900 pt-28 pb-20 px-4 relative overflow-hidden">
        {/* Abstract Background Design */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[100px]"></div>
          <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-teal-600/10 blur-[80px]"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-6 shadow-inner border border-emerald-500/20">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
            {t("ಗೌಪ್ಯತೆ ", "Privacy ")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
              {t("ನೀತಿ", "Policy")}
            </span>
          </h1>
          <p className="text-emerald-400/80 text-sm md:text-base max-w-2xl mx-auto font-medium tracking-widest uppercase">
            {lang === "kn" ? "ಕೊನೆಯದಾಗಿ ನವೀಕರಿಸಿದ್ದು: ಏಪ್ರಿಲ್ 2026" : "LAST UPDATED: APRIL 2026"}
          </p>
        </div>
      </div>

      {/* 2. Main Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-6 md:p-10 space-y-10">
          
          {/* Intro Paragraph */}
          <section className="border-b border-slate-100 pb-8">
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
              {lang === "kn" 
                ? "ತುಮಕೂರು ಕನೆಕ್ಟ್ ನಲ್ಲಿ, ನಿಮ್ಮ ಗೌಪ್ಯತೆಯೇ ನಮ್ಮ ಆದ್ಯತೆಯಾಗಿದೆ. ನಮ್ಮ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಯಾವ ರೀತಿಯ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಸ್ವೀಕರಿಸುತ್ತದೆ ಮತ್ತು ಸಂಗ್ರಹಿಸುತ್ತದೆ ಹಾಗೂ ಅದನ್ನು ಹೇಗೆ ಬಳಸಲಾಗುತ್ತದೆ ಎಂಬುದನ್ನು ಈ ಗೌಪ್ಯತೆ ನೀತಿಯು ವಿವರಿಸುತ್ತದೆ." 
                : "At Tumakuru Connect, your privacy is our priority. This Privacy Policy outlines the types of personal information that is received and collected by our platform and how it is used."}
            </p>
          </section>

          {/* Point 1 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 text-emerald-500 p-2.5 rounded-xl border border-emerald-100">
                <Database size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                {t("1. ನಾವು ಸಂಗ್ರಹಿಸುವ ಮಾಹಿತಿ", "1. Information We Collect")}
              </h2>
            </div>
            <p className="text-slate-600">
              {t("ನೀವು ನಮ್ಮ ವೆಬ್‌ಸೈಟ್ ಬಳಸುವಾಗ ನಾವು ಈ ಕೆಳಗಿನ ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸಬಹುದು:", "We may collect the following information when you use our website:")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  {t("ವೈಯಕ್ತಿಕ ಡೇಟಾ", "Personal Data")}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {lang === "kn" ? "ನೀವು ನೋಂದಾಯಿಸುವಾಗ, ವಿಮರ್ಶೆ ಬರೆಯುವಾಗ ಅಥವಾ ವಿಚಾರಣೆ ಕಳುಹಿಸುವಾಗ ನೀಡುವ ಹೆಸರು, ಇಮೇಲ್ ವಿಳಾಸ ಮತ್ತು ಫೋನ್ ನಂಬರ್." : "Name, email address, and phone number when you register, leave a review, or send an enquiry."}
                </p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  {t("ಬ್ಯುಸಿನೆಸ್ ಡೇಟಾ", "Business Data")}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {lang === "kn" ? '"ಉಚಿತ ಲಿಸ್ಟಿಂಗ್" ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ಸಲ್ಲಿಸಿದ ಮಾಹಿತಿ (ಉದಾ: ಬ್ಯುಸಿನೆಸ್ ಹೆಸರು, ವಿಳಾಸ, ಫೋಟೋಗಳು, ಸಂಪರ್ಕ ವಿವರಗಳು).' : 'Information submitted during the "Free Listing" process (e.g., business name, address, photos, contact details).'}
                </p>
              </div>
            </div>
          </section>

          {/* Point 2 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 text-blue-500 p-2.5 rounded-xl border border-blue-100">
                <Search size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                {t("2. ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ನಾವು ಹೇಗೆ ಬಳಸುತ್ತೇವೆ", "2. How We Use Your Information")}
              </h2>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 leading-relaxed">
                  {lang === "kn" ? "ವಿಚಾರಣೆಗಳ ಮೂಲಕ ಬಳಕೆದಾರರನ್ನು ಸ್ಥಳೀಯ ವ್ಯಾಪಾರಗಳೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಲು." : "To connect users with local businesses via enquiries."}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 leading-relaxed">
                  {lang === "kn" ? "ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನ ಕಾರ್ಯಕ್ಷಮತೆ ಮತ್ತು ಬಳಕೆದಾರರ ಅನುಭವವನ್ನು ಸುಧಾರಿಸಲು." : "To improve our website's functionality and user experience."}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 leading-relaxed">
                  {lang === "kn" ? "ಸಮುದಾಯಕ್ಕೆ ಸಹಾಯ ಮಾಡಲು ಪರಿಶೀಲಿಸಿದ ವಿಮರ್ಶೆಗಳು ಮತ್ತು ರೇಟಿಂಗ್‌ಗಳನ್ನು ಪ್ರದರ್ಶಿಸಲು." : "To display verified reviews and ratings to help the community."}
                </span>
              </li>
            </ul>
          </section>

          {/* Point 3 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-50 text-amber-500 p-2.5 rounded-xl border border-amber-100">
                <Lock size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                {t("3. ಡೇಟಾ ಭದ್ರತೆ", "3. Data Security")}
              </h2>
            </div>
            <div className="bg-slate-50 border-l-4 border-amber-400 p-6 rounded-r-2xl">
              <p className="text-slate-700 leading-relaxed">
                {lang === "kn" 
                  ? "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ರಕ್ಷಿಸಲು ನಾವು ಕಟ್ಟುನಿಟ್ಟಾದ ಭದ್ರತಾ ಕ್ರಮಗಳನ್ನು ಅಳವಡಿಸುತ್ತೇವೆ. ನಿಮ್ಮ ಸ್ಪಷ್ಟ ಒಪ್ಪಿಗೆಯಿಲ್ಲದೆ ನಾವು ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಗುರುತಿನ ಮಾಹಿತಿಯನ್ನು ಮೂರನೇ ವ್ಯಕ್ತಿಗಳಿಗೆ ಮಾರಾಟ ಮಾಡುವುದಿಲ್ಲ ಅಥವಾ ಬಾಡಿಗೆಗೆ ನೀಡುವುದಿಲ್ಲ." 
                  : "We implement strict security measures to protect your personal information. We do not sell, trade, or rent your personal identification information to third parties without your explicit consent."}
              </p>
            </div>
          </section>

          {/* Point 4 */}
          <section className="space-y-6 bg-slate-900 rounded-2xl p-8 relative overflow-hidden mt-8 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/10"></div>
            <div className="relative z-10">
              <Mail className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
                {t("4. ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ", "4. Contact Us")}
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                {lang === "kn" 
                  ? "ಈ ಗೌಪ್ಯತೆ ನೀತಿಯ ಬಗ್ಗೆ ನಿಮಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳಿದ್ದರೆ, ದಯವಿಟ್ಟು ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ." 
                  : "If you have any questions about this Privacy Policy, please contact us."}
              </p>
              <a href="/contact" className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-emerald-500/30">
                {t("ಸಂಪರ್ಕಿಸಿ", "Contact Us")}
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
