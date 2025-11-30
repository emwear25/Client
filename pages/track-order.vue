<template>
  <div class="track-order">
    <div class="track-order__container">
      <div class="track-order__header">
        <h1 class="track-order__title">Проследяване на поръчка</h1>
        <p class="track-order__subtitle">Въведете номера на поръчката и имейл адреса, използван при поръчката</p>
      </div>

      <div class="track-order__form-card">
        <form @submit.prevent="handleTrackOrder" class="track-order__form">
          <div class="form-group">
            <label class="form-label">
              Номер на поръчка <span class="required">*</span>
            </label>
            <input
              v-model="orderNumber"
              type="text"
              class="form-input"
              placeholder="EMW2511XXXX"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              Имейл адрес <span class="required">*</span>
            </label>
            <input
              v-model="email"
              type="email"
              class="form-input"
              placeholder="your@email.com"
              required
            />
          </div>

          <button
            type="submit"
            class="track-order__submit-btn"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">🔍 Проследи поръчка</span>
            <span v-else>Търсене...</span>
          </button>

          <div v-if="errorMessage" class="track-order__error">
            {{ errorMessage }}
          </div>
        </form>
      </div>

      <!-- Order Details (shown after successful lookup) -->
      <div v-if="order" class="track-order__details">
        <div class="order-header">
          <h2 class="order-title">Поръчка {{ order.orderNumber }}</h2>
          <span class="order-status" :class="`order-status--${order.orderStatus}`">
            {{ getStatusLabel(order.orderStatus) }}
          </span>
        </div>

        <div class="order-info-grid">
          <div class="info-card">
            <div class="info-card__label">Дата на поръчка</div>
            <div class="info-card__value">{{ formatDate(order.createdAt) }}</div>
          </div>

          <div class="info-card">
            <div class="info-card__label">Метод на доставка</div>
            <div class="info-card__value">{{ getDeliveryMethodLabel(order.deliveryMethod) }}</div>
          </div>

          <div class="info-card">
            <div class="info-card__label">Метод на плащане</div>
            <div class="info-card__value">{{ getPaymentMethodLabel(order.paymentMethod) }}</div>
          </div>

          <div class="info-card">
            <div class="info-card__label">Обща сума</div>
            <div class="info-card__value">{{ order.total.toFixed(2) }} лв</div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="order-items">
          <h3 class="section-title">Продукти</h3>
          <div class="items-list">
            <div v-for="item in order.items" :key="item._id" class="order-item">
              <img
                v-if="item.product?.images?.[0]?.url"
                :src="item.product.images[0].url"
                :alt="item.name"
                class="order-item__image"
              />
              <div class="order-item__details">
                <div class="order-item__name">{{ item.name }}</div>
                <div class="order-item__meta">
                  Количество: {{ item.quantity }} × {{ item.price.toFixed(2) }} лв
                </div>
              </div>
              <div class="order-item__total">
                {{ (item.quantity * item.price).toFixed(2) }} лв
              </div>
            </div>
          </div>
        </div>

        <!-- Shipping Address -->
        <div class="shipping-address">
          <h3 class="section-title">Адрес за доставка</h3>
          <div class="address-card">
            <p><strong>{{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}</strong></p>
            <p>{{ order.shippingAddress.street }}</p>
            <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.postalCode }}</p>
            <p>{{ order.shippingAddress.country }}</p>
            <p>Телефон: {{ order.shippingAddress.phone }}</p>
            <p>Имейл: {{ order.shippingAddress.email }}</p>
          </div>
        </div>

        <!-- Status History -->
        <div v-if="order.statusHistory?.length" class="status-history">
          <h3 class="section-title">История на статуса</h3>
          <div class="timeline">
            <div
              v-for="(status, index) in order.statusHistory"
              :key="index"
              class="timeline-item"
            >
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-status">{{ getStatusLabel(status.status) }}</div>
                <div class="timeline-date">{{ formatDate(status.timestamp) }}</div>
                <div v-if="status.note" class="timeline-note">{{ status.note }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const orderNumber = ref('')
const email = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const order = ref<any>(null)

const handleTrackOrder = async () => {
  if (!orderNumber.value || !email.value) {
    errorMessage.value = 'Моля, попълнете всички полета.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  order.value = null

  try {
    const response = await $fetch(`http://localhost:3030/api/orders/track`, {
      method: 'GET',
      params: {
        orderNumber: orderNumber.value,
        email: email.value
      }
    })

    if (response.success) {
      order.value = response.data
    } else {
      errorMessage.value = response.message || 'Поръчката не е намерена.'
    }
  } catch (error: any) {
    console.error('Track order error:', error)
    errorMessage.value = error.data?.message || 'Поръчката не е намерена. Моля, проверете номера и имейла.'
  } finally {
    isLoading.value = false
  }
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Чакаща',
    confirmed: 'Потвърдена',
    processing: 'В обработка',
    shipped: 'Изпратена',
    delivered: 'Доставена',
    cancelled: 'Отказана'
  }
  return labels[status] || status
}

const getDeliveryMethodLabel = (method: string) => {
  const labels: Record<string, string> = {
    courier_address: 'Куриер до адрес',
    econt_office: 'Офис на Еконт',
    econt_automat: 'Еконтомат',
    speedy_office: 'Офис на Speedy',
    speedy_apt: 'Speedy APT'
  }
  return labels[method] || method
}

const getPaymentMethodLabel = (method: string) => {
  const labels: Record<string, string> = {
    cash_on_delivery: 'Наложен платеж',
    card_online: 'Онлайн с карта'
  }
  return labels[method] || method
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped lang="scss">
.track-order {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 1rem;
}

.track-order__container {
  max-width: 800px;
  margin: 0 auto;
}

.track-order__header {
  text-align: center;
  margin-bottom: 2rem;
}

.track-order__title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.track-order__subtitle {
  font-size: 1rem;
  color: #666;
}

.track-order__form-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.track-order__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.required {
  color: #e74c3c;
}

.form-input {
  padding: 0.875rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #B9C6AA;
    box-shadow: 0 0 0 3px rgba(185, 198, 170, 0.1);
  }
}

.track-order__submit-btn {
  padding: 1rem;
  background: #B9C6AA;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #A8B599;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(185, 198, 170, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.track-order__error {
  padding: 1rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
  text-align: center;
}

.track-order__details {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.order-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.order-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;

  &--pending {
    background: #fff3cd;
    color: #856404;
  }

  &--confirmed {
    background: #d1ecf1;
    color: #0c5460;
  }

  &--processing {
    background: #d1ecf1;
    color: #0c5460;
  }

  &--shipped {
    background: #d4edda;
    color: #155724;
  }

  &--delivered {
    background: #d4edda;
    color: #155724;
  }

  &--cancelled {
    background: #f8d7da;
    color: #721c24;
  }
}

.order-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-card {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-card__label {
  font-size: 0.8125rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.info-card__value {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.order-items {
  margin-bottom: 2rem;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.order-item__image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.order-item__details {
  flex: 1;
}

.order-item__name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.order-item__meta {
  font-size: 0.875rem;
  color: #666;
}

.order-item__total {
  font-weight: 600;
  color: #2c3e50;
}

.shipping-address {
  margin-bottom: 2rem;
}

.address-card {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;

  p {
    margin: 0.25rem 0;
    color: #2c3e50;
  }
}

.status-history {
  margin-top: 2rem;
}

.timeline {
  position: relative;
  padding-left: 2rem;

  &::before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e0e0e0;
  }
}

.timeline-item {
  position: relative;
  padding-bottom: 1.5rem;

  &:last-child {
    padding-bottom: 0;
  }
}

.timeline-dot {
  position: absolute;
  left: -1.5rem;
  top: 0.25rem;
  width: 12px;
  height: 12px;
  background: #B9C6AA;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #B9C6AA;
}

.timeline-content {
  padding-left: 0.5rem;
}

.timeline-status {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.timeline-date {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.timeline-note {
  font-size: 0.875rem;
  color: #666;
  font-style: italic;
}
</style>
