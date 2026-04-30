import api from './api';
import { BusinessListing } from './courses';

const getFullUrl = (path: string | undefined | null) => {
  if (!path) return "/placeholder-image.webp";
  if (path.includes('res.cloudinary.com')) return path;

  if (path.includes('image/upload')) {
    let cleanPath = path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    if (cleanPath.startsWith(baseUrl)) cleanPath = cleanPath.slice(baseUrl.length);
    else if (cleanPath.startsWith('http://localhost:8000')) cleanPath = cleanPath.slice('http://localhost:8000'.length);

    cleanPath = cleanPath.replace('/media/', '').replace('image/upload/', '').replace(/^\//, '');
    return `https://res.cloudinary.com/dsvh7may9/image/upload/${cleanPath}`;
  }

  if (path.startsWith('http')) return path;
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  const cleanPath = path.replace(/^\//, '');
  if (cleanPath.startsWith('media/')) return `${baseUrl}/${cleanPath}`;
  return `${baseUrl}/media/${cleanPath}`;
};

export const getSupabaseBusinesses = async (options: any = {}): Promise<BusinessListing[]> => {
  try {
    const res = await api.get('/businesses/', { params: options });
    const results = res.data?.results || res.data || [];
    return results.map((biz: any) => ({
      ...biz,
      main_image_upload: getFullUrl(biz.main_image_upload)
    }));
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return [];
  }
};

export const getSupabaseBusinessBySlug = async (slug: string): Promise<BusinessListing | null> => {
  try {
    const res = await api.get(`/businesses/${slug}/`);
    const biz = res.data;
    if (biz) {
      biz.main_image_upload = getFullUrl(biz.main_image_upload);
      if (biz.gallery_images) {
        biz.gallery_images = biz.gallery_images.map((img: any) => getFullUrl(img.image || img));
      }
    }
    return biz;
  } catch (error) {
    return null;
  }
};

export const getSupabaseCategories = async () => {
  try {
    const res = await api.get('/categories/');
    return res.data?.results || res.data || [];
  } catch (error) {
    return [];
  }
};

export const getSupabaseBanners = async () => {
  try {
    const res = await api.get('/banners/');
    const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
    return data.map((b: any) => ({ ...b, image_url: getFullUrl(b.image_url) }));
  } catch (error) {
    return [];
  }
};

export const getSupabaseArticles = async (type?: string) => {
  try {
    const res = await api.get('/articles/', { params: { type } });
    const results = res.data?.results || res.data || [];
    return results.map((a: any) => ({ ...a, image_url: getFullUrl(a.image_upload || a.image_url) }));
  } catch (error) {
    return [];
  }
};

// 🚀 ಫಿಕ್ಸ್: ಈ ಫಂಕ್ಷನ್ ಮಿಸ್ ಆಗಿದ್ದಕ್ಕೆ "Not a function" ಎರ್‍ರರ್ ಬರುತ್ತಿತ್ತು
export const getSupabaseSocialPosts = async () => {
  try {
    const res = await api.get('/social-posts/');
    const results = res.data?.results || res.data || [];
    return results.map((post: any) => ({
      ...post,
      image_url: getFullUrl(post.image_upload || post.image_url || post.thumbnail_url)
    }));
  } catch (error) {
    return [];
  }
};

export const getSupabaseRecentReviews = async () => {
  try {
    const res = await api.get('/recent-reviews/');
    return res.data?.results || res.data || [];
  } catch (error) {
    return [];
  }
};

export const getNearbySupabaseBusinesses = async (lat: number, lng: number, radius: number = 5000) => {
  return await getSupabaseBusinesses({ lat, lng, radius });
};
// --- BACKWARD COMPATIBILITY / MIGRATION FIXES ---
export const getSupabaseReviewsForBusiness = async (slugOrId: string, userId?: string) => {
  try {
    // Actually, Django returns nested reviews inside the business detail payload
    const res = await api.get(`/businesses/${slugOrId}/`);
    return res.data?.reviews || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const toggleSupabaseReviewReaction = async (reviewId: number, userId: string, reactionType: string) => {
  // Mocking reaction for now, or you can create a Django endpoint for it
  console.log('toggle reaction', reviewId, reactionType);
  return true;
};

export const submitSupabaseReview = async (businessId: number, data: any) => {
  return await api.post(`/businesses/${businessId}/review/`, data);
};

export const toggleSupabaseBookmark = async (businessId: number) => {
  return await api.post(`/businesses/${businessId}/bookmark/`);
};

export const getSupabaseUserDashboard = async () => {
  const res = await api.get('/user/dashboard/');
  return res.data;
};

export const submitSupabaseEnquiry = async (businessId: number, data: any) => {
  return await api.post(`/businesses/${businessId}/enquiry/`, data);
};

export const submitSupabaseSuggestion = async (businessId: number, userId: string, details: string) => {
  // If no endpoint, just mock success
  console.log('suggested edit', businessId, details);
  return true;
};

export const submitSupabaseNewBusiness = async (data: any) => {
  return await api.post('/submit-business/', data);
};

export const updateSupabaseReview = async (reviewId: number, data: any) => {
  console.log('Update review not fully implemented yet');
  return true;
};

export const deleteSupabaseReview = async (reviewId: number) => {
  console.log('Delete review not fully implemented yet');
  return true;
};

export const uploadSupabaseFile = async (file: File) => {
  console.log('Upload file logic via API instead of direct supabase');
  return 'dummy_url';
};

export const updateSupabaseUserProfile = async (userId: string, data: any) => {
  console.log('Update profile logic via API');
  return true;
};

export const getUserPublicProfile = async (userId: string) => {
  console.log('Get user public profile logic');
  return { id: userId, username: 'User' };
};

export const submitSupabaseClaim = async (businessId: number, data: any) => {
  return await api.post(`/businesses/${businessId}/claim/`, data);
};
