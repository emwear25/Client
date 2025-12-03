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
        <div class="checkout-payment-method__icon">💵</div>
        <div class="checkout-payment-method__info">
          <h3 class="checkout-payment-method__option-title">Наложен платеж</h3>
          <p class="checkout-payment-method__option-desc">Плащате при доставка</p>
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
        <div class="checkout-payment-method__icon">💳</div>
        <div class="checkout-payment-method__info">
          <h3 class="checkout-payment-method__option-title">Карта / Apple Pay</h3>
          <p class="checkout-payment-method__option-desc">Сигурно плащане с Stripe</p>
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
  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #1a1a1a;
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &--selected {
      border-color: #3498db;
      background: #f0f8ff;
    }
  }

  &__radio {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  &__icon {
    font-size: 2rem;
  }

  &__info {
    flex: 1;
  }

  &__option-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  &__option-desc {
    font-size: 0.85rem;
    color: #666;
  }
}
</style>

