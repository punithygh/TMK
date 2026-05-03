"use client";

import MapSearch from '@/components/features/business/MapSearch';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RadiusSearchContent() {
  const searchParams = useSearchParams();
  const category = searchParams?.get('category') || '';
  const q = searchParams?.get('q') || '';
  
  const displayTitle = category || q || 'Tumakuru';
  
  return (
    <div className="flex flex-col h-[calc(100dvh-75px)] md:h-[calc(100dvh-85px)] w-full bg-white dark:bg-[#0c1220] overflow-hidden">
      {/* Yelp Style Full Screen Map Header */}
      <div className="bg-white dark:bg-[#0c1220] border-b border-slate-200 dark:border-slate-800 px-4 py-3 shrink-0 z-10 shadow-sm">
        <h1 className="text-lg md:text-xl font-black text-slate-900 dark:text-white capitalize truncate">
          Explore <span className="text-red-600 dark:text-sky-500">{displayTitle}</span> Near You
        </h1>
      </div>

      <div className="flex-grow min-h-0 w-full relative">
        <MapSearch initialQ={q} initialCategory={category} />
      </div>
    </div>
  );
}

export default function RadiusSearchPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading map...</div>}>
      <RadiusSearchContent />
    </Suspense>
  );
}
