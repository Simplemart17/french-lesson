import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getAuthToken, clearAuthCookies } from '@/utils/authCookies';

// Define API response interface
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
  success?: boolean;
}

// Define API error interface
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Create API client class
class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => this.handleApiError(error)
    );
  }

  // Get auth token from localStorage
  private getAuthToken(): string | null {
    const token = getAuthToken();
    return token;
  }

  // Handle API errors
  private handleApiError(error: AxiosError): Promise<never> {
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: 'An unexpected error occurred',
    };

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const data = error.response.data as { message?: string; errors?: Record<string, string[]> };
      apiError.message = data.message || `Error: ${error.response.status}`;
      apiError.errors = data.errors;

      // Handle authentication errors
      if (error.response.status === 401) {
        // Clear auth tokens
        clearAuthCookies();

        // Redirect to login page if not already there
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      apiError.message = 'No response received from server. Please check your internet connection.';
    }

    return Promise.reject(apiError);
  }

  // Generic request method
  public async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client.request(config);
      
      return {
        data: response.data as T,
        status: response.status
      };
    } catch (error) {
      throw error;
    }
  }

  // GET method
  public async get<T>(
    url: string,
    paramsOrConfig?: Record<string, unknown> | AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig =
      paramsOrConfig && typeof paramsOrConfig === 'object' && 'params' in paramsOrConfig
        ? (paramsOrConfig as AxiosRequestConfig)
        : { params: paramsOrConfig as Record<string, unknown> | undefined };

    return this.request<T>({
      method: 'GET',
      url,
      ...config,
    });
  }

  // POST method
  public async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
    });
  }

  // PUT method
  public async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
    });
  }

  // PATCH method
  public async patch<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
    });
  }

  // DELETE method
  public async delete<T>(
    url: string,
    paramsOrConfig?: Record<string, unknown> | AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig =
      paramsOrConfig && typeof paramsOrConfig === 'object' && 'params' in paramsOrConfig
        ? (paramsOrConfig as AxiosRequestConfig)
        : { params: paramsOrConfig as Record<string, unknown> | undefined };

    return this.request<T>({
      method: 'DELETE',
      url,
      ...config,
    });
  }
}

// Create API client instance
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const apiClient = new ApiClient(API_BASE_URL);

export default apiClient;
