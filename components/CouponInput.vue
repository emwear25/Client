<template>
  <div class="coupon-input">
    <div class="input-wrapper">
      <input
        v-model="couponCode"
        type="text"
        placeholder="Въведете код за отстъпка"
        :disabled="loading || hasCoupon"
        @keyup.enter="handleApply"
        class="coupon-field"
      />
      <button
        v-if="!hasCoupon"
        @click="handleApply"
        :disabled="loading || !couponCode.trim()"
        class="apply-btn"
      >
        {{ loading ? 'Проверка...' : 'Приложи' }}
      </button>
      <button
        v-else
        @click="handleRemove"
        class="remove-btn"
      >
        ✕ Премахни
      </button>
    </div>

    <!-- Success message -->
    <div v-if="successMessage" class="message success">
      ✓ {{ successMessage }}
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="message error">
      {{ errorMessage }}
    </div>

    <!-- Applied discount info -->
    <div v-if="hasCoupon && appliedDiscount" class="discount-info">
      <div class="discount-badge">
        <span class="discount-name">{{ appliedDiscount.name }}</span>
        <span class="discount-value">
          -{{ formatDiscountValue(appliedDiscount) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

const couponCode = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const hasCoupon = computed(() => cartStore.hasCoupon)
const appliedDiscount = computed(() => {
  return cartStore.appliedDiscounts && cartStore.appliedDiscounts.length > 0
    ? cartStore.appliedDiscounts[0]
    : null
})

const handleApply = async () => {
  if (!couponCode.value.trim()) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await cartStore.applyCoupon(couponCode.value)
    successMessage.value = 'Кодът за отстъпка е приложен успешно!'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error: any) {
    errorMessage.value = error.message || 'Невалиден код за отстъпка'
    
    // Clear error message after 5 seconds
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    loading.value = false
  }
}

const handleRemove = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await cartStore.removeCoupon()
    couponCode.value = ''
    successMessage.value = 'Кодът за отстъпка е премахнат'
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error: any) {
    errorMessage.value = 'Грешка при премахване на кода'
  } finally {
    loading.value = false
  }
}

const formatDiscountValue = (discount: any) => {
  if (discount.type === 'percentage') {
    return `${discount.value}%`
  } else if (discount.type === 'fixed_amount') {
    return `${discount.value.toFixed(2)} лв.`
  }
  return discount.amount.toFixed(2) + ' лв.'
}
</script>

<style scoped>
.coupon-input {
  width: 100%;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.coupon-field {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.coupon-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.coupon-field:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.apply-btn,
.remove-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.apply-btn {
  background-color: #3b82f6;
  color: white;
}

.apply-btn:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.apply-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.remove-btn {
  background-color: #ef4444;
  color: white;
}

.remove-btn:hover {
  background-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.message {
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 8px;
  animation: slideIn 0.3s ease;
}

.message.success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.message.error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.discount-info {
  margin-top: 12px;
}

.discount-badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.discount-name {
  font-weight: 600;
  font-size: 14px;
}

.discount-value {
  font-weight: 700;
  font-size: 16px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
