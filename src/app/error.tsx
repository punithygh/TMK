"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#050b14] px-4 text-center">
      
      <div className="bg-red-500/10 p-5 rounded-full mb-6 border border-red-500/30">
        <AlertOctagon className="w-16 h-16 text-red-500" />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
        Oops! Something went wrong.
      </h2>
      
      <p className="text-slate-400 max-w-[400px] mb-8">
        We encountered an unexpected error while trying to load this page. Our team has been notified.
      </p>

      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-slate-800 text-white font-bold px-8 py-3 rounded-xl border border-slate-700 hover:bg-slate-700 hover:border-sky-500 transition-all"
      >
        <RotateCcw size={18} />
        Try Again
      </button>

      {/* Development Only Error Display */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-12 bg-black/50 border border-red-900 rounded-lg p-4 max-w-2xl w-full text-left overflow-auto">
          <p className="text-red-400 font-mono text-sm mb-2 font-bold">Developer Error Trace:</p>
          <p className="text-slate-300 font-mono text-xs whitespace-pre-wrap">
            {error.message}
          </p>
        </div>
      )}
    </div>
  );
}
