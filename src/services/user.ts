import api from './api';
import { BusinessListing } from './courses';

export interface UserReview {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  business?: BusinessListing;
}

export interface UserBookmark {
  bookmark_id: number;
  business: BusinessListing;
}

export interface UserDashboardData {
  my_reviews: UserReview[];
  my_bookmarks: UserBookmark[];
}

export const getUserDashboard = async (): Promise<UserDashboardData> => {
  const response = await api.get('/user/dashboard/');
  return response.data as UserDashboardData;
};

export const toggleBookmark = async (businessId: number): Promise<{ status: 'added' | 'removed', message: string }> => {
  const response = await api.post(`/businesses/${businessId}/bookmark/`);
  return response.data;
};

export const submitEnquiry = async (businessId: number, data: { customer_name: string, phone_number: string }): Promise<{ message: string, owner_phone: string, business_name: string }> => {
  const response = await api.post(`/businesses/${businessId}/enquiry/`, data);
  return response.data;
};

export const submitReview = async (businessId: number, data: { rating: number, comment: string }): Promise<{ message: string }> => {
  const response = await api.post(`/businesses/${businessId}/review/`, data);
  return response.data;
};

export const submitContactMessage = async (data: { name: string, email: string, message: string }): Promise<{ message: string }> => {
  const response = await api.post('/contact/', data);
  return response.data;
};

// ─── Owner / Business Dashboard ────────────────────────────────────────────

export interface OwnerBusinessMetrics {
  id: number;
  name: string;
  slug?: string;
  status: string;
  rating: number;
  image?: string | null;
  reviews_count?: number;
  page_views: number;
  call_count: number;
  whatsapp_click_count: number;
}

export interface OwnerDashboardOverview {
  total_page_views: number;
  total_calls: number;
  total_whatsapp: number;
}

export interface OwnerDashboardData {
  overview: OwnerDashboardOverview;
  businesses: OwnerBusinessMetrics[];
}

export const getOwnerDashboard = async (): Promise<OwnerDashboardData> => {
  const response = await api.get('/owner/dashboard/');
  const raw = response.data as { dashboard: Array<{
    id: number;
    name: string;
    slug?: string;
    status: string;
    metrics: { views: number; calls: number; whatsapp_clicks: number; reviews: number; rating: number };
  }> };

  // Normalise the Django response shape into OwnerDashboardData
  const businesses: OwnerBusinessMetrics[] = raw.dashboard.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    status: b.status,
    rating: b.metrics.rating,
    reviews_count: b.metrics.reviews,
    page_views: b.metrics.views,
    call_count: b.metrics.calls,
    whatsapp_click_count: b.metrics.whatsapp_clicks,
  }));

  const overview: OwnerDashboardOverview = {
    total_page_views: businesses.reduce((sum, b) => sum + b.page_views, 0),
    total_calls: businesses.reduce((sum, b) => sum + b.call_count, 0),
    total_whatsapp: businesses.reduce((sum, b) => sum + b.whatsapp_click_count, 0),
  };

  return { overview, businesses };
};
