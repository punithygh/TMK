/**
 * 🚀 YELP-GRADE Image Utility - Tumkurconnect (Fixed for Double URLs)
 */

export type ImageContext = 'card' | 'hero' | 'thumb' | 'gallery';

interface ImageOptions {
  context?: ImageContext;
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
  fallbackCategory?: string;
}

export const getSupabaseImageUrl = (path?: string | null, options?: ImageOptions): string | null => {
  if (!path) {
    if (options?.fallbackCategory) {
      const cat = options.fallbackCategory.toLowerCase();
      if (cat.includes('hotel') || cat.includes('pg') || cat.includes('hostel'))
        return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
      if (cat.includes('hospital') || cat.includes('doctor'))
        return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80';
      if (cat.includes('restaurant') || cat.includes('food'))
        return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
      if (cat.includes('shop') || cat.includes('store'))
        return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80';
      if (cat.includes('education') || cat.includes('school'))
        return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80';
      return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
    }
    return null;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

  // 1. If it's already a full Cloudinary URL, return it directly
  if (path.includes('res.cloudinary.com')) {
    return path;
  }

  // Check if it's a Cloudinary path (contains image/upload)
  if (path.includes('image/upload')) {
    let cleanPath = path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (cleanPath.startsWith(baseUrl)) cleanPath = cleanPath.slice(baseUrl.length);
    else if (cleanPath.startsWith('http://localhost:8000')) cleanPath = cleanPath.slice('http://localhost:8000'.length);

    cleanPath = cleanPath.replace('/media/', '').replace('image/upload/', '').replace(/^\//, '');
    return `https://res.cloudinary.com/${cloudName}/image/upload/${cleanPath}`;
  }

  // It's a local media file
  if (path.startsWith('http')) return path;
  
  let baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  if (typeof window !== 'undefined') {
    try {
      const url = new URL(baseUrl);
      if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') {
        baseUrl = ''; // Use relative path, Next.js rewrite proxy will handle it
      }
    } catch (e) {}
  }

  const cleanPath = path.replace(/^\//, '');
  if (cleanPath.startsWith('media/')) {
    return baseUrl ? `${baseUrl}/${cleanPath}` : `/${cleanPath}`;
  }
  return baseUrl ? `${baseUrl}/media/${cleanPath}` : `/media/${cleanPath}`;
};