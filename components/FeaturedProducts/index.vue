<template>
  <section class="featured-products">
    <div class="featured-products__container">
      <!-- Section Header -->
      <div class="featured-products__header">
        <h2 class="featured-products__title">
          <span class="featured-products__title-accent">Най-търсени</span>
          продукти
        </h2>
        <p class="featured-products__subtitle">
          Открийте нашите персонализирани бестселъри с бродерия
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="featured-products__loading">
        <div class="featured-products__spinner"></div>
        <p>Зареждане...</p>
      </div>

      <!-- Products Carousel -->
      <div v-else-if="products.length > 0" class="featured-products__carousel-wrapper">
        <!-- Desktop: Grid -->
        <div class="featured-products__grid">
          <NuxtLink
            v-for="product in products"
            :key="product._id"
            :to="`/products/${product.slug || product._id}`"
            class="featured-products__card"
          >
            <div class="featured-products__image-wrapper">
              <img
                :src="product.images?.[0]?.url || '/img/placeholder-product.jpg'"
                :alt="product.name"
                class="featured-products__image"
                loading="lazy"
              />
              <div v-if="product.discount" class="featured-products__badge">
                -{{ getDiscountPercent(product) }}%
              </div>
            </div>
            <div class="featured-products__content">
              <h3 class="featured-products__product-name">{{ product.name }}</h3>
              <div class="featured-products__price-row">
                <span v-if="product.discount" class="featured-products__original-price">
                  {{ formatPrice(product.price) }} лв.
                </span>
                <span class="featured-products__price">
                  {{ formatPrice(getDiscountedPrice(product)) }}
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Mobile: Swiper -->
        <div class="featured-products__slider">
          <Swiper
            :modules="modules"
            :slides-per-view="1.2"
            :space-between="16"
            :grab-cursor="true"
            :breakpoints="{
              480: { slidesPerView: 2.2, spaceBetween: 16 },
              640: { slidesPerView: 2.5, spaceBetween: 20 },
            }"
            :pagination="{
              clickable: true,
              el: '.featured-products__pagination',
            }"
            class="featured-products__swiper"
          >
            <SwiperSlide
              v-for="product in products"
              :key="product._id"
              class="featured-products__slide"
            >
              <NuxtLink
                :to="`/products/${product.slug || product._id}`"
                class="featured-products__card"
              >
                <div class="featured-products__image-wrapper">
                  <img
                    :src="product.images?.[0]?.url || '/img/placeholder-product.jpg'"
                    :alt="product.name"
                    class="featured-products__image"
                    loading="lazy"
                  />
                  <div v-if="product.discount" class="featured-products__badge">
                    -{{ getDiscountPercent(product) }}%
                  </div>
                </div>
                <div class="featured-products__content">
                  <h3 class="featured-products__product-name">{{ product.name }}</h3>
                  <div class="featured-products__price-row">
                    <span v-if="product.discount" class="featured-products__original-price">
                      {{ formatPrice(product.price) }} лв.
                    </span>
                    <span class="featured-products__price">
                      {{ formatPrice(getDiscountedPrice(product)) }} лв.
                    </span>
                  </div>
                </div>
              </NuxtLink>
            </SwiperSlide>
          </Swiper>
          <div class="featured-products__pagination"></div>
        </div>
      </div>

      <!-- View All Button -->
      <div v-if="products.length > 0" class="featured-products__cta">
        <NuxtLink to="/products" class="featured-products__button">
          Виж всички продукти
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useCurrency } from "~/composables/useCurrency";

const modules = [Pagination];
const { formatDualPrice } = useCurrency();

interface Product {
  _id: string;
  name: string;
  slug?: string;
  price: number;
  discount?: number;
  images?: Array<{ url: string }>;
  category?: { name: string; slug: string } | string;
}

const products = ref<Product[]>([]);
const loading = ref(true);

// Fetch featured products - 2 from each category
const fetchFeaturedProducts = async () => {
  loading.value = true;
  try {
    const api = useApi();
    
    // Fetch categories first with cache busting
    const timestamp = Date.now();
    const categoriesResponse = await api.get<{ success: boolean; data: any[] }>(
      `categories?active=true&_t=${timestamp}`
    );
    const categories = categoriesResponse?.data || [];
    
    console.log('[FeaturedProducts] Categories:', categories.map(c => ({ id: c._id, name: c.name })));
    
    // Fetch 2 products from each category using Promise.all for parallel requests
    const allProducts: Product[] = [];
    const categoriesToFetch = categories.slice(0, 4); // Limit to 4 categories = 8 products
    
    // Use Promise.all to fetch in parallel but with unique cache-busting params
    const productPromises = categoriesToFetch.map(async (category, index) => {
      const uniqueId = `${Date.now()}_${index}_${Math.random().toString(36).substring(7)}`;
      const url = `products?category=${category._id}&active=true&limit=2&sortBy=createdAt&_nocache=${uniqueId}`;
      
      console.log(`[FeaturedProducts] Fetching products for ${category.name} (${category._id})`);
      
      const response = await api.get<{ success: boolean; data: Product[] }>(url);
      
      const productsData = response?.data || [];
      console.log(`[FeaturedProducts] Got ${productsData.length} products for ${category.name}:`, 
        productsData.map(p => p.name));
      
      return productsData;
    });
    
    const results = await Promise.all(productPromises);
    
    // Flatten results and deduplicate by product ID
    const seenIds = new Set<string>();
    for (const productsData of results) {
      if (Array.isArray(productsData)) {
        for (const product of productsData) {
          // Only add if we haven't seen this product ID before
          if (!seenIds.has(product._id)) {
            seenIds.add(product._id);
            allProducts.push(product);
          } else {
            console.log(`[FeaturedProducts] Skipping duplicate product: ${product.name} (${product._id})`);
          }
        }
      }
    }
    
    console.log('[FeaturedProducts] Total unique products:', allProducts.length);
    
    products.value = allProducts;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

// Helper functions
const getCategoryName = (category: Product["category"]) => {
  if (typeof category === "object" && category?.name) {
    return category.name;
  }
  return "";
};

const formatPrice = (price: number) => {
  return formatDualPrice(price);
};

const getDiscountedPrice = (product: Product) => {
  if (product.discount && product.discount > 0) {
    return product.price * (1 - product.discount / 100);
  }
  return product.price;
};

const getDiscountPercent = (product: Product) => {
  // Handle discount as object (from API with appliedDiscounts)
  if (product.discount && typeof product.discount === 'object') {
    // @ts-ignore - discount might be an object with value property
    return product.discount.value || 0;
  }
  // Handle discount as number (legacy)
  if (typeof product.discount === 'number') {
    return product.discount;
  }
  return 0;
};

// Fetch on mount
onMounted(() => {
  fetchFeaturedProducts();
});
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

.featured-products {
  background: linear-gradient(180deg, #faf9f7 0%, #ffffff 100%);
  padding: 3rem 0 4rem;

  @include up(md) {
    padding: 4rem 0 5rem;
  }

  @include up(lg) {
    padding: 5rem 0 6rem;
  }

  &__container {
    width: 100%;
    max-width: 1610px;
    margin: 0 auto;
    padding: 0 1rem;

    @include up(md) {
      padding: 0 2rem;
    }
  }

  &__header {
    text-align: center;
    margin-bottom: 2.5rem;

    @include up(md) {
      margin-bottom: 3rem;
    }
  }

  &__title {
    font-family: $font-heading;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 0.75rem;
    line-height: 1.2;
  }

  &__title-accent {
    color: $brand;
    display: block;
    font-size: 0.9em;

    @include up(md) {
      display: inline;
      margin-right: 0.25em;
    }
  }

  &__subtitle {
    font-size: 1rem;
    color: $text-secondary;
    margin: 0;
    max-width: 400px;
    margin: 0 auto;

    @include up(md) {
      font-size: 1.125rem;
    }
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
    color: $text-secondary;
  }

  &__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba($brand, 0.2);
    border-top-color: $brand;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  // Desktop Grid
  &__grid {
    display: none;

    @include up(md) {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    @include up(lg) {
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }
  }

  // Mobile Slider
  &__slider {
    display: block;

    @include up(md) {
      display: none;
    }
  }

  &__swiper {
    padding: 0.5rem 0 2.5rem;
    overflow: visible;
  }

  &__slide {
    height: auto;
  }

  &__pagination {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;

    :deep(.swiper-pagination-bullet) {
      width: 8px;
      height: 8px;
      background: rgba($brand, 0.3);
      opacity: 1;
      transition: all 0.3s ease;

      &.swiper-pagination-bullet-active {
        background: $brand;
        width: 24px;
        border-radius: 4px;
      }
    }
  }

  // Product Card
  &__card {
    display: block;
    background: #ffffff;
    border-radius: 0;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    height: 100%;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

      .featured-products__image {
        transform: scale(1.05);
      }
    }
  }

  &__image-wrapper {
    position: relative;
    padding-top: 100%;
    overflow: hidden;
    background: #f5f5f5;
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &__badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: #e53935;
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  &__category-tag {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background: rgba(255, 255, 255, 0.95);
    color: $brand-ink;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    backdrop-filter: blur(4px);
  }

  &__content {
    padding: 1rem;

    @include up(md) {
      padding: 1.25rem;
    }
  }

  &__product-name {
    font-family: $font-heading;
    font-size: 0.9rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 0.5rem;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @include up(md) {
      font-size: 1rem;
    }
  }

  &__price-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__original-price {
    font-size: 0.85rem;
    color: $text-secondary;
    text-decoration: line-through;
  }

  &__price {
    font-size: 1rem;
    font-weight: 700;
    color: $brand;

    @include up(md) {
      font-size: 1.125rem;
    }
  }

  // CTA Button
  &__cta {
    display: flex;
    justify-content: center;
    margin-top: 2.5rem;

    @include up(md) {
      margin-top: 3rem;
    }
  }

  &__button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    background: $brand;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba($brand, 0.3);

    svg {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
    }

    &:hover {
      background: darken($brand, 8%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba($brand, 0.4);

      svg {
        transform: translateX(4px);
      }
    }
  }
}
</style>
