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
   * Make a GET request
   */
  const get = async <T = any>(endpoint: string, options?: any): Promise<T> => {
    return await $fetch<T>(getApiUrl(endpoint), {
      method: "GET",
      ...options,
    });
  };

  /**
   * Make a POST request
   */
  const post = async <T = any>(endpoint: string, body?: any, options?: any): Promise<T> => {
    return await $fetch<T>(getApiUrl(endpoint), {
      method: "POST",
      body,
      ...options,
    });
  };

  /**
   * Make a PUT request
   */
  const put = async <T = any>(endpoint: string, body?: any, options?: any): Promise<T> => {
    return await $fetch<T>(getApiUrl(endpoint), {
      method: "PUT",
      body,
      ...options,
    });
  };

  /**
   * Make a PATCH request
   */
  const patch = async <T = any>(endpoint: string, body?: any, options?: any): Promise<T> => {
    return await $fetch<T>(getApiUrl(endpoint), {
      method: "PATCH",
      body,
      ...options,
    });
  };

  /**
   * Make a DELETE request
   */
  const del = async <T = any>(endpoint: string, options?: any): Promise<T> => {
    return await $fetch<T>(getApiUrl(endpoint), {
      method: "DELETE",
      ...options,
    });
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
