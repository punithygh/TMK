"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Smartphone, Lock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/auth";

export default function LoginPage() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const data = await loginUser(mobile, password);
      if (data.user) {
        login(data.user, data.access, data.refresh);
      }
      setStatus("success");
      setTimeout(() => router.push("/"), 500); // Redirect to home or dashboard
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || t("ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ.", "Login failed."));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -z-10"></div>

      <div className="w-full max-w-[420px] bg-[#0c1220]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-black mb-2 tracking-tight">
            <span className="text-white">Tumakuru</span><span className="text-sky-500">Connect</span>
          </Link>
          <p className="text-slate-400 text-sm">
            {t("ನಿಮ್ಮ ಖಾತೆಗೆ ಲಾಗಿನ್ ಆಗಿ", "Welcome back! Login to your account.")}
          </p>
        </div>

        {status === "error" && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm font-medium mb-6 flex items-center gap-2">
            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {errorMessage}
          </div>
        )}

        {status === "success" && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-lg text-sm font-medium mb-6 flex items-center gap-2">
            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {t("ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ! ಮರುನಿರ್ದೇಶಿಸಲಾಗುತ್ತಿದೆ...", "Login successful! Redirecting...")}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{t("ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", "Mobile Number")}</label>
            <div className="flex items-center bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition-all h-12">
              <span className="px-4 text-slate-500 flex items-center justify-center"><Smartphone size={18} /></span>
              <input 
                type="tel" 
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full h-full bg-transparent text-white text-sm outline-none placeholder:text-slate-600 font-medium" 
                placeholder="Enter 10-digit number" 
                required 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("ಪಾಸ್‌ವರ್ಡ್", "Password")}</label>
              <Link href="/forgot-password" className="text-xs text-sky-500 hover:text-sky-400 font-medium transition-colors">
                {t("ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?", "Forgot Password?")}
              </Link>
            </div>
            <div className="flex items-center bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition-all h-12">
              <span className="px-4 text-slate-500 flex items-center justify-center"><Lock size={18} /></span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-full bg-transparent text-white text-sm outline-none placeholder:text-slate-600 font-medium" 
                placeholder="••••••••" 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status === "loading" || status === "success"}
            className="w-full bg-sky-500 text-white font-bold h-12 rounded-xl text-sm hover:bg-sky-400 transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] disabled:opacity-70 disabled:pointer-events-none"
          >
            {status === "loading" ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <>{t("ಲಾಗಿನ್", "Login")} <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-8">
          {t("ಖಾತೆ ಇಲ್ಲವೇ?", "Don't have an account?")} <Link href="/register" className="text-sky-500 font-bold hover:underline transition-all ml-1">{t("ಸೈನ್ ಅಪ್ ಮಾಡಿ", "Sign up")}</Link>
        </p>
      </div>
    </div>
  );
}
