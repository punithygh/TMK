"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Phone, MessageCircle, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-[440px] bg-[#0c1220]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
        
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-sky-400 text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          {t("ಲಾಗಿನ್‌ಗೆ ಹಿಂತಿರುಗಿ", "Back to Login")}
        </Link>

        <div className="text-center mb-8">
          {/* Lock Icon with glow */}
          <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <span className="text-4xl">🔑</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">
            {t("ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?", "Forgot Password?")}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            {t(
              "ನಿಮ್ಮ ಖಾತೆಯ ಮರುಹೊಂದಾಣಿಕೆಗಾಗಿ ನಮ್ಮ ಬೆಂಬಲ ತಂಡವನ್ನು ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ.",
              "To reset your account, please contact our support team directly."
            )}
          </p>
        </div>

        {/* Contact Options */}
        <div className="flex flex-col gap-3">
          <a
            href="https://wa.me/918553000000?text=Hi, I forgot my password on Tumakuru Connect. Please help me reset it."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl hover:bg-[#25D366]/20 hover:border-[#25D366]/40 transition-all group"
          >
            <div className="w-11 h-11 bg-[#25D366] rounded-xl flex items-center justify-center shadow-lg shadow-[#25D366]/20 shrink-0">
              <MessageCircle size={22} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm group-hover:text-[#25D366] transition-colors">
                {t("ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಸಂಪರ್ಕಿಸಿ", "Contact via WhatsApp")}
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                {t("ತ್ವರಿತ ಸಹಾಯ - 24 ಗಂಟೆಯಲ್ಲಿ ಉತ್ತರ", "Quick help — reply within 24 hrs")}
              </p>
            </div>
          </a>

          <a
            href="tel:+918553000000"
            className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all group"
          >
            <div className="w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <Phone size={22} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm group-hover:text-emerald-400 transition-colors">
                {t("ಫೋನ್ ಮಾಡಿ", "Call Us")}
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                {t("ಸೋಮ–ಶನಿ, ಬೆ. 9:00 - ಸಂ. 6:00", "Mon–Sat, 9:00 AM – 6:00 PM")}
              </p>
            </div>
          </a>

          <a
            href="mailto:support@tumakuruconnect.com?subject=Password Reset Request"
            className="flex items-center gap-4 p-4 bg-sky-500/10 border border-sky-500/20 rounded-xl hover:bg-sky-500/20 hover:border-sky-500/40 transition-all group"
          >
            <div className="w-11 h-11 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
              <Mail size={22} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm group-hover:text-sky-400 transition-colors">
                {t("ಇಮೇಲ್ ಕಳುಹಿಸಿ", "Send Email")}
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                support@tumakuruconnect.com
              </p>
            </div>
          </a>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-slate-600 text-xs font-medium">
            {t("ಅಥವಾ", "or")}
          </span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        <p className="text-center text-sm text-slate-400">
          {t("ಪಾಸ್‌ವರ್ಡ್ ನೆನಪಾಯಿತೇ?", "Remember your password?")}{" "}
          <Link href="/login" className="text-sky-500 font-bold hover:underline">
            {t("ಲಾಗಿನ್ ಮಾಡಿ", "Login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
