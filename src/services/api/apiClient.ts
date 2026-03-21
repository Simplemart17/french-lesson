import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { supabase } from '@/lib/supabase';
import { clearAuthCookies } from '@/utils/authCookies';
import { getApiUrl } from '@/utils/apiUtils';

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
  private isRefreshing = false;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add async request interceptor — reads token from live Supabase session
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
          }
        } catch {
          // If getSession fails, proceed without token — the API will return 401
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling with 401 retry
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // On 401, attempt a session refresh before giving up
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !this.isRefreshing) {
          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
            this.isRefreshing = false;

            if (session?.access_token && !refreshError) {
              originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
              return this.client(originalRequest);
            }
          } catch {
            this.isRefreshing = false;
          }
        }

        return this.handleApiError(error);
      }
    );
  }

  // Handle API errors
  private handleApiError(error: AxiosError): Promise<never> {
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: 'An unexpected error occurred',
    };

    if (error.response) {
      const data = error.response.data as {
        message?: string;
        error?: { message?: string };
        data?: { error?: string };
        errors?: Record<string, string[]>;
      };
      apiError.message =
        data.message ||
        data.error?.message ||
        data.data?.error ||
        `Error: ${error.response.status}`;
      apiError.errors = data.errors;

      // Handle authentication errors
      if (error.response.status === 401) {
        clearAuthCookies();

        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      }
    } else if (error.request) {
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
const API_BASE_URL = getApiUrl();
const apiClient = new ApiClient(API_BASE_URL as string);

export default apiClient;
