import { defineStore } from "pinia";
import { useAuthStore } from "~/stores/auth";
import { useApi } from "~/composables/useApi";

export const useWishlist = defineStore("wishlist", {
  state: () => ({
    ids: [] as string[],
    isSyncing: false,
    isLoading: false,
    isLoaded: false,
  }),

  getters: {
    count: (state) => state.ids.length,
    has: (state) => (id: string) => state.ids.includes(id),
  },

  actions: {
    /**
     * Load wishlist from localStorage (guest) or backend (authenticated)
     */
    async load() {
      if (!import.meta.client) return;
      
      // Prevent duplicate loads
      if (this.isLoading || this.isLoaded) return;
      
      this.isLoading = true;
      try {
        const authStore = useAuthStore();

        // If user is authenticated, load from backend
        if (authStore.isAuthenticated) {
          await this.syncFromBackend();
        } else {
          // Guest user: load from localStorage
          const raw = localStorage.getItem("emw_wishlist");
          if (raw) {
            try {
              this.ids = JSON.parse(raw);
            } catch (e) {
              console.error("Failed to load wishlist:", e);
              this.ids = [];
            }
          }
        }
        this.isLoaded = true;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Sync wishlist from backend
     */
    async syncFromBackend() {
      if (!import.meta.client) return;
      
      // Prevent duplicate syncs
      if (this.isSyncing) return;
      
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        // Not authenticated - load from localStorage instead
        const raw = localStorage.getItem("emw_wishlist");
        if (raw) {
          try {
            this.ids = JSON.parse(raw);
          } catch (e) {
            console.error("Failed to load wishlist from localStorage:", e);
            this.ids = [];
          }
        }
        return;
      }

      this.isSyncing = true;
      try {
        const api = useApi();
        const response = await api.get("wishlist");

        if (response?.success && Array.isArray(response.data)) {
          this.ids = response.data;
          // Also update localStorage as backup
          this.persist();
          this.isLoaded = true;
        }
      } catch (error: any) {
        // Handle 401 errors gracefully - user is not authenticated
        if (error.status === 401 || error.statusCode === 401) {
          console.warn("[Wishlist] Not authenticated, using localStorage");
          // Clear auth state if token was invalid
          if (authStore.user) {
            authStore.user = null;
          }
        } else {
          console.error("Failed to sync wishlist from backend:", error);
        }
        // Fallback to localStorage on error
        const raw = localStorage.getItem("emw_wishlist");
        if (raw) {
          try {
            this.ids = JSON.parse(raw);
          } catch (e) {
            console.error("Failed to load wishlist from localStorage:", e);
            this.ids = [];
          }
        }
      } finally {
        this.isSyncing = false;
      }
    },

    /**
     * Sync wishlist to backend (for authenticated users)
     */
    async syncToBackend() {
      if (!import.meta.client) return;
      
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) return;

      try {
        const api = useApi();
        // Sync each product individually (could be optimized with batch endpoint)
        // For now, we'll rely on the merge endpoint when user logs in
        // Individual adds/removes will be synced immediately
      } catch (error) {
        console.error("Failed to sync wishlist to backend:", error);
      }
    },

    /**
     * Merge guest wishlist with user wishlist on login
     */
    async mergeWithBackend() {
      if (!import.meta.client) return;
      
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated || !authStore.user) {
        // Not authenticated - don't try to merge
        return;
      }

      // Reset loaded flag to allow reload after merge
      this.isLoaded = false;

      // Get guest wishlist from localStorage
      const guestWishlist: string[] = [];
      const raw = localStorage.getItem("emw_wishlist");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            guestWishlist.push(...parsed);
          }
        } catch (e) {
          console.error("Failed to parse guest wishlist:", e);
        }
      }

      if (guestWishlist.length === 0) {
        // No guest wishlist to merge, just load from backend
        await this.syncFromBackend();
        this.isLoaded = true;
        return;
      }

      try {
        const api = useApi();
        const response = await api.post("wishlist/merge", {
          productIds: guestWishlist,
        });

        if (response?.success && Array.isArray(response.data)) {
          this.ids = response.data;
          this.persist();
          this.isLoaded = true;
          // Clear guest wishlist from localStorage (now merged)
          localStorage.removeItem("emw_wishlist");
        }
      } catch (error: any) {
        // Handle 401 errors gracefully
        if (error.status === 401 || error.statusCode === 401) {
          console.warn("[Wishlist] Not authenticated for merge, using localStorage");
          // Clear auth state if token was invalid
          if (authStore.user) {
            authStore.user = null;
          }
          // Keep guest wishlist in localStorage
          return;
        }
        console.error("Failed to merge wishlist:", error);
        // On error, just load from backend (or localStorage if not authenticated)
        await this.syncFromBackend();
        this.isLoaded = true;
      }
    },

    /**
     * Toggle product in wishlist
     */
    async toggle(id: string) {
      const authStore = useAuthStore();
      const index = this.ids.indexOf(id);

      if (index > -1) {
        // Remove from wishlist
        this.ids.splice(index, 1);
        this.persist();

        // Sync with backend if authenticated
        if (authStore.isAuthenticated) {
          try {
            const api = useApi();
            await api.delete(`wishlist/${id}`);
          } catch (error) {
            console.error("Failed to remove from backend wishlist:", error);
            // Re-add on error
            this.ids.push(id);
            this.persist();
            return;
          }
        }

        // Show toast notification
        if (import.meta.client) {
          const { useToast } = await import("~/composables/useToast");
          const toast = useToast();
          toast.info("Премахнато от любими");
        }
      } else {
        // Add to wishlist
        this.ids.push(id);
        this.persist();

        // Sync with backend if authenticated
        if (authStore.isAuthenticated) {
          try {
            const api = useApi();
            await api.post(`wishlist/${id}`);
          } catch (error) {
            console.error("Failed to add to backend wishlist:", error);
            // Remove on error
            this.ids.splice(this.ids.indexOf(id), 1);
            this.persist();
            return;
          }
        }

        // Show toast notification
        if (import.meta.client) {
          const { useToast } = await import("~/composables/useToast");
          const toast = useToast();
          toast.success("Добавено в любими");
        }
      }
    },

    /**
     * Add product to wishlist
     */
    async add(id: string) {
      if (!this.ids.includes(id)) {
        const authStore = useAuthStore();
        this.ids.push(id);
        this.persist();

        // Sync with backend if authenticated
        if (authStore.isAuthenticated) {
          try {
            const api = useApi();
            await api.post(`wishlist/${id}`);
          } catch (error) {
            console.error("Failed to add to backend wishlist:", error);
            // Remove on error
            this.ids.splice(this.ids.indexOf(id), 1);
            this.persist();
            return;
          }
        }

        // Show toast notification
        if (import.meta.client) {
          const { useToast } = await import("~/composables/useToast");
          const toast = useToast();
          toast.success("Добавено в любими");
        }
      }
    },

    /**
     * Remove product from wishlist
     */
    async remove(id: string) {
      const index = this.ids.indexOf(id);
      if (index > -1) {
        const authStore = useAuthStore();
        this.ids.splice(index, 1);
        this.persist();

        // Sync with backend if authenticated
        if (authStore.isAuthenticated) {
          try {
            const api = useApi();
            await api.delete(`wishlist/${id}`);
          } catch (error) {
            console.error("Failed to remove from backend wishlist:", error);
            // Re-add on error
            this.ids.push(id);
            this.persist();
            return;
          }
        }

        // Show toast notification
        if (import.meta.client) {
          const { useToast } = await import("~/composables/useToast");
          const toast = useToast();
          toast.info("Премахнато от любими");
        }
      }
    },

    /**
     * Clear wishlist
     */
    clear() {
      this.ids = [];
      this.persist();
      // Note: Backend clear would require a DELETE /api/wishlist endpoint
    },

    /**
     * Persist wishlist to localStorage
     */
    persist() {
      if (import.meta.client) {
        localStorage.setItem("emw_wishlist", JSON.stringify(this.ids));
      }
    },
  },
});
