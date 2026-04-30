import api from './api';
import { BusinessListing } from './courses';

const getFullUrl = (path: string | undefined | null) => {
  if (!path) return null;
  if (path.includes('res.cloudinary.com')) return path;

  if (path.includes('image/upload')) {
    let cleanPath = path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (cleanPath.startsWith(baseUrl)) cleanPath = cleanPath.slice(baseUrl.length);
    else if (cleanPath.startsWith('http://localhost:8000')) cleanPath = cleanPath.slice('http://localhost:8000'.length);

    cleanPath = cleanPath.replace('/media/', '').replace('image/upload/', '').replace(/^\//, '');
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
    return `https://res.cloudinary.com/${cloudName}/image/upload/${cleanPath}`;
  }

  if (path.startsWith('http')) return path;
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
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
  // Placeholder reaction for now, or you can create a Django endpoint for it
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
  // If no endpoint, just simulate success
  console.log('suggested edit', businessId, details);
  return true;
};



export const submitSupabaseClaim = async (businessId: number, data: any) => {
  return await api.post(`/businesses/${businessId}/claim/`, data);
};

export const submitSupabaseNewBusiness = async (data: any, uploadedPaths?: string[]) => {
  return await api.post('/submit-business/', { ...data, images: uploadedPaths });
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
  return '';
};

export const updateSupabaseUserProfile = async (userId: string, data: any) => {
  console.log('Update profile logic via API');
  return true;
};

export const getUserPublicProfile = async (userId: string) => {
  console.log('Get user public profile logic');
  return { id: userId, username: 'User' };
};
