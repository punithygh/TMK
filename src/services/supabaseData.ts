/**
 * 🏠 TumkurConnect — Local Django REST API Data Service
 * All data fetches now go through the local Django backend at http://127.0.0.1:8000
 * Supabase has been fully removed. This file is a drop-in replacement.
 */

import { BusinessListing } from './courses';
import { unstable_cache } from 'next/cache';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// ─── Shared fetch helper ───────────────────────────────────────────────────────
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      console.error(`❌ API Error [${res.status}] — ${url}`);
      return null as unknown as T;
    }
    return res.json() as Promise<T>;
  } catch (err) {
    console.error(`❌ Network Error — ${url}:`, err);
    return null as unknown as T;
  }
}

// Helper to build query string from an options object (skip undefined/null/empty values)
function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const q = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '') q.set(key, String(val));
  }
  const str = q.toString();
  return str ? `?${str}` : '';
}

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 1. FETCH ALL BUSINESSES (list with filters)
// Django: GET /api/v1/businesses/?search=&category__slug=&ordering=&...
// ─────────────────────────────────────────────────────────────────────────────
export const getSupabaseBusinessesRaw = async (options: {
  category?: string;
  search?: string;
  star_rating?: string;
  is_verified?: string;
  is_featured?: string;
  is_top_search?: string;
  is_trusted?: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
} = {}): Promise<BusinessListing[]> => {
  const params: Record<string, string | number | undefined> = {};

  if (options.search)        params['search']             = options.search;
  if (options.category)      params['category__slug']     = options.category;
  if (options.star_rating)   params['rating__gte']        = options.star_rating;
  if (options.is_verified === 'true')   params['is_verified']   = 'true';
  if (options.is_featured === 'true')   params['is_featured']   = 'true';
  if (options.is_top_search === 'true') params['is_top_search'] = 'true';
  if (options.is_trusted === 'true')    params['is_trusted']    = 'true';
  if (options.limit)         params['page_size']          = options.limit;
  if (options.sort_by === 'rating')  params['ordering']   = '-rating';
  else if (options.sort_by === 'popular') params['ordering'] = '-page_views';

  // Django CursorPagination — use page_size, results are in data.results[]
  const data = await apiFetch<{ results?: BusinessListing[]; next?: string } | BusinessListing[]>(
    `/api/v1/businesses/${buildQuery(params)}`
  );
  if (!data) return [];

  // Handle both paginated (results[]) and plain array responses
  const list = Array.isArray(data) ? data : (data as any).results ?? [];
  return list as BusinessListing[];
};

// 🚀 1A. Cached version (server components)
export const getSupabaseBusinesses = unstable_cache(
  getSupabaseBusinessesRaw,
  ['django-businesses-v1'],
  { revalidate: 3600, tags: ['businesses'] }
);

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 2. FETCH SINGLE BUSINESS BY SLUG
// Django: GET /api/v1/businesses/<slug>/
// ─────────────────────────────────────────────────────────────────────────────
export const getSupabaseBusinessBySlug = async (slug: string): Promise<BusinessListing | null> => {
  console.log(`🔍 Fetching business by slug: ${slug}`);
  const data = await apiFetch<BusinessListing>(`/api/v1/businesses/${slug}/`);
  if (!data) {
    console.warn(`⚠️ Business not found for slug: ${slug}`);
    return null;
  }
  // Django uses latitude/longitude — map to lat/lng used by frontend components
  const normalized: any = {
    ...data,
    lat: (data as any).latitude ?? (data as any).lat,
    lng: (data as any).longitude ?? (data as any).lng,
    is_open: (data as any).is_currently_open ?? (data as any).is_open,
    review_count: (data as any).review_count ?? (data as any).reviews?.length ?? 0,
  };
  return normalized as BusinessListing;
};


// ─────────────────────────────────────────────────────────────────────────────
// 🚀 3. GIS NEARBY SEARCH  (PostGIS RPC — still via Django)
// Django: GET /api/v1/businesses/?lat=&lng=&radius=  (future endpoint)
// Falls back to empty until a Django nearby endpoint is wired up.
// ─────────────────────────────────────────────────────────────────────────────
export const getNearbySupabaseBusinesses = async (
  lat: number, lng: number, radius: number = 5000
): Promise<BusinessListing[]> => {
  console.log(`🔍 Nearby search [${lat}, ${lng}] r=${radius}m`);
  const data = await apiFetch<{ results?: BusinessListing[] } | BusinessListing[]>(
    `/api/v1/businesses/${buildQuery({ lat, lng, radius })}`
  );
  if (!data) return [];
  return Array.isArray(data) ? data : (data as any).results ?? [];
};

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 4. FETCH BANNERS (cached)
// Django: GET /api/v1/banners/
// ─────────────────────────────────────────────────────────────────────────────
const _getSupabaseBanners = async () => {
  const data = await apiFetch<any[]>('/api/v1/banners/');
  // BannerSerializer already returns image_url — no remapping needed
  return data || [];
};

export const getSupabaseBanners = unstable_cache(
  _getSupabaseBanners,
  ['django-banners-v1'],
  { revalidate: 3600, tags: ['banners'] }
);

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 5. FETCH CATEGORIES (cached)
// Django: GET /api/v1/categories/
// ─────────────────────────────────────────────────────────────────────────────
const _getSupabaseCategories = async () => {
  const data = await apiFetch<{ results?: any[] } | any[]>('/api/v1/categories/');
  if (!data) return [];
  return Array.isArray(data) ? data : (data as any).results ?? [];
};
export const getSupabaseCategories = unstable_cache(
  _getSupabaseCategories,
  ['django-categories-v1'],
  { revalidate: 3600, tags: ['categories'] }
);

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 6. FETCH ARTICLES (cached)
// Django: GET /api/v1/articles/?type=
// ─────────────────────────────────────────────────────────────────────────────
const _getSupabaseArticles = async (type?: string) => {
  const params = type ? `?type=${type}` : '';
  const data = await apiFetch<{ results?: any[] } | any[]>(`/api/v1/articles/${params}`);
  if (!data) return [];
  const list = Array.isArray(data) ? data : (data as any).results ?? [];
  return list.map((a: any) => ({ ...a, image_url: a.image_upload || a.image_url, type_display: a.type }));
};
export const getSupabaseArticles = unstable_cache(
  _getSupabaseArticles,
  ['django-articles-v1'],
  { revalidate: 3600, tags: ['articles'] }
);

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 7. FETCH SOCIAL POSTS (cached)
// Django: GET /api/v1/social-posts/
// ─────────────────────────────────────────────────────────────────────────────
const _getSupabaseSocialPosts = async () => {
  const data = await apiFetch<{ results?: any[] } | any[]>('/api/v1/social-posts/');
  if (!data) return [];
  return Array.isArray(data) ? data : (data as any).results ?? [];
};
export const getSupabaseSocialPosts = unstable_cache(
  _getSupabaseSocialPosts,
  ['django-social-v1'],
  { revalidate: 3600, tags: ['social'] }
);

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 8. FETCH RECENT REVIEWS (cached)
// Django: GET /api/v1/recent-reviews/
// ─────────────────────────────────────────────────────────────────────────────
const _getSupabaseRecentReviews = async () => {
  const data = await apiFetch<any[]>('/api/v1/recent-reviews/');
  return data || [];
};
export const getSupabaseRecentReviews = unstable_cache(
  _getSupabaseRecentReviews,
  ['django-recent-reviews-v1'],
  { revalidate: 3600, tags: ['reviews'] }
);

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 9. FETCH REVIEWS FOR A BUSINESS
// Django: GET /api/v1/businesses/<slug>/  → reviews[] are embedded in the detail serializer
// ─────────────────────────────────────────────────────────────────────────────
export const getSupabaseReviewsForBusiness = async (
  businessIdOrSlug: number | string,
  _currentUserId?: number
): Promise<any[]> => {
  console.log(`🔍 Fetching reviews for business: ${businessIdOrSlug}`);
  const data = await apiFetch<any>(`/api/v1/businesses/${businessIdOrSlug}/`);
  if (!data) return [];
  return data.reviews ?? [];
};

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 10. TOGGLE REVIEW REACTION (placeholder — not yet in Django API)
// ─────────────────────────────────────────────────────────────────────────────
export const toggleSupabaseReviewReaction = async (
  _reviewId: number,
  _userId: number,
  _reactionType: 'HELPFUL' | 'FUNNY' | 'COOL'
): Promise<{ status: 'added' | 'removed' }> => {
  console.warn('⚠️ toggleSupabaseReviewReaction: Not yet implemented in Django API');
  return { status: 'added' };
};

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 11. FETCH USER PUBLIC PROFILE
// Django: GET /api/v1/me/  (authenticated) — no public profile endpoint yet
// ─────────────────────────────────────────────────────────────────────────────
export const getUserPublicProfile = async (userId: number) => {
  console.log(`👤 Fetching public profile for user ID: ${userId}`);
  // No public profile endpoint in Django yet — return a safe default
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 12. FETCH USER DASHBOARD (Reviews & Bookmarks)
// Django: GET /api/v1/user/dashboard/  (authenticated — requires JWT)
// ─────────────────────────────────────────────────────────────────────────────
export const getSupabaseUserDashboard = async (userId: number, accessToken?: string) => {
  console.log(`📊 Fetching dashboard for user ID: ${userId}`);
  const data = await apiFetch<any>('/api/v1/user/dashboard/', {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  if (!data) return { my_reviews: [], my_bookmarks: [], is_elite: false, review_count: 0, photo_count: 0, gamification: { points: 0, badge: 'Newbie' }, profile: null };
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 13. SUBMIT A REVIEW
// Django: POST /api/v1/businesses/<id>/review/  (authenticated)
// ─────────────────────────────────────────────────────────────────────────────
export const submitSupabaseReview = async (
  businessId: number,
  _userId: number,
  rating: number,
  comment: string,
  accessToken?: string
) => {
  console.log(`✍️ Submitting review for business ${businessId}`);
  const data = await apiFetch<any>(`/api/v1/businesses/${businessId}/review/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ rating, comment }),
  });
  if (!data) throw new Error('Review submission failed');
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 14. TOGGLE BOOKMARK
// Django: POST /api/v1/businesses/<id>/bookmark/  (authenticated)
// ─────────────────────────────────────────────────────────────────────────────
export const toggleSupabaseBookmark = async (
  businessId: number,
  _userId: number,
  accessToken?: string
) => {
  console.log(`🔖 Toggling bookmark for business ${businessId}`);
  const data = await apiFetch<{ status: 'added' | 'removed' }>(
    `/api/v1/businesses/${businessId}/bookmark/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    }
  );
  if (!data) throw new Error('Bookmark toggle failed');
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 15. SUBMIT ENQUIRY
// Django: POST /api/v1/businesses/<id>/enquiry/
// ─────────────────────────────────────────────────────────────────────────────
export const submitSupabaseEnquiry = async (
  businessId: number,
  data: { customer_name: string; phone_number: string }
) => {
  console.log(`📩 Submitting enquiry for business ${businessId}`);
  const result = await apiFetch<any>(`/api/v1/businesses/${businessId}/enquiry/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!result) throw new Error('Enquiry submission failed');
  return result;
};

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 16. SUBMIT EDIT SUGGESTION (Not in Django yet — stub)
// ─────────────────────────────────────────────────────────────────────────────
export const submitSupabaseSuggestion = async (
  businessId: number,
  _userId: number,
  suggestion: string
) => {
  console.warn(`💡 submitSupabaseSuggestion: No Django endpoint yet for business ${businessId}`);
  return { id: null, suggested_changes: suggestion };
};

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 17. SUBMIT BUSINESS CLAIM
// Django: POST /api/v1/businesses/<id>/claim/  (authenticated)
// ─────────────────────────────────────────────────────────────────────────────
export const submitSupabaseClaim = async (
  businessId: number,
  _userId: number,
  data: { contact_info: string; details: string },
  accessToken?: string
) => {
  console.log(`🛡️ Submitting claim for business ${businessId}`);
  const result = await apiFetch<any>(`/api/v1/businesses/${businessId}/claim/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ contact_info: data.contact_info, message: data.details }),
  });
  if (!result) throw new Error('Claim submission failed');
  return result;
};

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 18. UPLOAD FILE TO CLOUDINARY (unchanged — still via Next.js API)
// ─────────────────────────────────────────────────────────────────────────────
export const uploadSupabaseFile = async (file: File, folder: string = 'media') => {
  let finalFile = file;
  if (file.type.startsWith('image/')) {
    try {
      const { compressImage } = await import('@/utils/imageCompression');
      finalFile = await compressImage(file, 1600, 0.85);
      console.log(`📉 Compressed: ${(file.size / 1024).toFixed(1)}KB → ${(finalFile.size / 1024).toFixed(1)}KB`);
    } catch (err) {
      console.error('Compression failed, uploading original', err);
    }
  }

  const signRes = await fetch('/api/cloudinary-sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder }),
  });
  if (!signRes.ok) throw new Error('Failed to get Cloudinary signature');

  const { signature, timestamp, apiKey, cloudName, folder: cFolder } = await signRes.json();

  const formData = new FormData();
  formData.append('file', finalFile);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', cFolder);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!uploadRes.ok) {
    const errData = await uploadRes.json();
    throw new Error(`Cloudinary upload failed: ${errData.error?.message || 'Unknown error'}`);
  }

  const data = await uploadRes.json();
  return data.secure_url;
};

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 19. SUBMIT NEW BUSINESS REQUEST
// Django: POST /api/v1/submit-business/
// ─────────────────────────────────────────────────────────────────────────────
export const submitSupabaseNewBusiness = async (formData: any, filePaths: string[]) => {
  console.log(`🏢 Submitting new business: ${formData.business_name}`);
  const payload = {
    ...formData,
    image_1: filePaths[0] || null,
    image_2: filePaths[1] || null,
    image_3: filePaths[2] || null,
    image_4: filePaths[3] || null,
    image_5: filePaths[4] || null,
  };
  const data = await apiFetch<any>('/api/v1/submit-business/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!data) throw new Error('Business submission failed');
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 20. UPDATE A REVIEW (stub — no PATCH endpoint yet in Django)
// ─────────────────────────────────────────────────────────────────────────────
export const updateSupabaseReview = async (
  reviewId: number,
  rating: number,
  comment: string,
  accessToken?: string
) => {
  console.log(`📝 Updating review ${reviewId}`);
  // Django doesn't expose a review update endpoint yet — stub
  console.warn('⚠️ updateSupabaseReview: No Django PATCH endpoint yet');
  return { id: reviewId, rating, comment };
};

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 21. DELETE A REVIEW (stub — no DELETE endpoint yet in Django)
// ─────────────────────────────────────────────────────────────────────────────
export const deleteSupabaseReview = async (
  _reviewId: number,
  _accessToken?: string
) => {
  console.warn('⚠️ deleteSupabaseReview: No Django DELETE endpoint yet');
  return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 22. UPDATE USER PROFILE (stub — use /api/v1/me/ PATCH when available)
// ─────────────────────────────────────────────────────────────────────────────
export const updateSupabaseUserProfile = async (
  _userId: number,
  updates: { first_name?: string; last_name?: string; profile_image?: string },
  accessToken?: string
) => {
  console.log(`👤 Updating profile`);
  const data = await apiFetch<any>('/api/v1/me/', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(updates),
  });
  return data;
};
