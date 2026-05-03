"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, CheckCircle, Loader2, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { submitReview } from "@/services/businessService";

interface ReviewFormProps {
  businessId: number;
  onSuccess: () => void;
  t: (kn: string, en: string) => string;
}

export default function ReviewForm({ businessId, onSuccess, t }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    if (rating === 0 && !comment.trim()) return;

    setStatus("loading");
    try {
      await submitReview(businessId, { rating: rating || 5, comment: comment.trim() });
      setStatus("success");
      onSuccess();
    } catch (err) {
      console.error("Review submission failed:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-emerald-500 font-bold">
          <CheckCircle size={20} /> {t("ಧನ್ಯವಾದಗಳು! ವಿಮರ್ಶೆ ಸಲ್ಲಿಯಾಗಿದೆ.", "Thank you! Review submitted.")}
        </div>
        <Link href="/dashboard" className="text-sm font-bold text-sky-500 hover:underline flex items-center gap-1 ml-8">
          {t("ಡ್ಯಾಶ್ಬೋರ್ಡ್ ನೋಡಿ", "View in Dashboard")} <ChevronRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(s => (
          <button
            key={s} type="button"
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(s)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star size={28} className={(hovered || rating) >= s ? "fill-amber-500 text-amber-500" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"} />
          </button>
        ))}
        {rating > 0 && <span className="ml-2 text-sm text-slate-600 dark:text-slate-400 self-center font-semibold">{rating}/5</span>}
      </div>
      <textarea
        value={comment} onChange={e => setComment(e.target.value)}
        placeholder={t("ನಿಮ್ಮ ಅನುಭವ ಹಂಚಿಕೊಳ್ಳಿ...", "Share your experience...")} rows={3}
        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-red-600 dark:focus:border-sky-500 resize-none"
      />
      {status === "error" && <p className="text-rose-500 text-sm">{t("ವಿಫಲವಾಗಿದೆ, ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ", "Failed, please try again")}</p>}
      <button type="submit" disabled={rating === 0 || status === "loading"} className="self-start bg-red-600 hover:bg-red-700 dark:bg-sky-500 dark:hover:bg-sky-600 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2">
        {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} />}
        {t("ಸಲ್ಲಿಸಿ", "Submit Review")}
      </button>
    </form>
  );
}