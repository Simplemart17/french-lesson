import apiClient, { ApiResponse } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';
import { setUserData as setUserDataStorage, clearAuthCookies, getUserData, UserData } from '@/utils/authCookies';

// Define interfaces for auth requests and responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

/**
 * Auth API Service
 *
 * This service handles all authentication-related API calls.
 * Token management is handled by Supabase + apiClient — no manual token caching needed.
 */
export const authApiService = {
  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
      clearAuthCookies();
      return response;
    } catch (error) {
      clearAuthCookies();
      throw error;
    }
  },

  /**
   * Get session
   */
  getSession: async (): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.get<{ success: boolean; data: AuthResponse }>(API_ENDPOINTS.AUTH.SESSION);
    return {
      ...response.data,
      status: response.status
    };
  },

  /**
   * Forgot password
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  /**
   * Reset password
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>(API_ENDPOINTS.USER.CHANGE_PASSWORD, data);
  },

  /**
   * Verify email
   */
  verifyEmail: async (token: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  },

  /**
   * Get user data from localStorage cache
   */
  getUserData: (): UserData | null => {
    return getUserData();
  },

  /**
   * Set user data in localStorage cache
   */
  setUserData: (userData: UserData): void => {
    setUserDataStorage(userData);
  },
};

export default authApiService;
