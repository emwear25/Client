<template>
  <section v-if="products.length > 0" class="related-products">
    <div class="related-products__container">
      <h2 class="related-products__title">Може да харесате също</h2>
      <div class="related-products__grid">
        <CatalogProductCard
          v-for="relatedProduct in products"
          :key="relatedProduct._id"
          :product="relatedProduct"
        />
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

interface ProductVariant {
  size: string;
  color: string;
  stock: number;
  reserved?: number;
}

interface Product {
  _id: string;
  slug?: string;
  name: string;
  description: string;
  price: number;
  compareAt?: number | null;
  category: string | { _id: string; name: string };
  images?: ProductImage[];
  stock: number;
  variants?: ProductVariant[];
  customEmbroidery?: boolean;
  createdAt: string;
  sizes?: string[];
  colors?: string[];
  isActive?: boolean;
  reviewStats?: {
    averageRating: number;
    totalReviews: number;
  };
}

interface Props {
  productId: string;
  limit?: number;
}

const props = withDefaults(defineProps<Props>(), {
  limit: 4,
});

const products = ref<Product[]>([]);
const isLoading = ref(false);

const api = useApi();

const fetchRelatedProducts = async () => {
  if (!props.productId) return;

  isLoading.value = true;
  try {
    const response = await api.get(`products/${props.productId}/related?limit=${props.limit}`);
    if (response.success && response.data) {
      products.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching related products:", error);
    // Fail silently - not critical
  } finally {
    isLoading.value = false;
  }
};


onMounted(() => {
  fetchRelatedProducts();
});
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

.related-products {
  padding: 3rem 0;
  background: $bg-page;
  border-top: 1px solid $border-base;

  @include up(lg) {
    padding: 4rem 0;
  }

  &__container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;

    @include up(md) {
      padding: 0 2rem;
    }
  }

  &__title {
    font-family: 'Outfit', sans-serif;
    font-size: 36px;
    font-weight: 300;
    color: rgb(51, 51, 51);
    margin: 0 0 2rem;
    text-align: center;
    line-height: 40px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @include up(md) {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    @include up(lg) {
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }
  }
}
</style>

