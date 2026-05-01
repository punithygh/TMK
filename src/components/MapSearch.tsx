"use client";

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { getNearbySupabaseBusinesses } from '@/services/legacyStubs';
import { useLanguage } from '@/context/LanguageContext';
import { Search, MapPin, Navigation, Slider, Star, Phone, Info } from 'lucide-react';
import { getSupabaseImageUrl } from '@/utils/imageUtils';
import Link from 'next/link';

// 🚀 DYNAMIC IMPORT TO PREVENT SSR ISSUES WITH LEAFLET
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });
const useMap = dynamic(() => import('react-leaflet').then(mod => mod.useMap), { ssr: false });

interface Business {
  id: number;
  name: string;
  name_kn: string;
  address: string;
  slug: string;
  rating: number;
  main_image_upload?: string;
  location: {
    coordinates: [number, number]; // [long, lat]
  } | string;
  dist_meters?: number;
}

interface MapSearchProps {
  initialQ?: string;
  initialCategory?: string;
}

export default function MapSearch({ initialQ, initialCategory }: MapSearchProps) {
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<[number, number]>([13.3392, 77.1140]); // Default: Tumkur Center
  const [radius, setRadius] = useState(5000); // 5km default
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map'); // Default to map on mobile

  // 📍 Fix for Leaflet marker icons in Next.js
  useEffect(() => {
    const initLeaflet = async () => {
      const L = (await import('leaflet')).default;
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    };
    initLeaflet();
  }, []);

  const fetchNearby = async (lat: number, lng: number, rad: number, q?: string, cat?: string) => {
    setLoading(true);
    try {
      const data = await getNearbySupabaseBusinesses(lat, lng, rad, q, cat);
      setBusinesses(data || []);
    } catch (err) {
      console.error('🚨 fetchNearby Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearby(userLocation[0], userLocation[1], radius, initialQ, initialCategory);
  }, [userLocation, radius, initialQ, initialCategory]);

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      }, (err) => {
        console.error("Geolocation error:", err);
        alert(t("ಸ್ಥಳ ಪತ್ತೆಹಚ್ಚಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ", "Could not detect location. Please check browser permissions."));
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-white dark:bg-[#0c1220] overflow-hidden relative">
      
      {/* 📱 Mobile Toggle (Yelp Style) */}
      <div className="lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[100] flex bg-white dark:bg-slate-900 rounded-full shadow-2xl border border-slate-200 dark:border-slate-700 p-1">
        <button 
          onClick={() => setViewMode('list')}
          className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-red-600 dark:bg-sky-500 text-white shadow-lg' : 'text-slate-600 dark:text-slate-400'}`}
        >
          <Search size={14} /> {t("ಪಟ್ಟಿ", "List")}
        </button>
        <button 
          onClick={() => setViewMode('map')}
          className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'map' ? 'bg-red-600 dark:bg-sky-500 text-white shadow-lg' : 'text-slate-600 dark:text-slate-400'}`}
        >
          <MapPin size={14} /> {t("ಮ್ಯಾಪ್", "Map")}
        </button>
      </div>

      {/* 🛠️ Sidebar Control & List */}
      <div className={`w-full lg:w-[380px] flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0c1220]/50 shrink-0 ${viewMode === 'map' ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 backdrop-blur-md">
          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="text-red-600 dark:text-sky-500" />
            {t("Radius Search", "Radius Search")}
          </h2>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  {t("Search Radius", "Search Radius")}
                </label>
                <span className="text-xs font-black text-red-600 dark:text-sky-500 bg-red-50 dark:bg-sky-500/10 px-2 py-0.5 rounded-md">
                  {radius / 1000} km
                </span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="30000" 
                step="500" 
                value={radius} 
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600 dark:accent-sky-500"
              />
            </div>

            <button 
              onClick={handleGetCurrentLocation}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm"
            >
              <Navigation size={16} />
              {t("Use My Location", "Use My Location")}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          <div className="flex justify-between items-center px-1 mb-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
              {loading ? t("ಹುಡುಕಲಾಗುತ್ತಿದೆ...", "Finding businesses...") : `${businesses.length} ${t("ಬ್ಯುಸಿನೆಸ್‌ಗಳು", "Results found")}`}
            </p>
          </div>
          
          {businesses.length > 0 ? businesses.map((biz, idx) => {
            const bizImg = getSupabaseImageUrl(biz.main_image_upload);
            return (
              <Link key={biz.id} href={`/business/${biz.slug}`} className="block p-3 bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 rounded-xl hover:shadow-lg hover:border-red-600/20 dark:hover:border-sky-500/20 transition-all group relative overflow-hidden">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                    {bizImg ? (
                      <img src={bizImg} alt={biz.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><Info size={20} /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1 text-sm">
                      {t(biz.name_kn, biz.name)}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={10} className="fill-amber-500 text-amber-500" />
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{Number(biz.rating || 5).toFixed(1)}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 font-medium">
                      {biz.address}
                    </p>
                  </div>
                </div>
              </Link>
            );
          }) : !loading && (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-center px-4">
              <Search size={40} className="mb-3 opacity-20" />
              <p className="text-sm font-bold">{t("ಯಾವುದೇ ಬ್ಯುಸಿನೆಸ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ", "No businesses found in this area")}</p>
              <p className="text-xs mt-1">{t("ತ್ರಿಜ್ಯವನ್ನು ಹೆಚ್ಚಿಸಿ ನೋಡಿ", "Try increasing the search radius")}</p>
            </div>
          )}
        </div>
      </div>

      {/* 🗺️ Map Display */}
      <div className={`flex-1 relative ${viewMode === 'list' ? 'hidden lg:block' : 'block'} h-full`}>
        <MapContainer 
          // @ts-ignore
          center={userLocation} 
          zoom={13} 
          className="h-full w-full z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Circle 
            center={userLocation} 
            radius={radius} 
            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, weight: 1 }}
          />

          <Marker position={userLocation}>
            <Popup className="custom-popup">
              <div className="font-bold text-xs">{t("ನಿಮ್ಮ ಸ್ಥಳ", "You are here")}</div>
            </Popup>
          </Marker>

          {businesses.map((biz, idx) => {
            let coords: [number, number] = [0, 0];
            if (typeof biz.location === 'string' && biz.location.startsWith('POINT')) {
                const parts = biz.location.replace('POINT(', '').replace(')', '').split(' ');
                coords = [parseFloat(parts[1]), parseFloat(parts[0])]; // [lat, long]
            } else if (biz.location && typeof biz.location === 'object' && biz.location.coordinates) {
                // GeoJSON format: { type: 'Point', coordinates: [lng, lat] }
                coords = [biz.location.coordinates[1], biz.location.coordinates[0]];
            } else if ((biz as any).lat && (biz as any).lng) {
                coords = [parseFloat((biz as any).lat), parseFloat((biz as any).lng)];
            }

            if (coords[0] === 0 || isNaN(coords[0])) return null;

            return (
              <Marker key={biz.id} position={coords}>
                <Popup className="custom-popup">
                  <Link href={`/business/${biz.slug}`} className="block p-1">
                    <h4 className="font-bold text-xs mb-0.5 text-red-600">{idx+1}. {t(biz.name_kn, biz.name)}</h4>
                    <p className="text-[10px] text-gray-600 line-clamp-1">{biz.address}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={10} className="fill-amber-500 text-amber-500" />
                      <span className="text-[10px] font-bold">{Number(biz.rating || 5).toFixed(1)}</span>
                    </div>
                  </Link>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* 🗺️ Floating Legend for Desktop */}
        <div className="hidden md:block absolute top-4 right-4 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border border-white/20">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t("ಮಾಹಿತಿ", "Map Info")}</p>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{t("ನೀವು ಇಲ್ಲಿದ್ದೀರಿ", "Your Location")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{t("ಬ್ಯುಸಿನೆಸ್‌ಗಳು", "Businesses")}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
        .leaflet-popup-content-wrapper { border-radius: 12px; padding: 0; overflow: hidden; }
        .leaflet-popup-content { margin: 8px 12px; min-width: 150px !important; }
      `}</style>
    </div>
  );
}
