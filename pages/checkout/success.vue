<template>
  <div class="success-page">
    <div class="success-container">
      <!-- Success Icon -->
      <div class="success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>

      <!-- Success Message -->
      <h1 class="success-title">Плащането е успешно!</h1>
      <p class="success-message">
        Благодарим ви за поръчката! Вашето плащане беше обработено успешно.
      </p>

      <!-- Order Details (if available) -->
      <div v-if="orderNumber" class="order-details">
        <p class="order-number">
          Номер на поръчка: <strong>{{ orderNumber }}</strong>
        </p>
        <p class="order-info">Ще получите имейл с потвърждение и детайли за доставката.</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading">
        <p>Зареждане на детайли за поръчката...</p>
      </div>

      <!-- Actions -->
      <div class="success-actions">
        <NuxtLink to="/products" class="btn btn--primary"> Продължи пазаруването </NuxtLink>
        <NuxtLink v-if="!isGuest" to="/profile" class="btn btn--secondary">
          Виж моите поръчки
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useCartStore } from "~/stores/cart";
import { useApi } from "~/composables/useApi";

const route = useRoute();
const authStore = useAuthStore();
const cartStore = useCartStore();

const sessionId = ref<string | null>(null);
const orderNumber = ref<string | null>(null);
const loading = ref(false);
const isGuest = computed(() => !authStore.isAuthenticated);

onMounted(async () => {
  // Get session ID from query params
  sessionId.value = route.query.session_id as string;

  // Clear cart (payment successful)
  cartStore.clearCart();

  // Optionally fetch session details from backend
  if (sessionId.value) {
    loading.value = true;
    try {
      const api = useApi();
      const response: any = await api.get(`payments/checkout-session/${sessionId.value}`);
      if (response.success && response.data.order) {
        orderNumber.value = response.data.order.orderNumber;
      }
    } catch (error) {
      console.error("[Success] Failed to fetch session details:", error);
      // Don't show error to user, just skip order number display
    } finally {
      loading.value = false;
    }
  }
});
</script>

<style scoped lang="scss">
.success-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.success-container {
  max-width: 600px;
  width: 100%;
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  color: #10b981;

  svg {
    width: 100%;
    height: 100%;
  }
}

.success-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.success-message {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.order-details {
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.order-number {
  font-size: 1.125rem;
  color: #374151;
  margin-bottom: 0.5rem;

  strong {
    color: #b9c6aa;
    font-weight: 600;
  }
}

.order-info {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.loading {
  padding: 2rem;
  color: #6b7280;
}

.success-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  display: inline-block;

  &--primary {
    background: #b9c6aa;
    color: white;

    &:hover {
      background: #a8b599;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(185, 198, 170, 0.3);
    }
  }

  &--secondary {
    background: white;
    color: #b9c6aa;
    border: 2px solid #b9c6aa;

    &:hover {
      background: #f9fafb;
      transform: translateY(-2px);
    }
  }
}

@media (max-width: 640px) {
  .success-container {
    padding: 2rem 1.5rem;
  }

  .success-title {
    font-size: 1.5rem;
  }

  .success-actions {
    flex-direction: column;

    .btn {
      width: 100%;
    }
  }
}
</style>
