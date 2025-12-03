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
        <span class="checkout-order-summary__new-price"
          >{{ (totalPrice || 0).toFixed(2) }} лв</span
        >
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
      <div
        v-if="shippingCost > 0"
        style="font-size: 0.85rem; color: #666; margin-top: 0.5rem; text-align: center;"
      >
        * Доставката се плаща при получаване
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

// Computed final total (products + shipping for informational purposes)
const finalTotal = computed(() => {
  return (props.totalPrice || 0) + (props.shippingCost || 0);
});
</script>

<style scoped lang="scss">
.checkout-order-summary {
  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #1a1a1a;
  }

  &__empty {
    text-align: center;
    padding: 2rem;
    color: #666;
  }

  &__items {
    border-bottom: 1px solid #eee;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
  }

  &__item {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    width: 100%;
    box-sizing: border-box;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__item-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
  }

  &__item-info {
    flex: 1;
    min-width: 0;
  }

  &__item-name {
    font-weight: 600;
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
    word-wrap: break-word;
  }

  &__item-details,
  &__item-quantity {
    font-size: 0.8rem;
    color: #666;
  }

  &__item-price {
    font-weight: 600;
    color: #1a1a1a;
    flex-shrink: 0;
  }

  &__coupon-section {
    margin-bottom: 1.5rem;
  }

  &__totals {
    border-bottom: 1px solid #eee;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
  }

  &__total-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;

    &--strikethrough {
      text-decoration: line-through;
      color: #999;
    }

    &--discount {
      color: #27ae60;
    }

    &--highlighted {
      font-weight: 600;
      color: #1a1a1a;
    }

    &--info {
      color: #666;
      font-size: 0.85rem;
    }

    &--final {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 2px solid #eee;
    }
  }

  &__discount-amount {
    color: #27ae60;
  }

  &__new-price {
    color: #1a1a1a;
  }

  &__info-price {
    color: #666;
  }

  &__submit-btn {
    width: 100%;
    padding: 1rem;
    background: #b9c6aa;
    color: #2f3a2a;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-sizing: border-box;

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
    margin-top: 1rem;
    padding: 1rem;
    background: #fee;
    color: #c33;
    border-radius: 8px;
    font-size: 0.9rem;
  }
}
</style>

