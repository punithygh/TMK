/**
 * 🌍 GEOCODING SERVICE (GIS)
 * Uses Nominatim (OpenStreetMap) API to convert addresses to Lat/Long coordinates.
 * Respects Nominatim's Usage Policy (Rate limiting: 1 request/second).
 */

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

// Simple delay function to respect rate limits
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Converts an address string into coordinates.
 * @param address - The full address (e.g., "Sira Road, Tumakuru, Karnataka")
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  if (!address) return null;

  try {
    // 🚨 Nominatim requires a descriptive User-Agent
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TumakuruConnect-Geocoding-Service/1.0',
      }
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('⚠️ Geocoding Rate Limited. Waiting...');
        await delay(1100); // Wait and retry once
        return geocodeAddress(address);
      }
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }

    return null;
  } catch (error) {
    console.error('🚨 Geocoding Error:', error);
    return null;
  }
}

/**
 * Formats coordinates for Supabase/PostGIS ingestion
 * Returns a string in 'POINT(long lat)' format
 */
export function formatPointForPostGIS(lat: number, lng: number): string {
  return `POINT(${lng} ${lat})`;
}
