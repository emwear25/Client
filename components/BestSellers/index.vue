<template>
  <section class="best-sellers">
    <div class="best-sellers__container">
      <h2 class="best-sellers__heading">Най-продавани</h2>

      <!-- Loading State -->
      <div v-if="isLoading" class="best-sellers__loading">
        <div class="spinner"/>
      </div>

      <!-- Products Grid -->
      <div v-else-if="products.length > 0" class="best-sellers__grid">
        <article v-for="product in products" :key="product._id" class="product-card">
          <NuxtLink :to="`/products/${product._id}`" class="product-card__link">
            <div class="product-card__media">
              <NuxtImg
                :src="product.images?.[0]?.url || '/img/placeholder.png'"
                :alt="product.name"
                class="product-card__img"
                format="webp"
                quality="75"
                width="400"
                height="400"
                loading="lazy"
                placeholder
              />
              <div v-if="product.isNew" class="product-card__badges">
                <span class="badge badge--handmade">Ръчна бродерия</span>
              </div>
            </div>

            <div class="product-card__body">
              <h3 class="product-card__title">{{ product.name }}</h3>

              <div class="product-card__footer">
                <span class="product-card__price">{{ product.price.toFixed(2) }} лв.</span>
                <span v-if="product.stock > 0" class="badge badge--in-stock"> На Склад </span>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>

      <!-- View All -->
      <div v-if="products.length > 0" class="best-sellers__cta">
        <NuxtLink to="/products" class="btn btn--ghost"> Виж Всички Продукти </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "~/composables/useApi";

interface ProductImage {
  url: string;
  publicId: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  images?: ProductImage[];
  stock: number;
  isActive: boolean;
  isNew?: boolean;
}

// State
const products = ref<Product[]>([]);
const isLoading = ref(true);

// Fetch products
const fetchBestSellers = async () => {
  isLoading.value = true;

  try {
    const api = useApi();
    const data = await api.get("products?active=true&limit=4");
    products.value = data.data?.slice(0, 4) || [];
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    products.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchBestSellers();
});
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

.best-sellers {
  width: 100%;
  padding: 3rem 0;
  background: $bg-page;

  @include up(md) {
    padding: 5rem 0;
  }

  &__container {
    width: 100%;
    margin-inline: auto;
    padding-inline: 16px;

    @include up(md) {
      max-width: 1104px;
      padding-inline: 20px;
    }
    @include up(lg) {
      max-width: 1472px;
      padding-inline: 24px;
    }
    @include up(xl) {
      max-width: 1656px;
      padding-inline: 32px;
    }
  }

  &__heading {
    font-family: $font-heading;
    font-weight: 700;
    font-size: clamp(2rem, 6vw, 2.75rem);
    text-align: center;
    margin-bottom: 3rem;
    color: $brand-ink;
    letter-spacing: 0.02em;

    @include up(md) {
      margin-bottom: 4rem;
    }
  }

  &__loading {
    display: flex;
    justify-content: center;
    padding: 4rem 0;
  }

  &__grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: 1fr;

    @include up(sm) {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }

    @include up(lg) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__cta {
    display: flex;
    justify-content: center;
    margin-top: 3rem;

    @include up(md) {
      margin-top: 4rem;
    }
  }
}

// Product Card Component
.product-card {
  background: $bg-card;
  border: 1px solid $border-base;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 6px 16px $shadow-soft;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px $shadow-med;
  }

  &__link {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  &__media {
    position: relative;
    aspect-ratio: 1 / 1;
    background: $bg-page;
    overflow: hidden;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 0.75rem;
    transition: transform 0.3s ease;
  }

  &:hover &__img {
    transform: scale(1.05);
  }

  &__badges {
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    gap: 8px;
  }

  &__body {
    padding: 1rem;
  }

  &__title {
    font-family: $font-heading;
    color: $brand-ink;
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0 0 0.75rem;
    line-height: 1.3;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid $border-base;
  }

  &__price {
    font-size: 1.25rem;
    font-weight: 600;
    color: $brand-ink;
  }
}
</style>
