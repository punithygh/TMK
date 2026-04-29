import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('🚨 Supabase URL or Anon Key is missing in .env.local');
}

// 🚀 TOP-LEVEL TRICK: Enterprise Custom Fetch with Auto-Retries & 60s Timeout
// This completely fixes the "UND_ERR_CONNECT_TIMEOUT" (10000ms) caused by Supabase Cold Starts
// Timeout is set to 60 seconds because Next.js development compilation can take 20-30 seconds.
const fetchWithRetry = async (url: RequestInfo | URL, options?: RequestInit, retries = 3): Promise<Response> => {
  try {
    const controller = new AbortController();
    // 🌍 Generous 60s timeout to prevent 'AbortError' during heavy Next.js local compilations
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    
    const response = await fetch(url, {
      ...options,
      // @ts-ignore
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (err: any) {
    const isTimeoutOrNetworkError = 
      err.name === 'AbortError' || 
      err.message?.includes('timeout') || 
      err.message?.includes('fetch failed') ||
      err.cause?.code === 'UND_ERR_CONNECT_TIMEOUT';

    if (retries > 0 && isTimeoutOrNetworkError) {
      console.warn(`⏳ Supabase Network Hiccup! Auto-retrying... (${retries} attempts left)`);
      // Exponential backoff: wait 1s, then 2s, then 3s...
      const backoffTime = (4 - retries) * 1000;
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: fetchWithRetry,
  },
});
