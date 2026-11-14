import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin({
  name: "auth",
  dependsOn: ["posthog"],
  async setup() {
    // Only run on client side
    if (!import.meta.client) return;
    const authStore = useAuthStore();
    const { $posthog } = useNuxtApp();
    let identifiedUserId: string | undefined;

    // Identify once when auth establishes a user, including after a page refresh.
    // Reset only after an identified user is cleared, preserving anonymous history.
    authStore.$subscribe(
      (_mutation, state) => {
        const authenticatedUser = state.user;

        if (!authenticatedUser) {
          if (identifiedUserId) {
            $posthog?.reset();
            identifiedUserId = undefined;
          }
          return;
        }

        if (!authenticatedUser._id || authenticatedUser._id === identifiedUserId) return;

        if (identifiedUserId) {
          $posthog?.reset();
        }

        const name = [authenticatedUser.firstName, authenticatedUser.lastName]
          .filter(Boolean)
          .join(" ");

        $posthog?.identify(authenticatedUser._id, {
          email: authenticatedUser.email,
          ...(name ? { name } : {}),
          role: authenticatedUser.role,
        });
        identifiedUserId = authenticatedUser._id;
      },
      { flush: "sync" }
    );

    // Only log in development
    if (import.meta.dev) {
      console.log("[Auth Plugin] BEFORE loadFromStorage:");
      console.log("  - isAuthenticated:", authStore.isAuthenticated);
      console.log("  - user:", !!authStore.user);
      console.log("  - localStorage accessToken:", !!localStorage.getItem("accessToken"));
    }

    // CRITICAL: Load tokens from localStorage on client side (for email/password users)
    authStore.loadFromStorage();

    if (import.meta.dev) {
      console.log("[Auth Plugin] AFTER loadFromStorage:");
      console.log("  - isAuthenticated:", authStore.isAuthenticated);
      console.log("  - user:", !!authStore.user);
    }

    // Always try to fetch user (works for both cookie-based and token-based auth)
    // Cookie-based auth (Google OAuth) doesn't need a token in localStorage
    // After Google OAuth redirect, user won't be loaded yet, so fetchUser will get it from cookie
    // IMPORTANT: Always fetch user on page load to check for cookie-based auth (Google OAuth)
    if (import.meta.dev) {
      console.log("[Auth Plugin] Fetching user (cookie or token)...");
    }
    await authStore.fetchUser();

    if (import.meta.dev) {
      console.log("[Auth Plugin] User fetch completed:", {
        hasUser: !!authStore.user,
        userEmail: authStore.user?.email,
        isAuthenticated: authStore.isAuthenticated,
      });
    }

    // Mark as initialized
    authStore.isInitialized = true;

    // If user is authenticated and fetchUser succeeded, merge guest wishlist with backend wishlist
    if (authStore.isAuthenticated && authStore.user) {
      try {
        const { useWishlist } = await import("~/stores/useWishlist");
        const wishlistStore = useWishlist();
        await wishlistStore.mergeWithBackend();
        if (import.meta.dev) {
          console.log("[Auth Plugin] Wishlist merged with backend");
        }
      } catch (error) {
        if (import.meta.dev) {
          console.error("[Auth Plugin] Failed to merge wishlist:", error);
        }
        // Don't block initialization if wishlist merge fails
      }
    }

    if (import.meta.dev) {
      console.log("[Auth Plugin] FINAL STATE:");
      console.log("  - isAuthenticated:", authStore.isAuthenticated);
      console.log("  - user:", authStore.user?.email);
      console.log("  - isInitialized:", authStore.isInitialized);
    }
  },
});
