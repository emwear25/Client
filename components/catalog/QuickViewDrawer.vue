<template>
  <Teleport to="body">
    <div v-if="open" class="qv">
      <!-- Backdrop -->
      <div class="qv__backdrop" @click="$emit('close')"/>

      <!-- Panel (LEFT slide-in) -->
      <aside class="qv__panel" role="dialog" aria-modal="true" aria-labelledby="qv-title">
        <!-- Close Button -->
        <button class="qv__close" aria-label="Затвори" @click="$emit('close')">×</button>

        <!-- Header with Image -->
        <div class="qv__header">
          <NuxtImg
            :src="product?.images?.[0]?.url || '/img/placeholder.png'"
            :alt="product?.name"
            class="qv__header-img"
            format="webp"
            quality="80"
          />
        </div>

        <!-- Body -->
        <div class="qv__body">
          <h3 id="qv-title" class="qv__title">{{ product?.name }}</h3>

          <!-- Price -->
          <div class="qv__price">
            <span class="qv__price-current">{{ formatPrice(product?.price) }}</span>
            <span v-if="product?.compareAt" class="qv__price-old">
              {{ formatPrice(product?.compareAt) }}
            </span>
          </div>

          <!-- Colors (if available) -->
          <div v-if="product?.colors?.length" class="qv__group">
            <p class="qv__label">ЦВЯТ</p>
            <div class="qv__swatches">
              <button
                v-for="(color, index) in product.colors"
                :key="index"
                class="qv__swatch"
                :style="{ background: getColorHex(color) }"
                :aria-label="color"
                :title="color"
              />
            </div>
          </div>

          <!-- Sizes (if available) -->
          <div v-if="product?.sizes?.length" class="qv__group">
            <p class="qv__label">РАЗМЕР</p>
            <div class="qv__choices">
              <button v-for="size in product.sizes" :key="size" class="qv__choice">
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Add to Cart Button -->
          <button
            class="btn btn--primary qv__cta"
            :disabled="!product?.stock || product.stock === 0"
            @click="addToCart"
          >
            {{ product?.stock > 0 ? "Добави в количката" : "Изчерпан" }}
          </button>

          <!-- USP List -->
          <ul class="qv__usp">
            <li>✓ Безплатна доставка над 110 лв</li>
            <li>✓ Лесно връщане до 30 дни</li>
            <li>✓ Безопасни материали</li>
          </ul>

          <!-- View Full Product -->
          <NuxtLink
            :to="`/products/${product?.slug || product?._id}`"
            class="qv__view"
            @click="$emit('close')"
          >
            Виж пълния продукт →
          </NuxtLink>
        </div>
      </aside>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
import { useToast } from "~/composables/useToast";

interface ProductImage {
  url: string;
  publicId: string;
}

interface Product {
  _id: string;
  slug?: string;
  name: string;
  price: number;
  compareAt?: number | null;
  images?: ProductImage[];
  colors?: string[];
  sizes?: string[];
  stock: number;
  weight?: number; // Weight in kg for shipping
}

const props = defineProps<{
  open: boolean;
  product: Product | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const cartStore = useCartStore();
const toast = useToast();

const formatPrice = (price?: number | null) => {
  if (price == null) return "";
  return `${price.toFixed(2)} лв.`;
};

const getColorHex = (color: string) => {
  // Simple color mapping - extend as needed
  const colorMap: Record<string, string> = {
    червен: "#EF4444",
    червено: "#EF4444",
    син: "#3B82F6",
    синьо: "#3B82F6",
    зелен: "#10B981",
    зелено: "#10B981",
    жълт: "#F59E0B",
    жълто: "#F59E0B",
    бял: "#F9FAFB",
    бяло: "#F9FAFB",
    черен: "#1F2937",
    черно: "#1F2937",
    розов: "#EC4899",
    розово: "#EC4899",
  };
  return colorMap[color.toLowerCase()] || "#9CA3AF";
};

const addToCart = () => {
  if (!props.product) return;

  cartStore.addItem(
    {
      id: props.product._id,
      name: props.product.name,
      price: props.product.price,
      image: props.product.images?.[0]?.url,
      size: props.product.sizes?.[0],
      color: props.product.colors?.[0],
      weight: props.product.weight || 0.5, // Include weight for shipping calculation
    },
    1
  );

  toast.success(`${props.product.name} е добавен в количката!`);

  // Close drawer after adding
  emit("close");
};
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

// ═══════════════════════════════════════════════════
// QUICK VIEW DRAWER - LEFT slide-in
// ═══════════════════════════════════════════════════

.qv {
  position: fixed;
  inset: 0;
  z-index: 200;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(2px);
  }

  &__panel {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: min(560px, 92vw);
    background: $bg-card;
    color: $text-primary;
    box-shadow: -8px 0 30px rgba(0, 0, 0, 0.18);
    transform: translateX(100%);
    animation: qv-in 0.35s ease forwards;
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: hidden;
  }

  @keyframes qv-in {
    to {
      transform: translateX(0);
    }
  }

  &__close {
    position: absolute;
    top: 8px;
    left: 12px;
    width: 36px;
    height: 36px;
    border-radius: 999px;
    border: 1px solid $border-base;
    background: $color-white;
    cursor: pointer;
    color: $brand-ink;
    font-size: 1.75rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    z-index: 10;
    box-shadow: 0 2px 8px $shadow-soft;

    &:hover {
      background: $brand;
      color: $color-white;
      transform: scale(1.1);
    }
  }

  &__header {
    padding: 18px;
    border-bottom: 1px solid $border-base;
    background: $bg-page;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__header-img {
    width: 100%;
    max-width: 400px;
    height: auto;
    max-height: 320px;
    object-fit: contain;
    display: block;
  }

  &__body {
    padding: 18px;
    overflow: auto;
  }

  &__title {
    font-family: $font-heading;
    color: $brand-ink;
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    line-height: 1.3;
  }

  &__price {
    display: flex;
    gap: 10px;
    align-items: baseline;
    margin-bottom: 1rem;
  }

  &__price-current {
    font-weight: 600;
    font-size: 1.25rem;
    color: $brand-ink;
  }

  &__price-old {
    color: $text-secondary;
    text-decoration: line-through;
    font-size: 1rem;
  }

  &__group {
    margin: 1rem 0;
  }

  &__label {
    font-size: 0.85rem;
    font-weight: 600;
    color: $text-secondary;
    margin-bottom: 0.4rem;
    letter-spacing: 0.05em;
  }

  &__swatches {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__swatch {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    border: 1px solid $border-base;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.15);
      box-shadow: 0 2px 8px $shadow-soft;
    }
  }

  &__choices {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__choice {
    border: 1px solid $border-base;
    border-radius: 999px;
    padding: 0.45rem 0.8rem;
    background: $bg-page;
    color: $brand-ink;
    font-family: $font-body;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: $brand;
      border-color: $brand;
      color: $brand-ink;
    }
  }

  &__cta {
    width: 100%;
    margin-top: 8px;
    padding: 0.875rem 1.5rem;
    font-size: 1rem;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__usp {
    margin: 12px 0;
    padding-left: 0;
    list-style: none;
    color: $text-secondary;
    font-size: 0.9375rem;

    li {
      padding: 0.25rem 0;
      line-height: 1.6;
    }
  }

  &__view {
    display: inline-block;
    margin-top: 6px;
    text-decoration: underline;
    color: $brand-ink;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: $brand;
    }
  }
}
</style>
