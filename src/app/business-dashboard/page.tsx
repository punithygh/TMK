"use client";
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getOwnerDashboard, OwnerDashboardData } from "@/services/user";
import { Loader2, TrendingUp, Phone, MessageSquare, Star, Eye, Building2, MapPin, ChevronRight, BarChart3, AlertCircle } from "lucide-react";
import { getSupabaseImageUrl } from "@/utils/imageUtils";
import Link from "next/link";

export default function BusinessDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [data, setData] = useState<OwnerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const dashboardData = await getOwnerDashboard();
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to load owner dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, router]);

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050b14]">
        <Loader2 className="w-10 h-10 text-red-600 dark:text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b14] pt-8 pb-20 px-4 md:px-[5%] relative overflow-hidden text-white">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-[150px] -z-10"></div>
      
      <div className="max-w-[1200px] mx-auto">
        
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
              <Building2 className="text-sky-400" size={32} />
              Owner Dashboard
            </h1>
            <p className="text-slate-400 font-medium text-sm md:text-base">
              Welcome back, {user?.first_name}! Here's how your businesses are performing.
            </p>
          </div>
        </header>

        {/* Global Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0c1220] border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center gap-5 hover:border-sky-500/50 transition-colors">
            <div className="w-14 h-14 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0">
              <Eye className="text-sky-400" size={28} />
            </div>
            <div>
              <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Total Page Views</div>
              <div className="text-3xl font-black">{data?.overview?.total_page_views || 0}</div>
            </div>
          </div>

          <div className="bg-[#0c1220] border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center gap-5 hover:border-emerald-500/50 transition-colors">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Phone className="text-emerald-400" size={28} />
            </div>
            <div>
              <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Total Phone Calls</div>
              <div className="text-3xl font-black">{data?.overview?.total_calls || 0}</div>
            </div>
          </div>

          <div className="bg-[#0c1220] border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center gap-5 hover:border-green-500/50 transition-colors">
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
              <MessageSquare className="text-green-400" size={28} />
            </div>
            <div>
              <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">WhatsApp Leads</div>
              <div className="text-3xl font-black">{data?.overview?.total_whatsapp || 0}</div>
            </div>
          </div>
        </div>

        {/* Businesses List */}
        <h2 className="text-2xl font-black mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
          <BarChart3 className="text-amber-400" size={24} /> 
          Your Businesses
        </h2>

        {data?.businesses && data.businesses.length > 0 ? (
          <div className="space-y-6">
            {data.businesses.map((business: any) => (
              <div key={business.id} className="bg-[#0c1220] border border-slate-800 rounded-3xl p-6 overflow-hidden relative flex flex-col md:flex-row gap-8 shadow-2xl group hover:border-slate-600 transition-all">
                
                {/* Business Info Header */}
                <div className="flex items-center gap-5 md:w-1/3 shrink-0">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-slate-800 relative bg-slate-900">
                    {business.image ? (
                      <img src={business.image.startsWith('http') ? business.image : getSupabaseImageUrl(business.image) || ''} alt={business.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700"><Building2 size={32} /></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 leading-tight">{business.name}</h3>
                    <div className="flex items-center gap-2 mb-2 text-sm text-slate-400">
                      <Star size={14} className="text-amber-400 fill-amber-400" /> {business.rating} • {business.reviews_count} Reviews
                    </div>
                    <div className={`text-xs font-bold px-3 py-1 rounded-full w-max uppercase tracking-wider ${business.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                      {business.status}
                    </div>
                  </div>
                </div>

                {/* Micro Analytics for the specific business */}
                <div className="grid grid-cols-3 gap-4 md:flex-1 w-full bg-slate-900/50 p-5 rounded-2xl border border-slate-800/50">
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Eye size={12}/> Views</span>
                    <span className="text-2xl font-black text-white">{business.page_views}</span>
                  </div>
                  <div className="w-px bg-slate-800 my-2 h-auto"></div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Phone size={12}/> Calls</span>
                    <span className="text-2xl font-black text-white">{business.call_count}</span>
                  </div>
                  <div className="w-px bg-slate-800 my-2 h-auto hidden md:block"></div>
                  <div className="flex flex-col items-center justify-center text-center mt-4 md:mt-0 col-span-3 md:col-span-1 border-t border-slate-800 md:border-0 pt-4 md:pt-0">
                    <Link href={`/business/${business.slug}`} className="flex items-center gap-2 text-sm font-bold text-sky-400 hover:text-sky-300 bg-sky-500/10 px-4 py-2 rounded-xl transition-colors">
                      View Live Page <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#0c1220] border border-slate-800 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center max-w-2xl mx-auto shadow-2xl">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <Building2 className="text-slate-500 w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3">No Businesses Found</h3>
            <p className="text-slate-400 mb-8 max-w-md leading-relaxed">
              It looks like you haven't claimed any businesses yet. Claim your business to start tracking analytics and managing your page!
            </p>
            <Link href="/" className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-sky-500/20 transition-all active:scale-95">
              Explore Businesses
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
