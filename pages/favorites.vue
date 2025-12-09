<template>
  <div class="favorites-page">
    <section class="favorites-hero">
      <div class="container">
        <h1 class="favorites-hero__title">Моите Любими</h1>
        <p class="favorites-hero__subtitle">
          {{ wishlistStore.count }}
          {{ wishlistStore.count === 1 ? "продукт" : "продукта" }}
        </p>
      </div>
    </section>

    <section class="favorites-content">
      <div class="container">
        <!-- Empty State -->
        <div v-if="wishlistStore.count === 0" class="favorites-empty">
          <Icon name="mdi:heart-outline" class="favorites-empty__icon" />
          <h2 class="favorites-empty__title">Списъкът с любими е празен</h2>
          <p class="favorites-empty__text">
            Започнете да добавяте продукти, които харесвате, за да ги проследявате тук.
          </p>
          <NuxtLink to="/products" class="btn btn--primary"> Разгледай Продукти </NuxtLink>
        </div>

        <!-- Products Grid -->
        <div v-else class="favorites-grid">
          <CatalogProductCard
            v-for="product in favoriteProducts"
            :key="product._id"
            :product="product"
            @quick-view="handleQuickView"
          />
        </div>
      </div>
    </section>

    <!-- Quick View Drawer -->
    <CatalogQuickViewDrawer
      :open="isQuickViewOpen"
      :product="selectedProduct"
      @close="closeQuickView"
    />
  </div>
</template>

<script setup lang="ts">
import { useWishlist } from "~/stores/useWishlist";
import { useApi } from "~/composables/useApi";

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
  category: string;
  images?: ProductImage[];
  stock: number;
  customEmbroidery?: boolean;
  createdAt: string;
}

const wishlistStore = useWishlist();
const favoriteProducts = ref<Product[]>([]);
const isLoading = ref(false);
const selectedProduct = ref<Product | null>(null);
const isQuickViewOpen = ref(false);

// Load wishlist and fetch products
onMounted(async () => {
  // Wishlist is already loaded in cart.client.ts plugin, but ensure it's loaded for this page
  if (!wishlistStore.isLoaded) {
    await wishlistStore.load();
  }
  await fetchFavoriteProducts();
});

// Fetch products by IDs
const fetchFavoriteProducts = async () => {
  if (wishlistStore.count === 0) {
    favoriteProducts.value = [];
    return;
  }

  isLoading.value = true;
  try {
    // Fetch all products using API utility
    const api = useApi();
    const apiData = await api.get("products");

    if (apiData?.success && Array.isArray(apiData.data)) {
      // Filter to only show favorited products
      // API returns: { success: true, data: [products...], pagination: {...} }
      favoriteProducts.value = apiData.data.filter((product: Product) =>
        wishlistStore.ids.includes(product._id)
      );
    } else {
      console.error("Unexpected API response format:", apiData);
      favoriteProducts.value = [];
    }
  } catch (error) {
    console.error("Failed to fetch favorite products:", error);
    favoriteProducts.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Watch for changes in wishlist
watch(
  () => wishlistStore.ids,
  async () => {
    await fetchFavoriteProducts();
  },
  { deep: true }
);

// Quick view handlers
const handleQuickView = (product: Product) => {
  selectedProduct.value = product;
  isQuickViewOpen.value = true;
};

const closeQuickView = () => {
  isQuickViewOpen.value = false;
  setTimeout(() => {
    selectedProduct.value = null;
  }, 300);
};

// SEO
useHead({
  title: "Моите Любими - emWear",
  meta: [
    {
      name: "description",
      content: "Разгледайте и управлявайте любимите си продукти в emWear.",
    },
  ],
});
</script>

<style scoped lang="scss">
@use "sass:color";
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/fonts" as *;
@use "~/assets/styles/breakpoints" as *;

.favorites-page {
  min-height: 60vh;
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
}

.favorites-hero {
  background: linear-gradient(135deg, $color-sage 0%, $color-honey 100%);
  padding: 3rem 0 2rem;
  margin-bottom: 3rem;

  @include up(md) {
    padding: 4rem 0 3rem;
  }

  &__title {
    font-family: $font-heading;
    font-size: 2rem;
    color: $brand-ink;
    margin: 0 0 0.5rem;
    text-align: center;

    @include up(md) {
      font-size: 2.5rem;
    }
  }

  &__subtitle {
    font-family: $font-body;
    font-size: 1rem;
    color: $text-secondary;
    margin: 0;
    text-align: center;
  }
}

.favorites-content {
  padding: 0 0 4rem;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
}

.favorites-empty {
  text-align: center;
  padding: 4rem 1rem;

  &__icon {
    font-size: 4rem;
    color: $text-secondary;
    margin-bottom: 1.5rem;
  }

  &__title {
    font-family: $font-heading;
    font-size: 1.5rem;
    color: $brand-ink;
    margin: 0 0 1rem;
  }

  &__text {
    font-family: $font-body;
    font-size: 1rem;
    color: $text-secondary;
    margin: 0 0 2rem;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    font-family: $font-body;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.2s ease;

    &--primary {
      background: $brand-ink;
      color: $color-white;
      border: 2px solid $brand-ink;

      &:hover {
        background: color.adjust($brand-ink, $lightness: -5%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba($brand-ink, 0.3);
      }
    }
  }
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;

  @include up(md) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }
}
</style>
