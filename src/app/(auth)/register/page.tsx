"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, User, Smartphone, Mail, Lock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { registerUser } from "@/services/auth";

export default function RegisterPage() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: "",
    mobile: "",
    email: "",
    password: ""
  });
  
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const data = await registerUser(formData);
      if (data.user) {
        login(data.user, data.access, data.refresh);
      }
      setStatus("success");
      setTimeout(() => router.push("/"), 500);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || t("ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ.", "Registration failed."));
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="w-full max-w-[420px] bg-[#0c1220]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white mb-2 tracking-tight">
            {t("ಖಾತೆಯನ್ನು ರಚಿಸಿ", "Create an Account")}
          </h1>
          <p className="text-slate-400 text-sm">
            {t("ನಿಮ್ಮ ಸ್ಥಳೀಯ ವ್ಯವಹಾರಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.", "Join Tumakuru's #1 local directory.")}
          </p>
        </div>

        {status === "error" && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm font-medium mb-6 flex items-center gap-2 leading-tight">
            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {errorMessage}
          </div>
        )}

        {status === "success" && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-lg text-sm font-medium mb-6 flex items-center gap-2">
            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {t("ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ!", "Registration successful!")}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{t("ಪೂರ್ಣ ಹೆಸರು", "Full Name")}</label>
            <div className="flex items-center bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition-all h-11">
              <span className="px-3.5 text-slate-500"><User size={16} /></span>
              <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full h-full bg-transparent text-white text-sm outline-none placeholder:text-slate-600 font-medium" placeholder="John Doe" required />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{t("ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", "Mobile Number")}</label>
            <div className="flex items-center bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition-all h-11">
              <span className="px-3.5 text-slate-500"><Smartphone size={16} /></span>
              <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full h-full bg-transparent text-white text-sm outline-none placeholder:text-slate-600 font-medium" placeholder="9876543210" required minLength={10} maxLength={10} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{t("ಇಮೇಲ್", "Email Address")}</label>
            <div className="flex items-center bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition-all h-11">
              <span className="px-3.5 text-slate-500"><Mail size={16} /></span>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full h-full bg-transparent text-white text-sm outline-none placeholder:text-slate-600 font-medium" placeholder="john@example.com" required />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{t("ಪಾಸ್‌ವರ್ಡ್", "Password")}</label>
            <div className="flex items-center bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition-all h-11">
              <span className="px-3.5 text-slate-500"><Lock size={16} /></span>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full h-full bg-transparent text-white text-sm outline-none placeholder:text-slate-600 font-medium" placeholder="••••••••" required minLength={6} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status === "loading" || status === "success"}
            className="w-full bg-sky-500 text-white font-bold h-12 rounded-xl text-sm hover:bg-sky-400 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] disabled:opacity-70 disabled:pointer-events-none"
          >
            {status === "loading" ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <>{t("ಸೈನ್ ಅಪ್ ಮಾಡಿ", "Sign Up")} <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p className="text-center text-[13px] text-slate-400 mt-8">
          {t("ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?", "Already have an account?")} <Link href="/login" className="text-sky-500 font-bold hover:underline transition-all ml-1">{t("ಲಾಗಿನ್", "Login")}</Link>
        </p>
      </div>
    </div>
  );
}
