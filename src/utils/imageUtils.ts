/**
 * Centralized utility for resolving image URLs from both legacy Django backend
 * and the new Supabase Storage.
 */
export const getSupabaseImageUrl = (path?: string | null) => {
  if (!path) return null;
  
  // Supabase Configuration
  const projectRef = "yddhgsviyqmkxpnflpnu";
  const bucketName = "media";
  const supabaseBaseUrl = `https://${projectRef}.supabase.co/storage/v1/object/public/${bucketName}`;

  let cleanPath = path;

  // 🚨 Handle full URLs pointing to legacy local backend
  if (path.startsWith('http://127.0.0.1:8000/') || path.startsWith('http://localhost:8000/')) {
    // Extract everything after the port
    const url = new URL(path);
    cleanPath = url.pathname; // e.g. "/businesses/img.webp" or "/media/img.webp"
  } else if (path.startsWith('http')) {
    // If it's another external URL (Google, Unsplash, etc.), return as is
    return path;
  }

  // 🚀 Normalize the path for Supabase Storage
  // Remove /media/ or media/ if present (since it's the bucket name)
  if (cleanPath.startsWith('/media/')) {
    cleanPath = cleanPath.substring(7);
  } else if (cleanPath.startsWith('media/')) {
    cleanPath = cleanPath.substring(6);
  } else if (cleanPath.startsWith('/')) {
    // Remove leading slash for consistency
    cleanPath = cleanPath.substring(1);
  }

  // Final absolute Supabase URL
  return `${supabaseBaseUrl}/${cleanPath}`;
};
