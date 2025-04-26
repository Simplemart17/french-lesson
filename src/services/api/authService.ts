import apiClient, { ApiResponse } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';

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
  token: string;
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

// Auth service class
class AuthService {
  // Login user
  public async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    
    // Store token in cookies and localStorage for redundancy
    if (response.data.token) {
      this.setAuthToken(response.data.token);
      this.setUserData(response.data.user);
    }
    
    return response;
  }
  
  // Register user
  public async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    
    // Store token in cookies and localStorage for redundancy
    if (response.data.token) {
      this.setAuthToken(response.data.token);
      this.setUserData(response.data.user);
    }
    
    return response;
  }
  
  // Logout user
  public async logout(): Promise<ApiResponse<void>> {
    try {
      // Call logout endpoint
      const response = await apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
      
      // Clear auth data regardless of response
      this.clearAuthData();
      
      return response;
    } catch (error) {
      // Clear auth data even if the API call fails
      this.clearAuthData();
      throw error;
    }
  }
  
  // Refresh token
  public async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
    
    // Update token in cookies and localStorage
    if (response.data.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }
  
  // Forgot password
  public async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  }
  
  // Reset password
  public async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  }
  
  // Change password
  public async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(API_ENDPOINTS.USER.CHANGE_PASSWORD, data);
  }
  
  // Verify email
  public async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  }
  
  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
  
  // Get auth token
  public getAuthToken(): string | null {
    // Try to get from cookie first
    const cookieToken = this.getCookie('auth_token');
    if (cookieToken) return cookieToken;
    
    // Fallback to localStorage
    return localStorage.getItem('auth_token');
  }
  
  // Get user data
  public getUserData(): any {
    const userData = this.getCookie('user_data') || localStorage.getItem('user_data');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }
  
  // Set auth token
  private setAuthToken(token: string): void {
    // Set in cookie (expires in 7 days)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    document.cookie = `auth_token=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
    
    // Set in localStorage as backup
    localStorage.setItem('auth_token', token);
  }
  
  // Set user data
  private setUserData(user: any): void {
    const userData = JSON.stringify(user);
    
    // Set in cookie (expires in 7 days)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    document.cookie = `user_data=${userData}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
    
    // Set in localStorage as backup
    localStorage.setItem('user_data', userData);
  }
  
  // Clear auth data
  private clearAuthData(): void {
    // Clear cookies
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }
  
  // Helper to get cookie value
  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }
}

// Create and export auth service instance
const authService = new AuthService();
export default authService;
