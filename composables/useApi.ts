/**
 * Centralized API utility for making requests to the backend
 * All API calls should use this composable to avoid hardcoded URLs
 */
export const useApi = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase || "http://localhost:3030";

  /**
   * Get the full API URL for an endpoint
   * @param endpoint - API endpoint path (e.g., '/api/products' or 'products')
   * @returns Full URL to the API endpoint
   */
  const getApiUrl = (endpoint: string): string => {
    // Remove leading slash if present, we'll add it
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

    // If endpoint already starts with 'api/', use it as is
    if (cleanEndpoint.startsWith("api/")) {
      return `${apiBase}/${cleanEndpoint}`;
    }

    // Otherwise, prepend 'api/'
    return `${apiBase}/api/${cleanEndpoint}`;
  };

  /**
   * Get default headers including auth if available
   */
  const getDefaultHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};

    // Add auth token if available (for token-based auth)
    if (import.meta.client) {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return headers;
  };

  /**
   * Make a GET request
   */
  const get = async <T = any>(endpoint: string, options?: any): Promise<T> => {
    try {
      return await $fetch<T>(getApiUrl(endpoint), {
        method: "GET",
        credentials: "include", // Include cookies for cookie-based auth (Google OAuth)
        headers: {
          ...getDefaultHeaders(),
          ...options?.headers,
        },
        ...options,
      });
    } catch (error: any) {
      // Handle 401 errors - token might be expired
      if (error.status === 401 || error.statusCode === 401) {
        // Clear invalid tokens
        if (import.meta.client) {
          // Only clear if we're sure the token is invalid (not just missing)
          if (localStorage.getItem("accessToken")) {
            console.warn("[useApi] 401 error - token may be expired, clearing tokens");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            // Clear auth state asynchronously to avoid circular dependency
            Promise.resolve().then(async () => {
              try {
                const { useAuthStore } = await import("~/stores/auth");
                const authStore = useAuthStore();
                if (authStore.user) {
                  authStore.user = null;
                }
              } catch (importError) {
                // If import fails, that's okay - localStorage is already cleared
              }
            });
          }
        }
      }
      throw error;
    }
  };

  /**
   * Make a POST request
   */
  const post = async <T = any>(endpoint: string, body?: any, options?: any): Promise<T> => {
    try {
      return await $fetch<T>(getApiUrl(endpoint), {
        method: "POST",
        credentials: "include", // Include cookies for cookie-based auth (Google OAuth)
        headers: {
          ...getDefaultHeaders(),
          ...options?.headers,
        },
        body,
        ...options,
      });
    } catch (error: any) {
      // Handle 401 errors - token might be expired
      if (error.status === 401 || error.statusCode === 401) {
        // Clear invalid tokens
        if (import.meta.client) {
          // Only clear if we're sure the token is invalid (not just missing)
          if (localStorage.getItem("accessToken")) {
            console.warn("[useApi] 401 error - token may be expired, clearing tokens");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            // Clear auth state asynchronously to avoid circular dependency
            Promise.resolve().then(async () => {
              try {
                const { useAuthStore } = await import("~/stores/auth");
                const authStore = useAuthStore();
                if (authStore.user) {
                  authStore.user = null;
                }
              } catch (importError) {
                // If import fails, that's okay - localStorage is already cleared
              }
            });
          }
        }
      }
      throw error;
    }
  };

  /**
   * Make a PUT request
   */
  const put = async <T = any>(endpoint: string, body?: any, options?: any): Promise<T> => {
    try {
      return await $fetch<T>(getApiUrl(endpoint), {
        method: "PUT",
        credentials: "include", // Include cookies for cookie-based auth (Google OAuth)
        headers: {
          ...getDefaultHeaders(),
          ...options?.headers,
        },
        body,
        ...options,
      });
    } catch (error: any) {
      // Handle 401 errors - token might be expired
      if (error.status === 401 || error.statusCode === 401) {
        // Clear invalid tokens
        if (import.meta.client) {
          // Only clear if we're sure the token is invalid (not just missing)
          if (localStorage.getItem("accessToken")) {
            console.warn("[useApi] 401 error - token may be expired, clearing tokens");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            // Clear auth state asynchronously to avoid circular dependency
            Promise.resolve().then(async () => {
              try {
                const { useAuthStore } = await import("~/stores/auth");
                const authStore = useAuthStore();
                if (authStore.user) {
                  authStore.user = null;
                }
              } catch (importError) {
                // If import fails, that's okay - localStorage is already cleared
              }
            });
          }
        }
      }
      throw error;
    }
  };

  /**
   * Make a PATCH request
   */
  const patch = async <T = any>(endpoint: string, body?: any, options?: any): Promise<T> => {
    try {
      return await $fetch<T>(getApiUrl(endpoint), {
        method: "PATCH",
        credentials: "include", // Include cookies for cookie-based auth (Google OAuth)
        headers: {
          ...getDefaultHeaders(),
          ...options?.headers,
        },
        body,
        ...options,
      });
    } catch (error: any) {
      // Handle 401 errors - token might be expired
      if (error.status === 401 || error.statusCode === 401) {
        // Clear invalid tokens
        if (import.meta.client) {
          // Only clear if we're sure the token is invalid (not just missing)
          if (localStorage.getItem("accessToken")) {
            console.warn("[useApi] 401 error - token may be expired, clearing tokens");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            // Clear auth state asynchronously to avoid circular dependency
            Promise.resolve().then(async () => {
              try {
                const { useAuthStore } = await import("~/stores/auth");
                const authStore = useAuthStore();
                if (authStore.user) {
                  authStore.user = null;
                }
              } catch (importError) {
                // If import fails, that's okay - localStorage is already cleared
              }
            });
          }
        }
      }
      throw error;
    }
  };

  /**
   * Make a DELETE request
   */
  const del = async <T = any>(endpoint: string, options?: any): Promise<T> => {
    try {
      return await $fetch<T>(getApiUrl(endpoint), {
        method: "DELETE",
        credentials: "include", // Include cookies for cookie-based auth (Google OAuth)
        headers: {
          ...getDefaultHeaders(),
          ...options?.headers,
        },
        ...options,
      });
    } catch (error: any) {
      // Handle 401 errors - token might be expired
      if (error.status === 401 || error.statusCode === 401) {
        // Clear invalid tokens
        if (import.meta.client) {
          // Only clear if we're sure the token is invalid (not just missing)
          if (localStorage.getItem("accessToken")) {
            console.warn("[useApi] 401 error - token may be expired, clearing tokens");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            // Clear auth state asynchronously to avoid circular dependency
            Promise.resolve().then(async () => {
              try {
                const { useAuthStore } = await import("~/stores/auth");
                const authStore = useAuthStore();
                if (authStore.user) {
                  authStore.user = null;
                }
              } catch (importError) {
                // If import fails, that's okay - localStorage is already cleared
              }
            });
          }
        }
      }
      throw error;
    }
  };

  return {
    apiBase,
    getApiUrl,
    get,
    post,
    put,
    patch,
    delete: del,
  };
};
