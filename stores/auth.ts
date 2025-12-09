import { defineStore } from "pinia";

export interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  addresses?: Address[];
  role: "customer" | "admin";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  type: "home" | "work" | "other" | "econt_office" | "econt_automat";
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  econtOfficeCode?: string;
  econtOfficeName?: string;
}

interface _AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
}

// Get API base URL from runtime config
const getApiBase = () => {
  const config = useRuntimeConfig();
  return config.public.apiBase || "http://localhost:3030";
};

const getApiUrl = () => `${getApiBase()}/api/auth`;

// Load tokens from localStorage (for backward compatibility with token-based auth)
const loadTokens = () => {
  if (!import.meta.client) return { accessToken: null, refreshToken: null };

  try {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error loading tokens:", error);
    return { accessToken: null, refreshToken: null };
  }
};

// Save tokens to localStorage (for backward compatibility with token-based auth)
const saveTokens = (accessToken: string | null, refreshToken: string | null) => {
  if (!import.meta.client) return;

  try {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  } catch (error) {
    console.error("Error saving tokens:", error);
  }
};

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null);
  const { accessToken: savedAccessToken, refreshToken: savedRefreshToken } = loadTokens();
  const accessToken = ref<string | null>(savedAccessToken);
  const refreshToken = ref<string | null>(savedRefreshToken);
  const isLoading = ref(false);
  const isInitialized = ref(false); // Track if plugin has run

  // Debug logging (only in development)
  if (import.meta.client && import.meta.dev) {
    console.log("[Auth Store] Initialized with token:", !!savedAccessToken);
    if (savedAccessToken) {
      console.log("[Auth Store] Token preview:", savedAccessToken.substring(0, 20) + "...");
    }
  }

  // Getters
  // User is authenticated if they have a user object (from cookie or token)
  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");
  const fullName = computed(() => {
    if (!user.value) return null;
    const { firstName, lastName } = user.value;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    return null;
  });

  // Actions
  const register = async (email: string, password: string) => {
    isLoading.value = true;

    try {
      const response = await $fetch(`${getApiUrl()}/register`, {
        method: "POST",
        body: { email, password },
      });

      if (response.success && response.data) {
        user.value = response.data.user;
        accessToken.value = response.data.accessToken;
        refreshToken.value = response.data.refreshToken;

        saveTokens(response.data.accessToken, response.data.refreshToken);

        return { success: true, user: response.data.user };
      }

      throw new Error(response.message || "Грешка при регистрация");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Detect network errors (server down, connection issues)
      const errorMessage = error.message || "";
      const isNetworkError =
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError") ||
        errorMessage.includes("Network request failed") ||
        errorMessage.includes("fetch failed") ||
        error.name === "TypeError" ||
        !error.status ||
        error.status === 0;

      if (isNetworkError) {
        throw new Error(
          "Сървърът не е достъпен в момента. Моля проверете интернет връзката си и опитайте отново по-късно."
        );
      }

      // Handle server error responses
      if (error.data?.message) {
        throw new Error(error.data.message);
      }

      // Handle status code errors
      if (error.status === 401 || error.statusCode === 401) {
        throw new Error("Невалидни данни за регистрация");
      }

      if (error.status === 500 || error.statusCode === 500) {
        throw new Error("Възникна грешка на сървъра. Моля опитайте отново по-късно.");
      }

      // Default error message
      throw new Error(error.message || "Грешка при регистрация. Моля опитайте отново.");
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    isLoading.value = true;

    try {
      const response = await $fetch(`${getApiUrl()}/login`, {
        method: "POST",
        body: { email, password },
      });

      if (response.success && response.data) {
        user.value = response.data.user;
        accessToken.value = response.data.accessToken;
        refreshToken.value = response.data.refreshToken;

        saveTokens(response.data.accessToken, response.data.refreshToken);

        // Merge guest wishlist with backend wishlist after login
        if (import.meta.client) {
          const { useWishlist } = await import("~/stores/useWishlist");
          const wishlistStore = useWishlist();
          await wishlistStore.mergeWithBackend();
        }

        return { success: true, user: response.data.user };
      }

      throw new Error(response.message || "Грешка при влизане");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Detect network errors (server down, connection issues)
      const errorMessage = error.message || "";
      const isNetworkError =
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError") ||
        errorMessage.includes("Network request failed") ||
        errorMessage.includes("fetch failed") ||
        error.name === "TypeError" ||
        !error.status ||
        error.status === 0;

      if (isNetworkError) {
        throw new Error(
          "Сървърът не е достъпен в момента. Моля проверете интернет връзката си и опитайте отново по-късно."
        );
      }

      // Handle server error responses
      if (error.data?.message) {
        throw new Error(error.data.message);
      }

      // Handle status code errors
      if (error.status === 401 || error.statusCode === 401) {
        throw new Error("Невалиден имейл или парола");
      }

      if (error.status === 500 || error.statusCode === 500) {
        throw new Error("Възникна грешка на сървъра. Моля опитайте отново по-късно.");
      }

      // Default error message
      throw new Error(error.message || "Грешка при влизане. Моля опитайте отново.");
    } finally {
      isLoading.value = false;
    }
  };

  // Google OAuth login - redirects to backend which handles the OAuth flow
  const loginWithGoogle = async (redirectPath: string = "/") => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || "http://localhost:3030";

    // Build URL to backend OAuth initiation endpoint
    const oauthUrl = `${apiBase}/api/auth/google?redirect=${encodeURIComponent(redirectPath)}`;

    // Full page redirect to backend (which will redirect to Google)
    if (import.meta.client) {
      window.location.href = oauthUrl;
    }
  };

  const loadFromStorage = () => {
    if (import.meta.dev) {
      console.log("[Auth loadFromStorage] Called, import.meta.client:", import.meta.client);
    }
    if (import.meta.client) {
      const tokens = loadTokens();
      if (import.meta.dev) {
        console.log("[Auth loadFromStorage] Tokens loaded:", {
          accessToken: !!tokens.accessToken,
          refreshToken: !!tokens.refreshToken,
        });
      }
      accessToken.value = tokens.accessToken;
      refreshToken.value = tokens.refreshToken;
      if (import.meta.dev) {
        console.log("[Auth loadFromStorage] State updated:", {
          accessToken: !!accessToken.value,
          refreshToken: !!refreshToken.value,
        });
      }
    } else {
      if (import.meta.dev) {
        console.log("[Auth loadFromStorage] Skipped - not on client");
      }
    }
  };

  const logout = async () => {
    try {
      // Try cookie-based logout first (for Google OAuth users)
      try {
        await $fetch(`${getApiUrl()}/logout-cookie`, {
          method: "POST",
          credentials: "include", // Include cookies
        });
      } catch (_cookieError) {
        // Fallback to token-based logout (for email/password users)
        if (refreshToken.value) {
          await $fetch(`${getApiUrl()}/logout`, {
            method: "POST",
            body: { refreshToken: refreshToken.value },
          });
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear state regardless of API call success
      user.value = null;
      accessToken.value = null;
      refreshToken.value = null;
      saveTokens(null, null);
    }
  };

  const fetchUser = async () => {
    isLoading.value = true;
    
    // Only log in development
    if (import.meta.dev) {
      console.log("[Auth] Fetching user...");
    }

    try {
      // Try cookie-based auth first (for Google OAuth users)
      try {
        const response = await $fetch(`${getApiUrl()}/me`, {
          credentials: "include", // Include cookies - CRITICAL for Google OAuth
          headers: accessToken.value
            ? {
                Authorization: `Bearer ${accessToken.value}`,
              }
            : {},
        });

        if (response.success && response.data) {
          user.value = response.data.user;
          if (import.meta.dev) {
            console.log("[Auth] User fetched successfully (cookie):", user.value.email);
          }
          return { success: true, user: response.data.user };
        }
      } catch (cookieError: any) {
        // Cookie auth failed - this is expected for token-based users
        // Only log in development to reduce console noise in production
        if (import.meta.dev) {
          console.log("[Auth] Cookie-based auth failed:", cookieError.status);
        }

        // Fallback to token-based auth (for email/password users)
        if (accessToken.value) {
          if (import.meta.dev) {
            console.log("[Auth] Cookie auth failed, trying token...");
          }
          const response = await $fetch(`${getApiUrl()}/me-token`, {
            headers: {
              Authorization: `Bearer ${accessToken.value}`,
            },
          });

          if (response.success && response.data) {
            user.value = response.data.user;
            if (import.meta.dev) {
              console.log("[Auth] User fetched successfully (token):", user.value.email);
            }
            
            return { success: true, user: response.data.user };
          }
        } else {
          // No token and cookie failed - user is not authenticated
          if (import.meta.dev) {
            console.log("[Auth] No token and cookie auth failed - user not authenticated");
          }
          throw cookieError;
        }
      }
    } catch (error: any) {
      // Only log errors in development, or if it's not a 401 (expected during auth flow)
      if (import.meta.dev || error.status !== 401) {
        console.error("[Auth] Fetch user error:", error);
      }

      // If token is invalid, try to refresh
      if (error.status === 401 && refreshToken.value) {
        if (import.meta.dev) {
          console.log("[Auth] Token expired, attempting refresh...");
        }
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          return await fetchUser();
        }
      }

      // If refresh failed or no token, clear user but don't logout (cookie might still be valid)
      // Only logout if we're sure there's no valid auth
      if (error.status === 401 && !refreshToken.value) {
        if (import.meta.dev) {
          console.log("[Auth] No valid auth found, clearing user state");
        }
        user.value = null;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const refreshAccessToken = async () => {
    if (!refreshToken.value) return false;

    try {
      const response = await $fetch(`${getApiUrl()}/refresh`, {
        method: "POST",
        body: { refreshToken: refreshToken.value },
      });

      if (response.success && response.data) {
        accessToken.value = response.data.accessToken;
        refreshToken.value = response.data.refreshToken;

        saveTokens(response.data.accessToken, response.data.refreshToken);

        return true;
      }

      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    }
  };

  const updateProfile = async (data: { firstName?: string; lastName?: string; phone?: string }) => {
    if (!accessToken.value) throw new Error("Not authenticated");

    isLoading.value = true;
    if (import.meta.dev) {
      console.log("[Auth] Updating profile with data:", data);
    }

    try {
      const response = await $fetch(`${getApiUrl()}/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
        body: data,
      });

      if (import.meta.dev) {
        console.log("[Auth] Profile update response:", response);
      }

      if (response.success && response.data) {
        user.value = response.data.user;
        if (import.meta.dev) {
          console.log("[Auth] User state updated:", user.value);
        }
        return { success: true, user: response.data.user };
      }

      throw new Error(response.message || "Profile update failed");
    } catch (error: any) {
      console.error("[Auth] Update profile error:", error);
      throw new Error(error.data?.message || error.message || "Profile update failed");
    } finally {
      isLoading.value = false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!accessToken.value) throw new Error("Not authenticated");

    isLoading.value = true;

    try {
      const response = await $fetch(`${getApiUrl()}/change-password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
        body: { currentPassword, newPassword },
      });

      if (response.success) {
        return { success: true, message: response.message };
      }

      throw new Error(response.message || "Password change failed");
    } catch (error: any) {
      console.error("Change password error:", error);
      throw new Error(error.data?.message || error.message || "Password change failed");
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    user,
    accessToken,
    refreshToken,
    isLoading,
    isInitialized,

    // Getters
    isAuthenticated,
    isAdmin,
    fullName,

    // Actions
    loadFromStorage,
    register,
    login,
    loginWithGoogle,
    logout,
    fetchUser,
    refreshAccessToken,
    updateProfile,
    changePassword,
  };
});
