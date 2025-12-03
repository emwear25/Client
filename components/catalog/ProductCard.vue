<template>
  <article class="product-card">
    <div class="product-card__media" @click="goToPDP">
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
        :placeholder-class="['bg-gray-200', 'animate-pulse']"
      />

      <!-- Quick View Button -->
      <button class="product-card__quick" @click.stop="$emit('quick-view', product)">
        Бърз Преглед
      </button>

      <!-- Badges (top-left) -->
      <div v-if="badges.length" class="product-card__badges">
        <span
          v-for="badge in badges"
          :key="badge.key"
          class="product-card__badge"
          :class="`product-card__badge--${badge.key}`"
        >
          {{ badge.label }}
        </span>
      </div>

      <!-- Discount Badge (top-right corner) -->
      <div v-if="isSale" class="product-card__discount">
        <div class="product-card__discount-circle">
          <div class="product-card__discount-text">
            <span class="product-card__discount-value">{{ savePercent }}%</span>
            <span class="product-card__discount-label">OFF</span>
          </div>
        </div>
      </div>
    </div>

    <div class="product-card__body">
      <h3 class="product-card__title">{{ product.name }}</h3>
      <!-- Ratings -->
      <div v-if="product.reviewStats && product.reviewStats.totalReviews > 0" class="product-card__rating">
        <span class="product-card__stars">
          <span
            v-for="star in 5"
            :key="star"
            class="product-card__star"
            :class="{
              'product-card__star--filled': star <= Math.round(product.reviewStats.averageRating),
            }"
          >
            ★
          </span>
        </span>
        <span class="product-card__rating-text">
          {{ product.reviewStats.averageRating.toFixed(1) }}
          <span class="product-card__rating-count">({{ product.reviewStats.totalReviews }})</span>
        </span>
      </div>
      <div class="product-card__price-wrapper">
        <div class="product-card__price">
          <span class="product-card__price-current">{{ formatPrice(product.price) }}</span>
          <span v-if="product.compareAt" class="product-card__price-old">
            {{ formatPrice(product.compareAt) }}
          </span>
        </div>
        <!-- Heart/Wishlist Icon -->
        <button
          class="product-card__heart"
          :class="{ 'product-card__heart--active': isFav }"
          :title="isFav ? 'Премахни от любими' : 'Добави в любими'"
          @click.stop="toggleFav"
        >
          <svg viewBox="0 0 24 24" class="product-card__heart-icon">
            <path
              :fill="isFav ? 'currentColor' : 'none'"
              stroke="currentColor"
              stroke-width="1.5"
              d="M12.1 20.1s-7.1-4.3-9.1-8.1A5.4 5.4 0 0 1 12 6.2a5.4 5.4 0 0 1 9 5.8c-2 3.8-9 8.1-9 8.1z"
            />
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useWishlist } from "~/stores/useWishlist";

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
  images?: ProductImage[];
  stock: number;
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

const props = defineProps<{
  product: Product;
}>();

defineEmits<{
  "quick-view": [product: Product];
}>();

const router = useRouter();
const wishlist = useWishlist();

const isFav = computed(() => wishlist.ids.includes(props.product._id));

const toggleFav = () => {
  wishlist.toggle(props.product._id);
};

const badges = computed(() => {
  const arr: Array<{ key: string; label: string }> = [];

  // Don't show sale badge in top-left since we have discount badge in top-right
  if (isNew.value) arr.push({ key: "new", label: "Ново" });
  if (props.product.customEmbroidery) arr.push({ key: "personal", label: "Персонализация" });

  return arr;
});

const isNew = computed(() => {
  const productDate = new Date(props.product.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - productDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30;
});

const isSale = computed(() => {
  return props.product.compareAt != null && props.product.compareAt > props.product.price;
});

const savePercent = computed(() => {
  if (!props.product.compareAt) return 0;
  return Math.round(100 - (props.product.price / props.product.compareAt) * 100);
});

const formatPrice = (price?: number | null) => {
  if (price == null) return "";
  return `${price.toFixed(2)} лв.`;
};

const goToPDP = () => {
  const slug = props.product.slug || props.product._id;
  router.push(`/products/${slug}`);
};
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

// ═══════════════════════════════════════════════════
// PRODUCT CARD - Moonkie Sharp Corners Design
// ═══════════════════════════════════════════════════

.product-card {
  background: $bg-card;
  overflow: hidden;
  border: 1px solid $border-base;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  width: 100%;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .product-card__img {
      transform: scale(1.02);
    }

    .product-card__quick {
      transform: translateY(0);
      opacity: 1;
    }
  }

  &__media {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1; // Square image - same width and height
    background: $bg-page;
    overflow: visible; // Allow discount badge to be visible
    cursor: pointer;
    flex-shrink: 0;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }

  // Heart/Wishlist Icon (bottom-right in body)
  &__heart {
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid $border-base;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s ease;

    &:hover {
      background: $color-white;
      transform: scale(1.1);
    }

    &--active {
      background: $color-white;
      .product-card__heart-icon {
        color: #ef4444;
      }
    }
  }

  &__heart-icon {
    width: 18px;
    height: 18px;
    color: $brand-ink;
    transition: color 0.2s ease;
  }

  // Quick View Button (appears on hover) - NO ROUNDED CORNERS
  &__quick {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.95);
    color: $brand-ink;
    border: none;
    border-top: 1px solid $border-base;
    padding: 0.75rem 1rem;
    font-weight: 600;
    font-family: $font-body;
    font-size: 0.8125rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    transform: translateY(100%);
    opacity: 0;
    transition: all 0.25s ease;
    cursor: pointer;

    &:hover {
      background: $brand-ink;
      color: $color-white;
    }
  }

  // Badges (top-left) - SHARP CORNERS like Moonkie
  &__badges {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
    z-index: 5;
  }

  &__badge {
    padding: 6px 12px;
    font-size: 0.6875rem;
    font-weight: 700;
    color: $color-white;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &--new {
      background: $color-honey;
      color: $brand-ink;
    }

    &--sale {
      background: #dc4f3e;
      color: $color-white;
    }

    &--personal {
      background: $color-sage;
      color: $brand-ink;
    }
  }

  // Discount Badge (top-right corner) - Clean circular design
  &__discount {
    position: absolute;
    top: 0;
    right: 0;
    width: 115px; // Increased by 15%
    height: 115px; // Increased by 15%
    z-index: 10;
    overflow: hidden;
    pointer-events: none;
  }

  &__discount-circle {
    position: absolute;
    top: -57.5px; // Adjusted for 115px size
    right: -57.5px; // Adjusted for 115px size
    width: 115px; // Increased by 15%
    height: 115px; // Increased by 15%
    background: #dc4f3e;
    border-radius: 50%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
  }

  &__discount-text {
    position: absolute;
    bottom: 15px; // Adjusted as requested
    left: 20px; // Adjusted as requested
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  &__discount-value {
    font-size: 1.25rem;
    font-weight: 900;
    color: $color-white;
    line-height: 1;
    font-family: $font-body;
    display: block;
  }

  &__discount-label {
    font-size: 0.625rem;
    font-weight: 800;
    color: $color-white;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 2px;
    display: block;
  }

  &__body {
    padding: 12px 8px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__price-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: auto;
  }

  &__title {
    font-family: $font-heading;
    color: $brand-ink;
    font-size: 0.9375rem;
    margin: 0 0 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.6em;
    line-height: 1.3;
    font-weight: 400;

    @include up(md) {
      font-size: 1rem;
    }
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 0 8px;
  }

  &__stars {
    display: flex;
    gap: 2px;
  }

  &__star {
    font-size: 0.875rem;
    color: #d1d5db;
    line-height: 1;

    &--filled {
      color: #fbbf24;
    }
  }

  &__rating-text {
    font-size: 0.8125rem;
    color: $text-secondary;
    font-weight: 500;
  }

  &__rating-count {
    font-weight: 400;
  }

  &__price {
    display: flex;
    gap: 8px;
    align-items: baseline;
    flex-wrap: nowrap;
    flex: 1;
  }

  &__price-current {
    font-weight: 600;
    font-size: 0.9375rem;
    color: $brand-ink;
    white-space: nowrap;

    @include up(md) {
      font-size: 1rem;
    }
  }

  &__price-old {
    color: $text-secondary;
    text-decoration: line-through;
    font-size: 0.8125rem;
    white-space: nowrap;

    @include up(md) {
      font-size: 0.875rem;
    }
  }
}
</style>
