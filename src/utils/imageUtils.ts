/**
 * Centralized utility for resolving image URLs from both legacy Django backend
 * and the new Supabase Storage.
 * 
 * 🚀 YELP-GRADE: Auto-serves WebP format by default via Supabase Image Transformation
 * This reduces image size by 60-70% for faster page loads (better LCP score)
 */
export const getSupabaseImageUrl = (path?: string | null, options?: { width?: number, height?: number, quality?: number, format?: string, fallbackCategory?: string }) => {
  if (!path) {
    if (options?.fallbackCategory) {
      const cat = options.fallbackCategory.toLowerCase();
      if (cat.includes('hotel') || cat.includes('pg') || cat.includes('hostel')) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
      if (cat.includes('hospital') || cat.includes('doctor')) return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80';
      if (cat.includes('restaurant') || cat.includes('food')) return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';
      if (cat.includes('shop') || cat.includes('store')) return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80';
      if (cat.includes('education') || cat.includes('school')) return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80';
      // Default premium modern building/business placeholder
      return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';
    }
    return null;
  }

  // Supabase Configuration
  const projectRef = "yddhgsviyqmkxpnflpnu";
  const bucketName = "media";
  const supabaseBaseUrl = `https://${projectRef}.supabase.co/storage/v1/object/public/${bucketName}`;

  let cleanPath = path;

  // 🚨 Handle full URLs
  if (path.startsWith('http://127.0.0.1:8000/') || path.startsWith('http://localhost:8000/')) {
    const url = new URL(path);
    cleanPath = url.pathname;
  } else if (path.startsWith('http')) {
    // External URLs (e.g. Google CDN) — return as-is
    return path;
  }

  // 🚀 Normalize the path
  if (cleanPath.startsWith('/media/')) {
    cleanPath = cleanPath.substring(7);
  } else if (cleanPath.startsWith('media/')) {
    cleanPath = cleanPath.substring(6);
  } else if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }

  // 🚀 YELP-GRADE: Ultra-High Clarity (AVIF + 80% Quality)
  const renderUrl = `https://${projectRef}.supabase.co/storage/v1/render/image/public/${bucketName}/${cleanPath}`;
  const params = new URLSearchParams();
  
  // Settings for Top-Level Website Quality:
  // 1. Format: 'avif' (Superior clarity over WebP, used by top-tier sites)
  // 2. Width: 1600px (Retina-ready resolution for crisp details)
  // 3. Quality: 85 (Requested 85% quality balance for maximum clarity)
  params.append('width', (options?.width || 1600).toString());
  params.append('quality', (options?.quality || 85).toString());
  params.append('format', options?.format || 'avif'); // AVIF is the gold standard for clarity
  
  params.append('resize', 'cover');
  if (options?.height) params.append('height', options.height.toString());

  return `${renderUrl}?${params.toString()}`;
};
