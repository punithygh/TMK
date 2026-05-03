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

export const getBusinesses = async (options: any = {}): Promise<BusinessListing[]> => {
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

export const getBusinessesWithCount = async (options: any = {}): Promise<{ results: BusinessListing[], count: number }> => {
  try {
    const res = await api.get('/businesses/', { params: options });
    const results = res.data?.results || res.data || [];
    const count = res.data?.count ?? results.length;
    
    const mappedResults = results.map((biz: any) => ({
      ...biz,
      main_image_upload: getFullUrl(biz.main_image_upload)
    }));
    
    return { results: mappedResults, count };
  } catch (error) {
    console.error('Error fetching businesses with count:', error);
    return { results: [], count: 0 };
  }
};

export const getNearbyBusinesses = async (lat: number, lng: number, radius: number = 5000, search?: string, category?: string) => {
  return await getBusinesses({ lat, lng, radius, search, category });
};

// Reviews
export const getReviewsForBusiness = async (slugOrId: string, userId?: string) => {
  try {
    // Django returns nested reviews inside the business detail payload
    const res = await api.get(`/businesses/${slugOrId}/`);
    return res.data?.reviews || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const submitReview = async (businessId: number, data: any) => {
  return await api.post(`/businesses/${businessId}/review/`, data);
};

export const toggleReviewReaction = async (reviewId: number, userId: string, reactionType: string) => {
  try {
    const res = await api.post(`/reviews/${reviewId}/react/`, { reaction_type: reactionType });
    return res.data;
  } catch (error) {
    console.error('Error toggling reaction:', error);
    throw error;
  }
};

export const updateReview = async (reviewId: number, data: any) => {
  try {
    const res = await api.patch(`/reviews/${reviewId}/`, data);
    return res.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId: number) => {
  try {
    const res = await api.delete(`/reviews/${reviewId}/`);
    return res.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Actions
export const toggleBookmark = async (businessId: number) => {
  return await api.post(`/businesses/${businessId}/bookmark/`);
};

export const submitEnquiry = async (businessId: number, data: any) => {
  return await api.post(`/businesses/${businessId}/enquiry/`, data);
};

export const submitSuggestion = async (businessId: number, userId: string, details: string) => {
  try {
    const res = await api.post(`/businesses/${businessId}/suggest-edit/`, { details, user_id: userId });
    return res.data;
  } catch (error) {
    console.error('Error submitting suggestion:', error);
    throw error;
  }
};

export const submitClaim = async (businessId: number, data: any) => {
  return await api.post(`/businesses/${businessId}/claim/`, data);
};

export const submitNewBusiness = async (data: any, uploadedPaths?: string[]) => {
  return await api.post('/submit-business/', { ...data, images: uploadedPaths });
};

// Users & Uploads
export const getUserDashboard = async () => {
  const res = await api.get('/user/dashboard/');
  return res.data;
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await api.post('/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.url || '';
  } catch (error) {
    console.error('Error uploading file:', error);
    return '';
  }
};

export const updateUserProfile = async (userId: string, data: any) => {
  try {
    const res = await api.patch(`/users/${userId}/profile/`, data);
    return res.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getUserPublicProfile = async (userId: string) => {
  try {
    const res = await api.get(`/users/${userId}/public/`);
    return res.data;
  } catch (error) {
    console.error('Error fetching user public profile:', error);
    return null;
  }
};
