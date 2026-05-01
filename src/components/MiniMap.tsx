"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Maximize2, MapPin } from 'lucide-react';
import Link from 'next/link';

// 🚀 DYNAMIC IMPORT FOR LEAFLET
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface MiniMapProps {
  businesses: any[];
  center?: [number, number];
  hoveredBusinessId?: number | null;
}

export default function MiniMap({ businesses, center = [13.3392, 77.1140], hoveredBusinessId }: MiniMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    const initLeaflet = async () => {
      const leaflet = (await import('leaflet')).default;
      setL(leaflet);
    };
    initLeaflet();
  }, []);

  const createCustomIcon = (idx: number, isHovered: boolean) => {
    if (!L) return null;
    return L.divIcon({
      className: 'custom-yelp-icon',
      html: `<div class="yelp-pin shadow-lg ${isHovered ? 'scale-125 !bg-sky-500 !border-sky-300 z-50 transition-all' : 'transition-all'}"><span>${idx + 1}</span></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -28]
    });
  };

  const mapCenter = businesses.length > 0 ? (() => {
    const firstBiz = businesses.find(b => b.location);
    if (firstBiz && typeof firstBiz.location === 'string' && firstBiz.location.startsWith('POINT')) {
        const parts = firstBiz.location.replace('POINT(', '').replace(')', '').split(' ');
        return [parseFloat(parts[1]), parseFloat(parts[0])] as [number, number];
    }
    return center;
  })() : center;

  if (!isClient || !L) return <div className="h-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800" />;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md group relative">
      <div className="h-44 sm:h-52 w-full relative z-0">
        <MapContainer 
          // @ts-ignore
          center={mapCenter} 
          key={`${mapCenter[0]}-${mapCenter[1]}`}
          zoom={12} 
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {businesses.map((biz, idx) => {
            let coords: [number, number] = [0, 0];
            if (typeof biz.location === 'string' && biz.location.startsWith('POINT')) {
                const parts = biz.location.replace('POINT(', '').replace(')', '').split(' ');
                coords = [parseFloat(parts[1]), parseFloat(parts[0])]; // [lat, long]
            }
            if (coords[0] === 0) return null;

            return (
              <Marker 
                key={biz.id} 
                position={coords}
                zIndexOffset={biz.id === hoveredBusinessId ? 1000 : 0}
                // @ts-ignore
                icon={createCustomIcon(idx, biz.id === hoveredBusinessId)}
              >
                <Popup className="compact-popup">
                  <div className="p-1 font-bold text-[10px] text-red-600 flex items-center gap-1">
                    <span className="bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px]">{idx+1}</span>
                    {biz.name}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      
      {/* 📍 Overlay Controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
        <Link 
          href="/radius-search"
          className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 hover:scale-110 transition-transform text-slate-600 dark:text-slate-300"
        >
          <Maximize2 size={16} />
        </Link>
      </div>

      <div className="p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-red-600 dark:text-sky-500" />
          <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Interactive Map</span>
        </div>
        <Link href="/radius-search" className="text-[10px] font-bold text-red-600 hover:underline">View Full Map</Link>
      </div>

      <style jsx global>{`
        .compact-popup .leaflet-popup-content-wrapper { border-radius: 8px; padding: 0; }
        .compact-popup .leaflet-popup-content { margin: 4px 8px; }
        
        .yelp-pin {
          width: 28px;
          height: 28px;
          background: #ef4444;
          border: 3px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .yelp-pin span {
          transform: rotate(45deg);
          color: white;
          font-weight: 900;
          font-size: 10px;
          width: 100%;
          text-align: center;
          margin-bottom: 2px;
          margin-left: 1px;
        }
        .yelp-pin::after {
          content: "";
          width: 8px;
          height: 8px;
          background: #ffffff;
          position: absolute;
          border-radius: 50%;
          bottom: -10px;
          left: -10px;
          display: none;
        }
      `}</style>
    </div>
  );
}
