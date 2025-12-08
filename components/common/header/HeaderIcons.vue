<template>
  <div class="site-header__icon-group">
    <!-- Favorites with Badge -->
    <NuxtLink to="/favorites" class="site-header__favorites">
      <Icon name="mdi:heart-outline" class="site-header__favorites-icon" />
      <span v-if="isMounted && wishlistStore.count > 0" class="site-header__badge">
        {{ wishlistStore.count }}
      </span>
    </NuxtLink>

    <!-- Cart with Badge -->
    <button class="site-header__cart" @click="cartStore.openCart()">
      <Icon name="mdi:cart-outline" class="site-header__cart-icon" />
      <span v-if="isMounted && cartStore.itemCount > 0" class="site-header__badge">
        {{ cartStore.itemCount }}
      </span>
    </button>

    <!-- User Menu (Authenticated) -->
    <div v-if="isMounted && showProfileIcon" class="user-menu">
      <button
        class="site-header__cart"
        :aria-expanded="isUserMenuOpen"
        aria-label="User menu"
        style="
          color: var(--text-primary, #333) !important;
          visibility: visible !important;
          opacity: 1 !important;
        "
        @click.stop="toggleUserMenu"
        @blur="handleBlur"
      >
        <Icon name="mdi:account-outline" class="site-header__cart-icon" />
      </button>

      <Transition name="dropdown">
        <div v-if="isUserMenuOpen" class="user-menu__dropdown">
          <div class="user-menu__header">
            <p class="user-menu__email">{{ authStore.user?.email }}</p>
            <p v-if="authStore.fullName" class="user-menu__name">
              {{ authStore.fullName }}
            </p>
          </div>

          <div class="user-menu__divider" />

          <nav class="user-menu__nav">
            <NuxtLink to="/profile" class="user-menu__item" @click="isUserMenuOpen = false">
              <Icon name="mdi:account-outline" />
              <span>Профил</span>
            </NuxtLink>
            <NuxtLink to="/orders" class="user-menu__item" @click="isUserMenuOpen = false">
              <Icon name="mdi:package-variant" />
              <span>Поръчки</span>
            </NuxtLink>
          </nav>

          <div class="user-menu__divider" />

          <button class="user-menu__item user-menu__item--logout" @click="handleLogout">
            <Icon name="mdi:logout" />
            <span>Изход</span>
          </button>
        </div>
      </Transition>
    </div>

    <!-- Login (Guest) -->
    <NuxtLink v-else-if="isMounted && showLoginIcon" to="/login" class="site-header__icon-btn">
      <Icon name="mdi:account-outline" class="site-header__icon" />
    </NuxtLink>

    <!-- Mobile Menu Toggle -->
    <button
      class="site-header__menu-toggle"
      :aria-expanded="menuOpen"
      aria-label="Toggle navigation menu"
      @click="emit('toggleMenu')"
    >
      <Icon name="mdi:menu" class="site-header__menu-icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/auth";
import { useWishlist } from "~/stores/useWishlist";
import { useToast } from "~/composables/useToast";

// Stores
const cartStore = useCartStore();
const authStore = useAuthStore();
const wishlistStore = useWishlist();
const toast = useToast();
const router = useRouter();

// Client-side mounted flag to prevent hydration mismatches
const isMounted = ref(false);

// Load cart and wishlist from localStorage (client-side only)
onMounted(() => {
  isMounted.value = true;
  cartStore.load();
  wishlistStore.load();
});

// Use a computed to check auth state more reliably
// Use isAuthenticated which works for both cookie-based (Google) and token-based (email/password) auth
const showProfileIcon = computed(() => {
  if (!isMounted.value) return false; // Never show until mounted
  return authStore.isAuthenticated && !!authStore.user;
});

const showLoginIcon = computed(() => {
  if (!isMounted.value) return false; // Never show until mounted
  // Only show login icon if profile icon is not shown (prevents both showing at once)
  return !showProfileIcon.value && (!authStore.isAuthenticated || !authStore.user);
});

// Debug auth state changes
watch(
  () => [authStore.isAuthenticated, authStore.user, showProfileIcon.value],
  ([isAuth, user, showProfile]) => {
    if (import.meta.dev) {
      console.log("[HeaderIcons] Auth state changed:", {
        isAuthenticated: isAuth,
        hasUser: !!user,
        showProfileIcon: showProfile,
        userEmail: user?.email,
      });
    }
  },
  { immediate: true, deep: true }
);

// User menu state
const isUserMenuOpen = ref(false);

// Watch for auth state changes and ensure user is loaded
watch(
  () => authStore.isAuthenticated,
  async (isAuth) => {
    if (import.meta.dev) {
      console.log("[HeaderIcons] Auth state changed:", {
        isAuthenticated: isAuth,
        hasUser: !!authStore.user,
        userEmail: authStore.user?.email,
      });
    }

    // If authenticated but no user, fetch user (shouldn't happen, but safety check)
    if (isAuth && !authStore.user) {
      if (import.meta.dev) {
        console.log("[HeaderIcons] Authenticated but no user, fetching...");
      }
      await authStore.fetchUser();
    }
  },
  { immediate: true }
);

// Define props
defineProps<{
  menuOpen: boolean;
}>();

// Define emits
const emit = defineEmits<{
  toggleMenu: [];
}>();

// Handle logout
const handleLogout = async () => {
  isUserMenuOpen.value = false;
  await authStore.logout();
  toast.success("Успешно излизане");
  router.push("/");
};

// Toggle user menu
const toggleUserMenu = () => {
  if (import.meta.dev) {
    console.log("[HeaderIcons] Toggling user menu:", {
      currentState: isUserMenuOpen.value,
      isAuthenticated: authStore.isAuthenticated,
      hasUser: !!authStore.user,
      userEmail: authStore.user?.email,
    });
  }
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

// Handle blur to close menu
const handleBlur = (event: FocusEvent) => {
  // Delay to allow click events to fire
  setTimeout(() => {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!relatedTarget || !relatedTarget.closest(".user-menu")) {
      isUserMenuOpen.value = false;
    }
  }, 200);
};

// Close menu on route change
const route = useRoute();
watch(
  () => route.path,
  () => {
    isUserMenuOpen.value = false;
  }
);
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/fonts" as *;

.site-header {
  &__icon-group {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__icon-btn {
    display: flex;
    align-items: center;
    color: $text-primary;
    text-decoration: none;
    transition: all 0.2s ease;
    padding: 0.5rem;
    border-radius: 8px;

    &:hover {
      color: $brand;
      background: rgba($brand, 0.1);
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: 2px;
    }
  }

  &__icon {
    font-size: 1.5rem;
  }

  &__cart-icon,
  &__favorites-icon {
    font-size: 1.5rem !important;
    color: inherit !important;
    display: inline-block !important;
    width: 1.5rem !important;
    height: 1.5rem !important;
    visibility: visible !important;
    opacity: 1 !important;
    line-height: 1 !important;

    svg {
      width: 100% !important;
      height: 100% !important;
      display: block !important;
      color: inherit !important;
      fill: currentColor !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
  }

  // Force iconify icons to be visible
  .iconify,
  .iconify[data-icon],
  span.iconify {
    display: inline-block !important;
    width: 1.5rem !important;
    height: 1.5rem !important;
    color: $text-primary !important;
    visibility: visible !important;
    opacity: 1 !important;
    font-size: 1.5rem !important;
    line-height: 1 !important;

    svg,
    svg[data-icon] {
      width: 100% !important;
      height: 100% !important;
      display: block !important;
      color: $text-primary !important;
      fill: currentColor !important;
      stroke: none !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
  }

  // Target the specific iconify classes
  .i-mdi-account,
  .i-mdi-account-outline {
    display: inline-block !important;
    width: 1.5rem !important;
    height: 1.5rem !important;
    color: $text-primary !important;
    visibility: visible !important;
    opacity: 1 !important;

    svg {
      width: 100% !important;
      height: 100% !important;
      display: block !important;
      fill: currentColor !important;
      color: $text-primary !important;
    }
  }

  &__favorites {
    position: relative;
    display: flex;
    align-items: center;
    color: $text-primary;
    text-decoration: none;
    transition: all 0.2s ease;
    padding: 0.5rem;
    border-radius: 8px;

    &:hover {
      color: $brand;
      background: rgba($brand, 0.1);
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: 2px;
    }

    &-icon {
      font-size: 1.5rem;
    }
  }

  &__cart {
    position: relative;
    display: flex;
    align-items: center;
    color: $text-primary !important;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0.5rem;
    border-radius: 8px;
    visibility: visible !important;
    opacity: 1 !important;

    &:hover {
      color: $brand !important;
      background: rgba($brand, 0.1);
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: 2px;
    }

    &-icon {
      font-size: 1.5rem;
      color: inherit !important;
    }
  }

  &__badge {
    position: absolute;
    top: 0;
    right: 0;
    background: $brand;
    color: $brand-ink;
    font-family: $font-body;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    min-width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    transform: translate(25%, -25%);
    border: 2px solid $color-white;
    box-shadow: 0 2px 4px $shadow-soft;
  }

  &__menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: $text-primary;
    cursor: pointer;
    padding: 0.75rem;
    transition: all 0.2s ease;
    border-radius: 8px;
    min-width: 44px;
    min-height: 44px;

    @media (min-width: 768px) {
      display: none;
    }

    &:hover {
      color: $brand;
      background: rgba($brand, 0.1);
    }

    &[aria-expanded="true"] {
      color: $brand;
      background: rgba($brand, 0.15);
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: 2px;
    }
  }

  &__menu-icon {
    font-size: 1.5rem;
  }
}

// User Menu Dropdown
.user-menu {
  position: relative;

  &__trigger {
    display: flex !important;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: $text-primary !important;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.2s ease;
    min-width: 44px;
    min-height: 44px;
    visibility: visible !important;
    opacity: 1 !important;

    svg {
      color: $text-primary !important;
      fill: currentColor !important;
      width: 1.5rem !important;
      height: 1.5rem !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    }

    &:hover {
      color: $brand !important;
      background: rgba($brand, 0.1);

      svg {
        color: $brand !important;
      }
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: 2px;
    }

    &[aria-expanded="true"] {
      color: $brand !important;
      background: rgba($brand, 0.15);

      svg {
        color: $brand !important;
      }
    }
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    min-width: 240px;
    background: $bg-card;
    border: 1px solid $border-base;
    border-radius: 12px;
    box-shadow: 0 8px 24px $shadow-soft;
    padding: 0.5rem;
    z-index: 1000;
  }

  &__header {
    padding: 0.75rem 1rem;
  }

  &__email {
    font-family: $font-body;
    font-size: 0.875rem;
    color: $text-primary;
    font-weight: 500;
    margin: 0;
    word-break: break-word;
  }

  &__name {
    font-family: $font-body;
    font-size: 0.8125rem;
    color: $text-secondary;
    margin: 0.25rem 0 0;
  }

  &__divider {
    height: 1px;
    background: $border-base;
    margin: 0.5rem 0;
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    font-family: $font-body;
    font-size: 0.9375rem;
    color: $text-primary;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.2s ease;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;

    svg {
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    &:hover {
      background: rgba($brand, 0.1);
      color: $brand-ink;
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: -2px;
    }

    &--logout {
      color: $error;

      &:hover {
        background: rgba($error, 0.1);
        color: $error;
      }
    }
  }
}

// Dropdown animation
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
