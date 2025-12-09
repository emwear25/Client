<template>
  <section class="products-page">
    <!-- Hero Section - FULL WIDTH -->
    <div class="hero-products">
      <div class="container">
        <h1 class="hero-products__title">Нашите Продукти</h1>
        <p class="hero-products__subtitle">
          Открийте персонализирани бродирани ранички, дрехи и аксесоари – с име и дизайн.
        </p>
      </div>
    </div>

    <!-- Toolbar (Sort only) -->
    <div class="container products-toolbar">
      <div class="products-toolbar__spacer" />
      <div class="products-toolbar__sort">
        <label class="sr-only" for="sort">Подреди</label>
        <select id="sort" v-model="sortBy" class="products-toolbar__select">
          <option value="newest">Най-нови</option>
          <option value="price-asc">Най-ниска цена</option>
          <option value="price-desc">Най-висока цена</option>
          <option value="name-asc">Име A–Z</option>
        </select>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="container">
      <div v-if="isLoading" class="products-grid">
        <div v-for="i in 8" :key="`skeleton-${i}`" class="product-skeleton">
          <div class="product-skeleton__img" />
          <div class="product-skeleton__body">
            <div class="product-skeleton__line product-skeleton__line--short" />
            <div class="product-skeleton__line" />
            <div class="product-skeleton__line product-skeleton__line--short" />
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="state-card state-card--error">
        <svg
          class="state-card__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2 class="state-card__title">Нещо се обърка</h2>
        <p class="state-card__text">{{ error }}</p>
        <button class="btn btn--primary" @click="fetchProducts">Опитай отново</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="sortedProducts.length === 0" class="state-card">
        <svg
          class="state-card__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <h2 class="state-card__title">Няма намерени продукти</h2>
        <p class="state-card__text">Скоро ще добавим нови продукти</p>
      </div>

      <!-- Products Grid -->
      <div v-else class="products-grid">
        <CatalogProductCard
          v-for="product in sortedProducts"
          :key="product._id"
          :product="product"
          @quick-view="openQuickView"
        />
      </div>
    </div>

    <!-- Quick View Drawer -->
    <CatalogQuickViewDrawer
      :open="drawerOpen"
      :product="activeProduct"
      @close="drawerOpen = false"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useWishlist } from "~/stores/useWishlist";
import { useApi } from "~/composables/useApi";
import { useErrorHandler } from "~/composables/useErrorHandler";
import { usePageSEO } from "~/composables/useSEO";

usePageSEO({
  title: "Продукти",
  description: "Открийте персонализирани бродирани ранички, дрехи и аксесоари – с име и дизайн.",
  type: "website",
});

interface ProductImage {
  url: string;
  publicId: string;
}

interface Product {
  _id: string;
  slug?: string;
  name: string;
  description: string;
  price: number;
  compareAt?: number | null;
  category: string | { _id: string; name: string };
  sizes?: string[];
  colors?: string[];
  images?: ProductImage[];
  stock: number;
  isActive?: boolean;
  customEmbroidery?: boolean;
  createdAt: string;
  reviewStats?: {
    averageRating: number;
    totalReviews: number;
  };
}

// State
const products = ref<Product[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const sortBy = ref<"newest" | "price-asc" | "price-desc" | "name-asc">("newest");
const drawerOpen = ref(false);
const activeProduct = ref<Product | null>(null);

// Computed - Sorted Products
const sortedProducts = computed(() => {
  const arr = [...products.value];

  switch (sortBy.value) {
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "name-asc":
      return arr.sort((a, b) => a.name.localeCompare(b.name, "bg"));
    default: // newest
      return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
});

// Functions
const { normalizeError, getUserFriendlyMessage } = useErrorHandler();

const getErrorMessage = (err: unknown): string => {
  // Handle network/server connection errors first
  if (err instanceof Error) {
    const message = err.message.toLowerCase();

    // Check for specific network errors (server not running, connection failed)
    if (
      message.includes("failed to fetch") ||
      message.includes("networkerror") ||
      message.includes("network request failed") ||
      (message.includes("fetch") && message.includes("failed")) ||
      message.includes("load failed")
    ) {
      return "Не може да се установи връзка със сървъра. Моля, проверете дали сървърът е стартиран и опитайте отново.";
    }

    if (message.includes("timeout") || message.includes("timed out")) {
      return "Заявката отне твърде много време. Моля, опитайте отново.";
    }
  }

  // Normalize the error and get user-friendly message
  const normalizedError = normalizeError(err);
  const friendlyMessage = getUserFriendlyMessage(normalizedError);

  // Check if it's a network error (no status code usually means network issue)
  if (!normalizedError.statusCode) {
    const message = (normalizedError.message || "").toLowerCase();
    if (
      message.includes("fetch") ||
      message.includes("network") ||
      message.includes("connection")
    ) {
      return "Не може да се установи връзка със сървъра. Моля, проверете дали сървърът е стартиран и опитайте отново.";
    }
  }

  // Return user-friendly message or fallback
  return (
    friendlyMessage ||
    "Възникна неочаквана грешка при зареждането на продуктите. Моля, опитайте отново."
  );
};

const fetchProducts = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const api = useApi();
    // Add cache-busting timestamp to ensure fresh data
    const timestamp = Date.now();
    const response = await api.get(`products?active=true&_t=${timestamp}`);

    if (response && response.success && response.data) {
      products.value = Array.isArray(response.data) ? response.data : [];
    } else if (Array.isArray(response)) {
      products.value = response;
    } else {
      products.value = [];
    }
  } catch (err) {
    error.value = getErrorMessage(err);
  } finally {
    isLoading.value = false;
  }
};

const openQuickView = (product: Product) => {
  activeProduct.value = product;
  drawerOpen.value = true;
};

onMounted(() => {
  // Wishlist is already loaded in cart.client.ts plugin, no need to load again
  fetchProducts();
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/colors" as *;
@use "@/assets/styles/breakpoints" as *;
@use "@/assets/styles/fonts" as *;

// ═══════════════════════════════════════════════════
// PRODUCTS PAGE - Warm, Premium, Scandinavian Design
// ═══════════════════════════════════════════════════

.products-page {
  min-height: 100vh;
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
}

// ═══════════════════════════════════════════════════
// HERO SECTION - Soft gradient, warm welcome
// ═══════════════════════════════════════════════════

.hero-products {
  background: $grad-brand-a;
  padding: 3rem 0;
  text-align: center;
  color: $brand-ink;
  width: 100%;

  @include up(md) {
    padding: 4rem 0;
  }

  &__title {
    font-family: "Outfit", sans-serif;
    font-size: 56px;
    font-weight: 300;
    color: $brand-ink;
    margin: 0 0 0.75rem;
    letter-spacing: 0.01em;
    line-height: 60px;
  }

  &__subtitle {
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans",
      "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol", "Noto Color Emoji";
    font-size: 18px;
    font-weight: 300;
    line-height: 31px;
    color: $brand-ink;
    max-width: 700px;
    margin-inline: auto;
  }
}

// ═══════════════════════════════════════════════════
// TOOLBAR - Sort dropdown only
// ═══════════════════════════════════════════════════

.products-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 1rem 2rem;

  &__spacer {
    flex: 1;
  }

  &__sort {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__select {
    appearance: none;
    background: $bg-card
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="#{$brand-ink}" d="M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z"/></svg>')
      no-repeat right 0.75rem center;
    border: 1px solid $border-base;
    border-radius: 12px;
    padding: 0.6rem 2.5rem 0.6rem 0.9rem;
    color: $text-primary;
    font-family: $font-body;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: $brand;
    }

    &:focus {
      outline: none;
      border-color: $brand;
      box-shadow: 0 0 0 3px rgba($brand, 0.1);
    }
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

// ═══════════════════════════════════════════════════
// PRODUCTS GRID - Airy spacing, large images
// ═══════════════════════════════════════════════════

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding-bottom: 4rem;

  @include up(md) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @include up(lg) {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  @include up(xl) {
    gap: 24px;
  }
}

// ═══════════════════════════════════════════════════
// SKELETON LOADING - Soft pulsing placeholders
// ═══════════════════════════════════════════════════

.product-skeleton {
  background: $bg-card;
  border: 1px solid $border-base;
  overflow: hidden;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  &__img {
    aspect-ratio: 1 / 1.2;
    background: linear-gradient(90deg, $bg-page 25%, rgba($brand, 0.12) 50%, $bg-page 75%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }

  &__body {
    padding: 12px;
  }

  &__line {
    height: 12px;
    background: linear-gradient(90deg, $bg-page 25%, rgba($brand, 0.12) 50%, $bg-page 75%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
    margin-bottom: 0.5rem;

    &--short {
      width: 50%;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.85;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
}

// ═══════════════════════════════════════════════════
// STATE CARDS - Empty & Error states
// ═══════════════════════════════════════════════════

.state-card {
  background: $bg-card;
  padding: 4rem 2rem;
  text-align: center;
  border: 1px solid $border-base;

  &__icon {
    width: 4rem;
    height: 4rem;
    color: $brand;
    margin: 0 auto 1.5rem;
    stroke-width: 1.5;
  }

  &__title {
    font-family: $font-heading;
    font-size: 1.5rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 0.75rem;
  }

  &__text {
    font-size: 1rem;
    line-height: 1.6;
    color: $text-secondary;
    margin: 0 0 1.5rem;
    max-width: 400px;
    margin-inline: auto;
  }

  .btn {
    min-width: 180px;
  }

  &--error {
    .state-card__icon {
      color: $error;
    }
  }
}
</style>
