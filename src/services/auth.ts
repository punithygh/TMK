import api from './api';

export type UserRole = 'USER' | 'OWNER' | 'ADMIN';

export interface User {
  id: number;
  first_name: string;
  last_name?: string;
  mobile: string;
  email: string;
  username?: string;
  profile_image?: string | null;
  role: UserRole;
  is_verified: boolean;
  subscription_plan?: string;
}

export interface AuthResponse {
  message?: string;
  user?: User;
  access: string;
  refresh: string;
}

export const loginUser = async (mobile: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login/', { username: mobile, password });
    return response.data as AuthResponse;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Invalid mobile number or password');
  }
};

export const registerUser = async (data: { full_name: string, mobile: string, email: string, password: string }): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/register/', data);
    return response.data as AuthResponse;
  } catch (error: any) {
    const errorData = error.response?.data;
    if (errorData) {
      const firstErrorKey = Object.keys(errorData)[0];
      throw new Error(errorData[firstErrorKey][0] || 'Registration failed. Please try again.');
    }
    throw new Error('Registration failed due to network error');
  }
};
