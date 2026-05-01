"use client";

import MapSearch from '@/components/MapSearch';
import Navbar from '@/components/navbar';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RadiusSearchContent() {
  const searchParams = useSearchParams();
  const category = searchParams?.get('category') || '';
  const q = searchParams?.get('q') || '';
  
  const displayTitle = category || q || 'Tumakuru';
  
  return (
    <main className="flex flex-col h-[100dvh] w-full bg-white dark:bg-[#0c1220] pt-[65px] md:pt-[75px] overflow-hidden">
      <Navbar />
      
      {/* Yelp Style Full Screen Map Header */}
      <div className="bg-white dark:bg-[#0c1220] border-b border-slate-200 dark:border-slate-800 px-4 py-3 shrink-0 z-10 shadow-sm relative">
        <h1 className="text-lg md:text-xl font-black text-slate-900 dark:text-white capitalize truncate">
          Explore <span className="text-red-600 dark:text-sky-500">{displayTitle}</span> Near You
        </h1>
      </div>

      <div className="flex-grow min-h-0 w-full relative">
        <MapSearch initialQ={q} initialCategory={category} />
      </div>
    </main>
  );
}

export default function RadiusSearchPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading map...</div>}>
      <RadiusSearchContent />
    </Suspense>
  );
}
