<template>
  <section class="sales-page">
    <!-- Hero Section - FULL WIDTH -->
    <div class="hero-sales">
      <div class="container">
        <h1 class="hero-sales__title">Намаления</h1>
        <p class="hero-sales__subtitle">
          Открийте най-добрите оферти на наши персонализирани бродирани изделия
        </p>
      </div>
    </div>

    <!-- Toolbar (Sort only) -->
    <div class="container sales-toolbar">
      <div class="sales-toolbar__spacer" />
      <div class="sales-toolbar__count">
        <span v-if="!isLoading && products.length > 0" class="sales-toolbar__count-text">
          Намерени {{ products.length }}
          {{ products.length === 1 ? "продукт" : "продукта" }}
        </span>
      </div>
      <div class="sales-toolbar__sort">
        <label class="sr-only" for="sort">Подреди</label>
        <select id="sort" v-model="sortBy" class="sales-toolbar__select">
          <option value="discount-desc">Най-голяма отстъпка</option>
          <option value="price-asc">Най-ниска цена</option>
          <option value="price-desc">Най-висока цена</option>
          <option value="newest">Най-нови</option>
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
        <button class="btn btn--primary" @click="() => fetchProducts()">Опитай отново</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="products.length === 0" class="state-card">
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
        <h2 class="state-card__title">Няма продукти на намаление в момента</h2>
        <p class="state-card__text">Следете ни за най-новите оферти и промоции</p>
        <NuxtLink to="/products" class="btn btn--primary">Разгледай всички продукти</NuxtLink>
      </div>

      <!-- Products Grid -->
      <div v-else>
        <div class="products-grid">
          <CatalogProductCard
            v-for="product in products"
            :key="product._id"
            :product="product"
            @quick-view="openQuickView"
          />
        </div>

        <!-- Infinite Scroll Trigger -->
        <div ref="loadMoreTrigger" class="load-more-trigger" />

        <!-- Load More Button -->
        <div v-if="hasMore" class="load-more-section">
          <button
            v-if="!isLoadingMore"
            class="btn btn--secondary load-more-btn"
            @click="loadMore"
          >
            Зареди още продукти
          </button>
          <div v-else class="load-more-spinner">
            <div class="spinner" />
          </div>
        </div>
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
import { useInfiniteScroll } from "~/composables/useInfiniteScroll";

usePageSEO({
  title: "Намаления",
  description:
    "Открийте най-добрите оферти на наши персонализирани бродирани изделия с отстъпки. Специални цени за ограничено време!",
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
  discount?: {
    id: string;
    name: string;
    type: string;
    value: number;
    amount: number;
  };
}

interface PaginationResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// State
const products = ref<Product[]>([]);
const isLoading = ref(true);
const isLoadingMore = ref(false);
const error = ref<string | null>(null);
const sortBy = ref<"newest" | "price-asc" | "price-desc" | "name-asc" | "discount-desc">(
  "discount-desc"
);
const drawerOpen = ref(false);
const activeProduct = ref<Product | null>(null);

// Pagination state
const currentPage = ref(1);
const totalPages = ref(1);
const hasMore = computed(() => currentPage.value < totalPages.value);

// Ref for infinite scroll trigger element
const loadMoreTrigger = ref<HTMLElement | null>(null);


// Functions
const { normalizeError, getUserFriendlyMessage } = useErrorHandler();

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) {
    const message = err.message.toLowerCase();

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

  const normalizedError = normalizeError(err);
  const friendlyMessage = getUserFriendlyMessage(normalizedError);

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

  return (
    friendlyMessage ||
    "Възникна неочаквана грешка при зареждането на продуктите. Моля, опитайте отново."
  );
};

const fetchProducts = async (page = 1, append = false) => {
  if (append) {
    isLoadingMore.value = true;
  } else {
    isLoading.value = true;
  }
  error.value = null;

  try {
    const api = useApi();
    const timestamp = Date.now();
    // Fetch products with onSale filter to get only discounted products
    const response = await api.get(
      `products?active=true&onSale=true&page=${page}&limit=12&sortBy=${sortBy.value}&_t=${timestamp}`
    );

    if (response && response.success) {
      // The API returns: { success: true, data: [...products], pagination: {...} }
      const productsData = Array.isArray(response.data) ? response.data : [];
      
      // Filter products that have discounts (compareAt or discount object)
      const filteredProducts = productsData.filter((product: Product) => {
        return product.compareAt != null || product.discount != null;
      });
      
      if (append) {
        // Check for duplicates before appending
        const existingIds = new Set(products.value.map((p: Product) => p._id));
        const newProducts = filteredProducts.filter((p: Product) => !existingIds.has(p._id));
        products.value = [...products.value, ...newProducts];
      } else {
        products.value = filteredProducts;
      }
      
      // Update pagination info (pagination is at root level)
      if (response.pagination) {
        currentPage.value = response.pagination.page;
        totalPages.value = response.pagination.pages;
      }
    } else if (Array.isArray(response)) {
      const filteredProducts = response.filter((product: Product) => {
        return product.compareAt != null || product.discount != null;
      });
      
      if (append) {
        products.value = [...products.value, ...filteredProducts];
      } else {
        products.value = filteredProducts;
      }
    } else {
      if (!append) {
        products.value = [];
      }
    }
  } catch (err) {
    error.value = getErrorMessage(err);
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
};

const loadMore = async () => {
  if (hasMore.value && !isLoadingMore.value) {
    await fetchProducts(currentPage.value + 1, true);
  }
};

const openQuickView = (product: Product) => {
  activeProduct.value = product;
  drawerOpen.value = true;
};

// Watch sortBy changes - reset to page 1
watch(sortBy, () => {
  currentPage.value = 1;
  totalPages.value = 1;
  fetchProducts(1, false);
});

// Setup infinite scroll
useInfiniteScroll({
  target: loadMoreTrigger,
  onLoadMore: loadMore,
  hasMore,
  isLoading: isLoadingMore,
  rootMargin: "200px",
});

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
// SALES PAGE - Based on Products Page
// ═══════════════════════════════════════════════════

.sales-page {
  min-height: 100vh;
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
}

// ═══════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════

.hero-sales {
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
// TOOLBAR
// ═══════════════════════════════════════════════════

.sales-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 1rem 2rem;
  gap: 1rem;

  &__spacer {
    flex: 1;
  }

  &__count {
    display: flex;
    align-items: center;
  }

  &__count-text {
    font-family: $font-body;
    font-size: 0.875rem;
    color: $text-secondary;
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
// PRODUCTS GRID
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
// SKELETON LOADING
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
// STATE CARDS
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

// ═══════════════════════════════════════════════════
// LOAD MORE SECTION - Infinite scroll trigger & button
// ═══════════════════════════════════════════════════

.load-more-trigger {
  height: 1px;
  width: 100%;
  visibility: hidden;
}

.load-more-section {
  display: flex;
  justify-content: center;
  padding: 2rem 0 4rem;
}

.load-more-btn {
  min-width: 200px;
  padding: 0.875rem 2rem;
  font-size: 0.9375rem;
  font-weight: 500;
}

.load-more-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid $border-base;
    border-top-color: $brand;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}

</style>
