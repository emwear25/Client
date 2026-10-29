<template>
  <div v-if="addOns.length > 0" class="pdp-addon">
    <p class="pdp-addon__title">Добави към поръчката</p>
    <div class="pdp-addon__list">
      <div v-for="a in addOns" :key="a._id" class="pdp-addon__item">
        <NuxtLink :to="`/products/${a.slug}`" class="pdp-addon__media">
          <NuxtImg
            :src="image(a)"
            :alt="a.name"
            class="pdp-addon__img"
            format="webp"
            quality="75"
            width="56"
            height="56"
            loading="lazy"
          />
        </NuxtLink>
        <div class="pdp-addon__info">
          <NuxtLink :to="`/products/${a.slug}`" class="pdp-addon__name">{{ a.name }}</NuxtLink>
          <span class="pdp-addon__price">{{ formatMoney(a.price) }}</span>
        </div>
        <button class="pdp-addon__btn" type="button" @click="add(a)">+ Добави</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useApi } from "~/composables/useApi";
import { useCartStore } from "~/stores/cart";
import { useCurrency } from "~/composables/useCurrency";
import { useToast } from "~/composables/useToast";

interface Props {
  productId: string;
  limit?: number;
}
const props = withDefaults(defineProps<Props>(), { limit: 3 });

const api = useApi();
const cartStore = useCartStore();
const { formatMoney } = useCurrency();
const toast = useToast();

const addOns = ref<any[]>([]);

const image = (a: any): string =>
  a?.images?.[0]?.url || a?.colorImages?.[0]?.images?.[0]?.url || "/img/placeholder.png";

const fetchAddOns = async () => {
  if (!props.productId) return;
  try {
    const res = await api.get(`products/${props.productId}/suggested?limit=${props.limit}`);
    addOns.value = res?.success && res.data ? res.data.filter((p: any) => (p.stock ?? 0) > 0) : [];
  } catch {
    addOns.value = [];
  }
};

const add = (a: any) => {
  cartStore.addItem(
    {
      id: a._id,
      name: a.name,
      price: a.price,
      image: image(a),
      category: a.category && typeof a.category === "object" ? a.category : undefined,
    },
    1,
  );
  toast.success(`${a.name} е добавен в количката!`, 3000);
};

onMounted(fetchAddOns);
watch(() => props.productId, fetchAddOns);
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/fonts" as *;

.pdp-addon {
  margin-top: 1rem;
  padding: 0.85rem 1rem;
  border: 1px solid $border-base;
  border-radius: 12px;
  background: $bg-page;

  &__title {
    margin: 0 0 0.6rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: $text-secondary;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  &__item {
    display: grid;
    grid-template-columns: 56px 1fr auto;
    align-items: center;
    gap: 0.75rem;
  }

  &__media {
    display: block;
    line-height: 0;
  }

  &__img {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid $border-base;
    background: $color-white;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }

  &__name {
    font-size: 0.85rem;
    font-weight: 600;
    color: $brand-ink;
    text-decoration: none;
    line-height: 1.25;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    &:hover {
      text-decoration: underline;
    }
  }

  &__price {
    font-size: 0.85rem;
    font-weight: 700;
    color: $brand-ink;
  }

  &__btn {
    flex-shrink: 0;
    padding: 0.4rem 0.8rem;
    border: 1px solid $brand;
    border-radius: 999px;
    background: $color-white;
    color: $brand;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: $brand;
      color: $color-white;
    }
  }
}
</style>
