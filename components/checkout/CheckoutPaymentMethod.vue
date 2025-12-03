<template>
  <div class="checkout-payment-method">
    <h2 class="checkout-payment-method__title">Метод на плащане</h2>

    <div class="checkout-payment-method__options">
      <!-- Cash on Delivery Option -->
      <label
        class="checkout-payment-method__option"
        :class="{
          'checkout-payment-method__option--selected': modelValue === 'cod',
        }"
      >
        <input
          :value="'cod'"
          type="radio"
          name="paymentMethod"
          class="checkout-payment-method__radio"
          @change="$emit('update:modelValue', 'cod')"
        />
        <div class="checkout-payment-method__content">
          <div class="checkout-payment-method__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <div class="checkout-payment-method__info">
            <h3 class="checkout-payment-method__option-title">Наложен платеж</h3>
            <p class="checkout-payment-method__option-desc">Плащане в брой при доставка</p>
          </div>
        </div>
      </label>

      <!-- Stripe Card Payment Option -->
      <label
        class="checkout-payment-method__option"
        :class="{
          'checkout-payment-method__option--selected': modelValue === 'stripe_card',
        }"
      >
        <input
          :value="'stripe_card'"
          type="radio"
          name="paymentMethod"
          class="checkout-payment-method__radio"
          @change="$emit('update:modelValue', 'stripe_card')"
        />
        <div class="checkout-payment-method__content">
          <div class="checkout-payment-method__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <div class="checkout-payment-method__info">
            <h3 class="checkout-payment-method__option-title">Карта / Apple Pay</h3>
            <p class="checkout-payment-method__option-desc">Онлайн плащане със Stripe</p>
          </div>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: "cod" | "stripe_card";
}>();

defineEmits<{
  "update:modelValue": [value: "cod" | "stripe_card"];
}>();
</script>

<style scoped lang="scss">
.checkout-payment-method {
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.25rem;

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

  &__options {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  &__option {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    padding: 0.625rem;
    border: 1.5px solid #e5e7eb;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    background: #fafafa;

    &:hover {
      border-color: #b9c6aa;
      background: white;
    }

    &--selected {
      border-color: #b9c6aa;
      background: rgba(185, 198, 170, 0.08);
      box-shadow: 0 0 0 1px rgba(185, 198, 170, 0.2);
    }
  }

  &__radio {
    width: 16px;
    height: 16px;
    margin-top: 2px;
    cursor: pointer;
    flex-shrink: 0;
    accent-color: #b9c6aa;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    flex: 1;
  }

  &__icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: #6b7280;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__option-title {
    font-weight: 600;
    margin: 0 0 0.125rem 0;
    font-size: 0.875rem;
    color: #1a1a1a;
  }

  &__option-desc {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
  }
}
</style>
