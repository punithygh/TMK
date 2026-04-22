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
