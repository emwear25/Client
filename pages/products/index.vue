<template>
  <section class="products-page">
    <!-- Hero Section - FULL WIDTH -->
    <div class="hero-products">
      <div class="container">
        <h1 class="hero-products__title">Нашите Продукти</h1>
        <p class="hero-products__subtitle">
          Открийте ръчно бродирани ранички, дрехи и аксесоари – персонализирани
          с име.
        </p>
      </div>
    </div>

    <!-- Toolbar (Sort only) -->
    <div class="container products-toolbar">
      <div class="products-toolbar__spacer"></div>
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
          <div class="product-skeleton__img"></div>
          <div class="product-skeleton__body">
            <div
              class="product-skeleton__line product-skeleton__line--short"
            ></div>
            <div class="product-skeleton__line"></div>
            <div
              class="product-skeleton__line product-skeleton__line--short"
            ></div>
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
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2 class="state-card__title">Нещо се обърка</h2>
        <p class="state-card__text">{{ error }}</p>
        <button class="btn btn--primary" @click="fetchProducts">
          Опитай отново
        </button>
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
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
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
import { ref, computed, onMounted } from 'vue'
import { useHead } from '#app'
import { useWishlist } from '~/stores/useWishlist'
import { useApi } from '~/composables/useApi'

useHead({
  title: 'Продукти - emWear | Персонализирани Бродирани Изделия',
  meta: [
    {
      name: 'description',
      content:
        'Открийте ръчно бродирани ранички, дрехи и аксесоари – персонализирани с име.',
    },
  ],
})

interface ProductImage {
  url: string
  publicId: string
}

interface Product {
  _id: string
  slug?: string
  name: string
  description: string
  price: number
  compareAt?: number | null
  category: string
  sizes: string[]
  colors: string[]
  images?: ProductImage[]
  stock: number
  isActive: boolean
  customEmbroidery?: boolean
  createdAt: string
}

// State
const products = ref<Product[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const sortBy = ref<'newest' | 'price-asc' | 'price-desc' | 'name-asc'>('newest')
const drawerOpen = ref(false)
const activeProduct = ref<Product | null>(null)

// Computed - Sorted Products
const sortedProducts = computed(() => {
  const arr = [...products.value]

  switch (sortBy.value) {
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price)
    case 'name-asc':
      return arr.sort((a, b) => a.name.localeCompare(b.name, 'bg'))
    default: // newest
      return arr.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }
})

// Functions
const fetchProducts = async () => {
  isLoading.value = true
  error.value = null

  try {
    const api = useApi()
    const data = await api.get('products?active=true')
    products.value = data.data || []
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Възникна грешка при зареждането'
  } finally {
    isLoading.value = false
  }
}

const openQuickView = (product: Product) => {
  activeProduct.value = product
  drawerOpen.value = true
}

onMounted(() => {
  const wishlist = useWishlist()
  wishlist.load()
  fetchProducts()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/colors' as *;
@use '@/assets/styles/breakpoints' as *;
@use '@/assets/styles/fonts' as *;

// ═══════════════════════════════════════════════════
// PRODUCTS PAGE - Warm, Premium, Scandinavian Design
// ═══════════════════════════════════════════════════

.products-page {
  min-height: 100vh;

  // Hero
  &__hero {
    background: $grad-brand-a;
    padding: 3rem 1rem;
    text-align: center;

    @include up(md) {
      padding: 4rem 1rem;
    }
  }

  &__hero-title {
    font-family: $font-heading;
    color: $brand-ink;
    font-size: clamp(2rem, 6vw, 2.75rem);
    font-weight: 700;
    margin: 0 0 0.75rem;
    letter-spacing: 0.02em;
  }

  &__hero-subtitle {
    font-size: 1rem;
    font-weight: 400;
    color: $text-secondary;
    margin: 0;
    max-width: 600px;
    margin-inline: auto;

    @include up(md) {
      font-size: 1.0625rem;
    }
  }

  // Main Layout
  &__main {
    padding: 2rem 0;

    @include up(md) {
      padding: 3rem 0;
    }
  }

  &__layout {
    display: grid;
    gap: 2rem;

    @include up(lg) {
      grid-template-columns: 260px 1fr;
      gap: 3rem;
    }
  }

  // Sidebar
  &__sidebar {
    @include up(lg) {
      position: sticky;
      top: 90px;
      align-self: start;
    }
  }

  // Content Area
  &__content {
    min-width: 0;
  }
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
    font-family: $font-heading;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 600;
    margin: 0 0 0.75rem;
    letter-spacing: 0.01em;
  }

  &__subtitle {
    font-family: $font-body;
    font-size: clamp(0.9375rem, 2vw, 1rem);
    line-height: 1.6;
    color: $text-secondary;
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
    background: linear-gradient(
      90deg,
      $bg-page 25%,
      rgba($brand, 0.12) 50%,
      $bg-page 75%
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }

  &__body {
    padding: 12px;
  }

  &__line {
    height: 12px;
    background: linear-gradient(
      90deg,
      $bg-page 25%,
      rgba($brand, 0.12) 50%,
      $bg-page 75%
    );
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

// ═══════════════════════════════════════════════════
// PAGINATION - Soft, minimal navigation
// ═══════════════════════════════════════════════════

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid $border-base;

  &__btn {
    background: $bg-card;
    border: 1px solid $border-base;
    color: $brand-ink;
    padding: 0.75rem 1.5rem;
    border-radius: 999px;
    font-family: $font-body;
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px $shadow-soft;

    &:hover:not(:disabled) {
      background: $brand;
      border-color: $brand;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px $shadow-soft;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: 2px;
    }
  }

  &__info {
    font-size: 0.9375rem;
    color: $text-secondary;
    font-weight: 500;
    padding: 0 0.5rem;
  }
}
</style>
