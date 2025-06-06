import apiClient, { ApiResponse } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';
import { setAuthToken as setAuthTokenCookie, setUserData as setUserDataCookie, clearAuthCookies, getAuthToken, getUserData } from '@/utils/authCookies';

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
  user: {
    id: number;
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
 */
export const authApiService = {
  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<any>(API_ENDPOINTS.AUTH.LOGIN, data);

    // Store token and user data in localStorage
    if (response.data && response.data.success && response.data.data) {
      const { access_token, user } = response.data.data;
      if (access_token) {
        setAuthTokenCookie(access_token);
      }
      if (user) {
        setUserDataCookie(user);
      }
    }

    return response.data;
  },
  
  /**
   * Register user
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    
    // Store token in cookies and localStorage for redundancy
    if (response.data.access_token) {
      authApiService.setAuthToken(response.data.access_token);
      authApiService.setUserData(response.data.user);
    }
    
    return response;
  },
  
  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse<void>> => {
    try {
      // Call logout endpoint
      const response = await apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
      
      // Clear auth data regardless of response
      clearAuthCookies();
      
      return response;
    } catch (error) {
      // Clear auth data even if the API call fails
      clearAuthCookies();
      throw error;
    }
  },

  /**
   * Get session
   */
  getSession: async (): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.get<AuthResponse>(API_ENDPOINTS.AUTH.SESSION);
    return response;
  },
  
  /**
   * Refresh token
   */
  refreshToken: async (): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
    
    // Update token in cookies and localStorage
    if (response.data.access_token) {
      authApiService.setAuthToken(response.data.access_token);
    }
    
    return response;
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
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },

  /**
   * Get auth token
   */
  getAuthToken: (): string | null => {
    return getAuthToken();
  },

  /**
   * Get user data
   */
  getUserData: (): any => {
    return getUserData();
  },

  /**
   * Set auth token
   */
  setAuthToken: (token: string): void => {
    setAuthTokenCookie(token);
  },

  /**
   * Set user data
   */
  setUserData: (userData: any): void => {
    setUserDataCookie(userData);
  },

};

export default authApiService;
