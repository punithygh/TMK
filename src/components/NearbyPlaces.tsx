"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { getNearbySupabaseBusinesses } from '@/services/legacyStubs';
import { BusinessListing } from '@/services/courses';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, Navigation, Store, Info } from 'lucide-react';
import Link from 'next/link';
import { getSupabaseImageUrl } from '@/utils/imageUtils';

// 🚀 DYNAMIC IMPORT FOR LEAFLET
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

export default function NearbyPlaces({ lat, lng, businessName }: { lat: number, lng: number, businessName: string }) {
  const { t } = useLanguage();
  const [nearby, setNearby] = useState<BusinessListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearby = async () => {
      setLoading(true);
      try {
        const data = await getNearbySupabaseBusinesses(lat, lng, 5000); // 5km radius
        setNearby(data.filter((b: any) => b.name !== businessName).slice(0, 4));
      } catch (err) {
        console.error('Nearby fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (lat && lng) fetchNearby();
  }, [lat, lng, businessName]);

  if (!lat || !lng) return null;

  return (
    <div className="mt-10 pt-10 border-t border-slate-200 dark:border-slate-800/60">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <div className="p-1.5 bg-red-600 dark:bg-sky-500 rounded-lg shadow-md">
            <Navigation size={18} className="text-white" />
          </div>
          {t("ಸಮೀಪದ ಸ್ಥಳಗಳು", "Nearby Places")}
        </h2>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{t("5 ಕಿಮೀ ಒಳಗೆ", "Within 5km")}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto">
        {/* 🗺️ Mini Map */}
        <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative shadow-xl h-[250px] lg:h-[350px] group">
          <MapContainer 
            // @ts-ignore
            center={[lat, lng]} 
            zoom={14} 
            className="h-full w-full z-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle center={[lat, lng]} radius={5000} pathOptions={{ color: '#ef4444', fillOpacity: 0.05, weight: 1 }} />
            
            <Marker position={[lat, lng]}>
              <Popup><span className="font-bold text-red-600">{businessName}</span></Popup>
            </Marker>

            {nearby.map((biz) => {
              let bizLat = (biz as any).lat;
              let bizLng = (biz as any).lng;
              if (!bizLat && typeof biz.location === 'string' && biz.location.startsWith('POINT')) {
                const parts = biz.location.replace('POINT(', '').replace(')', '').split(' ');
                bizLat = parseFloat(parts[1]);
                bizLng = parseFloat(parts[0]);
              }
              if (!bizLat) return null;
              return (
                <Marker key={biz.id} position={[bizLat, bizLng]}>
                  <Popup>
                    <div className="p-1 min-w-[120px]">
                      <p className="font-black text-xs text-slate-900 mb-1">{t(biz.name_kn || '', biz.name)}</p>
                      <Link href={`/business/${biz.slug}`} className="text-[10px] bg-red-600 text-white px-2 py-1 rounded inline-block font-bold hover:bg-red-700 transition-colors">View Details</Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* 📋 List */}
        <div className="lg:col-span-5 flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
          {loading ? (
             [1,2,3].map(i => <div key={i} className="h-20 bg-slate-50 dark:bg-slate-800/30 animate-pulse rounded-xl border border-slate-100 dark:border-slate-800" />)
          ) : nearby.length > 0 ? (
            nearby.map((biz) => {
              const bizImg = getSupabaseImageUrl(biz.main_image_upload || biz.image_url);
              return (
                <Link key={biz.id} href={`/business/${biz.slug}`} className="p-2.5 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 rounded-xl hover:shadow-lg hover:border-red-600/30 dark:hover:border-sky-500/30 transition-all group flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700/50">
                    {bizImg ? (
                      <img src={bizImg} alt={biz.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><Store size={18} /></div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate group-hover:text-red-600 dark:group-hover:text-sky-400 transition-colors">{t(biz.name_kn || '', biz.name)}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 font-medium">
                      <MapPin size={10} className="text-red-600/50" />
                      {biz.area}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <Info className="text-slate-300 dark:text-slate-700 mb-2" size={24} />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold italic">{t("ಯಾವುದೂ ಸಿಗಲಿಲ್ಲ", "No nearby places found")}</p>
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>
  );
}
