"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function GlobalLoading() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#050b14] px-4">
      <div className="relative">
        <div className="absolute inset-0 bg-sky-500 rounded-full blur-[40px] opacity-20"></div>
        <Loader2 className="w-14 h-14 text-sky-500 animate-spin relative z-10" />
      </div>
      <h2 className="mt-8 text-xl font-bold text-white tracking-wide">
        {t("ಲೋಡ್ ಆಗುತ್ತಿದೆ...", "Loading...")}
      </h2>
      <p className="text-slate-400 mt-2 text-sm max-w-[300px] text-center">
        {t("ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ನಿರೀಕ್ಷಿಸಿ, ನಾವು ನಿಮಗಾಗಿ ಅತ್ಯುತ್ತಮ ಡೀಲ್‌ಗಳನ್ನು ತರುತ್ತಿದ್ದೇವೆ.", "Please wait a moment while we fetch the best deals for you.")}
      </p>
    </div>
  );
}
