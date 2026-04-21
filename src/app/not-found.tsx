import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#050b14] px-4 text-center">
      {/* 404 Graphic */}
      <div className="relative mb-8">
        <h1 className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-800 to-slate-900 leading-none select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-sky-500/10 p-6 rounded-full border border-sky-500/30 shadow-[0_0_50px_rgba(14,165,233,0.3)]">
            <Search className="w-16 h-16 text-sky-400" />
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
        Page Not Found
      </h2>
      <p className="text-slate-400 mb-8 max-w-[400px]">
        We've searched everywhere, but we couldn't find the page or business you were looking for. It might have been moved or deleted.
      </p>

      <Link 
        href="/" 
        className="flex items-center gap-2 bg-sky-500 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-sky-400 transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(14,165,233,0.3)]"
      >
        <Home size={20} />
        Return Home
      </Link>
    </div>
  );
}
