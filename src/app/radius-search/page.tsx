"use client";

import MapSearch from '@/components/MapSearch';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function RadiusSearchPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050b14]">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-4 py-24 md:py-32">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Explore <span className="text-red-600 dark:text-sky-500">Tumakuru</span> by Radius
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Find the best services, shops, and hospitals near you using our advanced high-performance GIS radius search.
          </p>
        </div>
        
        <MapSearch />
      </div>
      <Footer />
    </main>
  );
}
