<template>
  <div class="orders-page">
    <div class="container">
      <div class="orders-page__header">
        <h1 class="orders-page__title">Моите Поръчки</h1>
        <p class="orders-page__subtitle">Прегледайте историята на вашите поръчки</p>
      </div>

      <div v-if="isLoading" class="orders-page__loading">
        <p>Зареждане на поръчки...</p>
      </div>

      <div v-else-if="error" class="orders-page__error">
        <h2>Грешка</h2>
        <p>{{ error }}</p>
        <button class="btn btn--primary" @click="fetchOrders">Опитай отново</button>
      </div>

      <div v-else-if="orders.length === 0" class="orders-page__empty">
        <h2>Нямате поръчки</h2>
        <p>Все още нямате направени поръчки.</p>
        <NuxtLink to="/products" class="btn btn--primary">
          Разгледай Продукти
        </NuxtLink>
      </div>

      <div v-else class="orders-page__list">
        <div v-for="order in orders" :key="order._id" class="order-card">
          <div class="order-card__header">
            <div class="order-card__info">
              <h3 class="order-card__number">Поръчка #{{ order.orderNumber }}</h3>
              <p class="order-card__date">{{ formatDate(order.createdAt) }}</p>
            </div>
            <span class="order-card__status" :class="`order-card__status--${order.orderStatus}`">
              {{ getStatusLabel(order.orderStatus) }}
            </span>
          </div>

          <div class="order-card__items">
            <div v-for="item in order.items" :key="item._id" class="order-item">
              <img 
                :src="getItemImage(item)" 
                :alt="item.name" 
                class="order-item__image"
                @error="(e) => (e.target as HTMLImageElement).src = '/img/placeholder.png'"
              />
              <div class="order-item__info">
                <h4 class="order-item__name">{{ item.name }}</h4>
                <p class="order-item__meta">
                  <span v-if="item.size">Размер: {{ item.size }}</span>
                  <span v-if="item.color"> • Цвят: {{ item.color }}</span>
                  <span> • Количество: {{ item.quantity }}</span>
                </p>
              </div>
              <div class="order-item__price">{{ (item.price * item.quantity).toFixed(2) }} лв</div>
            </div>
          </div>

          <div class="order-card__summary">
            <div class="order-card__row">
              <span>Общо:</span>
              <span>{{ order.total.toFixed(2) }} лв</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
console.log('[Orders Page] Component loading...')

import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const toast = useToast()

const orders = ref<any[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  pages: 1
})

const fetchOrders = async () => {
  console.log('[Orders Page] Fetching orders...')
  isLoading.value = true
  error.value = null

  try {
    if (!authStore.accessToken) {
      throw new Error('Не сте удостоверени')
    }

    const response = await $fetch('http://localhost:3030/api/orders', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })

    console.log('[Orders Page] Response:', response)

    if (response.success) {
      orders.value = response.data || []
      pagination.value = response.pagination || pagination.value
    } else {
      throw new Error('Неуспешно зареждане на поръчките')
    }
  } catch (err: any) {
    console.error('[Orders Page] Error:', err)
    error.value = err.data?.message || err.message || 'Грешка при зареждане на поръчките'
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'В очакване',
    processing: 'Обработва се',
    shipped: 'Изпратена',
    delivered: 'Доставена',
    cancelled: 'Отменена'
  }
  return labels[status] || status
}

const getItemImage = (item: any) => {
  // Check if item has image
  if (!item.image) {
    // Try to get from populated product
    if (item.product?.images?.[0]?.url) {
      return item.product.images[0].url
    }
    return '/img/placeholder.png'
  }
  
  // Handle if image is an object with url property
  if (typeof item.image === 'object' && item.image.url) {
    return item.image.url
  }
  
  // Handle if image is a string
  if (typeof item.image === 'string') {
    return item.image
  }
  
  return '/img/placeholder.png'
}

onMounted(() => {
  console.log('[Orders Page] Mounted!')
  fetchOrders()
})

useHead({
  title: 'Моите Поръчки - emWear'
})
</script>

<style lang="scss" scoped>
@use '~/assets/styles/colors' as *;
@use '~/assets/styles/fonts' as *;
@use '~/assets/styles/breakpoints' as *;

.orders-page {
  min-height: 60vh;
  padding: 2rem 0 4rem;

  &__header {
    margin-bottom: 2rem;
    text-align: center;

    @include up(md) {
      text-align: left;
    }
  }

  &__title {
    font-family: $font-heading;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 0.5rem;
  }

  &__subtitle {
    font-family: $font-body;
    font-size: 1rem;
    color: $text-secondary;
    margin: 0;
  }

  &__loading,
  &__error,
  &__empty {
    text-align: center;
    padding: 4rem 1rem;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
}

.order-card {
  background: $bg-card;
  border: 1px solid $border-base;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px $shadow-soft;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid $border-base;
    flex-wrap: wrap;
    gap: 1rem;
  }

  &__number {
    font-family: $font-heading;
    font-size: 1.25rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 0.25rem;
  }

  &__date {
    font-family: $font-body;
    font-size: 0.875rem;
    color: $text-secondary;
    margin: 0;
  }

  &__status {
    padding: 0.375rem 0.75rem;
    border-radius: 999px;
    font-family: $font-body;
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;

    &--pending {
      background: rgba(251, 191, 36, 0.1);
      color: #d97706;
    }

    &--processing {
      background: rgba(59, 130, 246, 0.1);
      color: #2563eb;
    }

    &--delivered {
      background: rgba(34, 197, 94, 0.1);
      color: #16a34a;
    }
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  &__summary {
    padding: 1rem;
    background: $bg-page;
    border-radius: 8px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    font-family: $font-body;
    font-weight: 700;
    color: $brand-ink;
  }
}

.order-item {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 1rem;
  align-items: center;

  &__image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    background: $bg-page;
    border: 1px solid $border-base;
  }

  &__name {
    font-family: $font-body;
    font-size: 1rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 0.5rem;
  }

  &__meta {
    font-size: 0.8125rem;
    color: $text-secondary;
    margin: 0;
  }

  &__price {
    font-family: $font-body;
    font-size: 1rem;
    font-weight: 600;
    color: $brand-ink;
    text-align: right;
  }
}
</style>

