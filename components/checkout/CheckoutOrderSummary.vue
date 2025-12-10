<template>
  <div class="checkout-order-summary">
    <h2 class="checkout-order-summary__title">Обобщение на поръчката</h2>

    <!-- Empty Cart State -->
    <div v-if="isEmpty" class="checkout-order-summary__empty">
      <p>Количката е празна.</p>
      <NuxtLink to="/products" class="btn btn--primary"> Разгледай Продукти </NuxtLink>
    </div>

    <!-- Cart Items -->
    <div v-else class="checkout-order-summary__items">
      <div v-for="item in items" :key="item.id" class="checkout-order-summary__item">
        <NuxtImg
          v-if="item.image"
          :src="item.image"
          :alt="item.name"
          class="checkout-order-summary__item-image"
          format="webp"
          quality="75"
          width="80"
          height="80"
          loading="lazy"
          placeholder
        />
        <div class="checkout-order-summary__item-info">
          <h4 class="checkout-order-summary__item-name">{{ item.name }}</h4>
          <p class="checkout-order-summary__item-details">
            <span v-if="item.size">Размер: {{ item.size }}</span>
            <span v-if="item.color"> • Цвят: {{ item.color }}</span>
            <span v-if="item.embroidery?.name"> • Бродерия: {{ item.embroidery.name }}</span>
          </p>
          <p class="checkout-order-summary__item-quantity">Количество: {{ item.quantity }}</p>
        </div>
        <div class="checkout-order-summary__item-price">
          {{ ((item.price || 0) * (item.quantity || 0)).toFixed(2) }} лв
        </div>
      </div>
    </div>

    <!-- Coupon Input -->
    <div class="checkout-order-summary__coupon-section">
      <CouponInput />
    </div>

    <!-- Totals -->
    <div class="checkout-order-summary__totals">
      <!-- Subtotal (with VAT included) -->
      <div
        class="checkout-order-summary__total-row"
        :class="{
          'checkout-order-summary__total-row--strikethrough': hasCoupon,
        }"
      >
        <span>Стойност на продуктите:</span>
        <span>{{ (subtotalBeforeDiscount || 0).toFixed(2) }} лв</span>
      </div>

      <!-- Coupon discount row -->
      <div
        v-if="hasCoupon"
        class="checkout-order-summary__total-row checkout-order-summary__total-row--discount"
      >
        <span> Отстъпка ({{ appliedCoupon }}) </span>
        <span class="checkout-order-summary__discount-amount"
          >-{{ (discountTotal || 0).toFixed(2) }} лв</span
        >
      </div>

      <!-- Subtotal after discount (if coupon applied) -->
      <div
        v-if="hasCoupon"
        class="checkout-order-summary__total-row checkout-order-summary__total-row--highlighted"
      >
        <span>Нова цена:</span>
        <span class="checkout-order-summary__new-price">{{ (totalPrice || 0).toFixed(2) }} лв</span>
      </div>

      <!-- Shipping (informational only - paid on delivery) -->
      <div
        v-if="shippingCost > 0"
        class="checkout-order-summary__total-row checkout-order-summary__total-row--info"
      >
        <span>Доставка (плаща се при получаване):</span>
        <span class="checkout-order-summary__info-price"
          >{{ (shippingCost || 0).toFixed(2) }} лв</span
        >
      </div>

      <!-- Final Total (with VAT included note) -->
      <div class="checkout-order-summary__total-row checkout-order-summary__total-row--final">
        <span>Обща сума (вкл. ДДС):</span>
        <span>{{ finalTotal.toFixed(2) }} лв</span>
      </div>
    </div>

    <!-- Submit Button -->
    <button
      :disabled="isSubmitting"
      class="checkout-order-summary__submit-btn"
      @click="$emit('submit')"
    >
      <span v-if="!isSubmitting">Завърши поръчката</span>
      <span v-else>Обработка...</span>
    </button>

    <!-- Error Message -->
    <div v-if="errorMessage" class="checkout-order-summary__error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface CartItem {
  id: string;
  name: string;
  image?: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
  embroidery?: {
    name: string;
    color?: string | null;
    font?: string | null;
  };
}

interface Props {
  items: CartItem[];
  isEmpty: boolean;
  subtotalBeforeDiscount: number;
  hasCoupon: boolean;
  appliedCoupon?: string;
  discountTotal: number;
  totalPrice: number;
  shippingCost: number;
  isSubmitting: boolean;
  errorMessage?: string;
}

const props = defineProps<Props>();

defineEmits<{
  submit: [];
}>();

// Computed final total (products only, shipping is paid separately on delivery)
const finalTotal = computed(() => {
  return props.totalPrice || 0;
});
</script>

<style scoped lang="scss">
.checkout-order-summary {
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    padding: 1.5rem;
  }

  &__title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.875rem 0;
    color: #1a1a1a;

    @media (min-width: 768px) {
      font-size: 1.0625rem;
      margin-bottom: 1rem;
    }
  }

  &__empty {
    text-align: center;
    padding: 1.5rem;
    color: #666;

    @media (min-width: 768px) {
      padding: 2rem;
    }
  }

  &__items {
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 0.875rem;
    padding-bottom: 0.875rem;

    @media (min-width: 768px) {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
    }
  }

  &__item {
    display: flex;
    gap: 0.625rem;
    margin-bottom: 0.75rem;
    width: 100%;
    box-sizing: border-box;

    @media (min-width: 768px) {
      gap: 0.75rem;
      margin-bottom: 0.875rem;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__item-image {
    width: 45px;
    height: 45px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;

    @media (min-width: 768px) {
      width: 50px;
      height: 50px;
      border-radius: 6px;
    }
  }

  &__item-info {
    flex: 1;
    min-width: 0;
  }

  &__item-name {
    font-weight: 600;
    margin: 0 0 0.125rem 0;
    font-size: 0.8125rem;
    word-wrap: break-word;
    line-height: 1.3;
    color: #1a1a1a;

    @media (min-width: 768px) {
      font-size: 0.875rem;
    }
  }

  &__item-details,
  &__item-quantity {
    font-size: 0.6875rem;
    color: #6b7280;
    line-height: 1.4;
    margin: 0;

    @media (min-width: 768px) {
      font-size: 0.75rem;
    }
  }

  &__item-price {
    font-weight: 600;
    color: #1a1a1a;
    flex-shrink: 0;
    font-size: 0.8125rem;

    @media (min-width: 768px) {
      font-size: 0.875rem;
    }
  }

  &__coupon-section {
    margin-bottom: 0.875rem;

    @media (min-width: 768px) {
      margin-bottom: 1rem;
    }
  }

  &__totals {
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 0.875rem;
    padding-bottom: 0.875rem;

    @media (min-width: 768px) {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
    }
  }

  &__total-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.8125rem;
    gap: 0.5rem;
    align-items: center;

    @media (min-width: 768px) {
      font-size: 0.875rem;
      margin-bottom: 0.625rem;
    }

    &--strikethrough {
      text-decoration: line-through;
      color: #9ca3af;
    }

    &--discount {
      color: #10b981;
    }

    &--highlighted {
      font-weight: 600;
      color: #1a1a1a;
    }

    &--info {
      color: #6b7280;
      font-size: 0.75rem;

      @media (min-width: 768px) {
        font-size: 0.8125rem;
      }
    }

    &--final {
      font-size: 0.9375rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-top: 0.625rem;
      padding-top: 0.625rem;
      border-top: 1.5px solid #e5e7eb;

      @media (min-width: 768px) {
        font-size: 1rem;
        margin-top: 0.75rem;
        padding-top: 0.75rem;
      }
    }
  }

  &__discount-amount {
    color: #10b981;
  }

  &__new-price {
    color: #1a1a1a;
  }

  &__info-price {
    color: #6b7280;
  }

  &__submit-btn {
    width: 100%;
    padding: 0.75rem;
    background: #b9c6aa;
    color: #2f3a2a;
    border: none;
    border-radius: 6px;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-sizing: border-box;
    min-height: 44px;

    @media (min-width: 768px) {
      padding: 0.875rem;
      font-size: 1rem;
    }

    &:hover:not(:disabled) {
      background: #a8b599;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(185, 198, 170, 0.3);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__error {
    margin-top: 0.75rem;
    padding: 0.75rem;
    background: #fef2f2;
    color: #dc2626;
    border-radius: 6px;
    font-size: 0.8125rem;

    @media (min-width: 768px) {
      margin-top: 0.875rem;
      padding: 0.875rem;
      font-size: 0.875rem;
    }
  }
}
</style>
