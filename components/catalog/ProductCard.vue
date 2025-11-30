<template>
  <article class="product-card">
    <div class="product-card__media" @click="goToPDP">
      <img
        :src="product.images?.[0]?.url || '/img/placeholder.png'"
        :alt="product.name"
        class="product-card__img"
        loading="lazy"
      />
      
      <!-- Heart/Wishlist Icon -->
      <button 
        class="product-card__heart"
        :class="{ 'product-card__heart--active': isFav }"
        @click.stop="toggleFav"
        :title="isFav ? 'Премахни от любими' : 'Добави в любими'"
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
      
      <!-- Quick View Button -->
      <button 
        class="product-card__quick" 
        @click.stop="$emit('quick-view', product)"
      >
        Бърз Преглед
      </button>

      <!-- Badges -->
      <div class="product-card__badges" v-if="badges.length">
        <span
          v-for="badge in badges"
          :key="badge.key"
          class="product-card__badge"
          :class="`product-card__badge--${badge.key}`"
        >
          {{ badge.label }}
        </span>
      </div>
    </div>

    <div class="product-card__body">
      <h3 class="product-card__title">{{ product.name }}</h3>
      <div class="product-card__price">
        <span class="product-card__price-current">{{ formatPrice(product.price) }}</span>
        <span v-if="product.compareAt" class="product-card__price-old">
          {{ formatPrice(product.compareAt) }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlist } from '~/stores/useWishlist'

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
  images?: ProductImage[]
  stock: number
  customEmbroidery?: boolean
  createdAt: string
}

const props = defineProps<{
  product: Product
}>()

defineEmits<{
  'quick-view': [product: Product]
}>()

const router = useRouter()
const wishlist = useWishlist()

const isFav = computed(() => wishlist.ids.includes(props.product._id))

const toggleFav = () => {
  wishlist.toggle(props.product._id)
}

const badges = computed(() => {
  const arr: Array<{ key: string; label: string }> = []
  
  if (isNew.value) arr.push({ key: 'new', label: 'Ново' })
  if (isSale.value) arr.push({ key: 'sale', label: `${savePercent.value}%` })
  if (props.product.customEmbroidery) arr.push({ key: 'personal', label: 'Персонализация' })
  
  return arr
})

const isNew = computed(() => {
  const productDate = new Date(props.product.createdAt)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - productDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 30
})

const isSale = computed(() => {
  return props.product.compareAt != null && props.product.compareAt > props.product.price
})

const savePercent = computed(() => {
  if (!props.product.compareAt) return 0
  return Math.round(100 - (props.product.price / props.product.compareAt) * 100)
})

const formatPrice = (price?: number | null) => {
  if (price == null) return ''
  return `${price.toFixed(2)} лв.`
}

const goToPDP = () => {
  const slug = props.product.slug || props.product._id
  router.push(`/products/${slug}`)
}
</script>

<style scoped lang="scss">
@use '~/assets/styles/colors' as *;
@use '~/assets/styles/breakpoints' as *;
@use '~/assets/styles/fonts' as *;

// ═══════════════════════════════════════════════════
// PRODUCT CARD - Moonkie Sharp Corners Design
// ═══════════════════════════════════════════════════

.product-card {
  background: $bg-card;
  overflow: hidden;
  border: 1px solid $border-base;
  transition: all 0.25s ease;

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
    aspect-ratio: 1 / 1.2;
    background: $bg-page;
    overflow: hidden;
    cursor: pointer;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }

  // Heart/Wishlist Icon (top-right)
  &__heart {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid $border-base;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 6;
    transition: all 0.2s ease;

    &:hover {
      background: $color-white;
      transform: scale(1.1);
    }

    &--active {
      background: $color-white;
      .product-card__heart-icon {
        color: #EF4444;
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
      background: #DC4F3E;
      color: $color-white;
    }

    &--personal {
      background: $color-sage;
      color: $brand-ink;
    }
  }

  &__body {
    padding: 12px 8px;
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

  &__price {
    display: flex;
    gap: 6px;
    align-items: baseline;
    flex-wrap: wrap;
  }

  &__price-current {
    font-weight: 600;
    font-size: 0.9375rem;
    color: $brand-ink;

    @include up(md) {
      font-size: 1rem;
    }
  }

  &__price-old {
    color: $text-secondary;
    text-decoration: line-through;
    font-size: 0.8125rem;

    @include up(md) {
      font-size: 0.875rem;
    }
  }
}
</style>

