<template>
  <section v-if="products.length > 0" class="suggested-addons">
    <div class="suggested-addons__container">
      <h2 class="suggested-addons__title">Подхожда с</h2>
      <div class="suggested-addons__grid">
        <CatalogProductCard
          v-for="addOn in products"
          :key="addOn._id"
          :product="addOn"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useApi } from "~/composables/useApi";

interface Props {
  productId: string;
  limit?: number;
}

const props = withDefaults(defineProps<Props>(), {
  limit: 8,
});

const products = ref<any[]>([]);
const isLoading = ref(false);

const api = useApi();

const fetchSuggested = async () => {
  if (!props.productId) return;

  isLoading.value = true;
  try {
    const response = await api.get(`products/${props.productId}/suggested?limit=${props.limit}`);
    if (response.success && response.data) {
      products.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching suggested add-ons:", error);
    // Fail silently - not critical
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchSuggested);
watch(() => props.productId, fetchSuggested);
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

.suggested-addons {
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
