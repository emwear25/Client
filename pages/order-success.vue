<template>
  <div class="order-success">
    <div class="order-success__container">
      <div class="order-success__card">
        <!-- Success Icon -->
        <div class="order-success__icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#27ae60" />
            <path
              d="M8 12L11 15L16 9"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <!-- Success Message -->
        <h1 class="order-success__title">Поръчката е приета успешно!</h1>
        <p class="order-success__message">
          Благодарим Ви за поръчката. Ще получите потвърждение на имейл адреса, който сте посочили.
        </p>

        <!-- Order Details -->
        <div v-if="order" class="order-success__details">
          <div class="order-success__detail-row">
            <span class="order-success__detail-label">Номер на поръчка:</span>
            <span class="order-success__detail-value">{{ order.orderNumber }}</span>
          </div>

          <!-- For Stripe payments, show breakdown -->
          <template v-if="order.paymentMethod === 'stripe_card'">
            <div
              v-if="order.subtotalBeforeDiscount && order.subtotalBeforeDiscount !== order.subtotal"
              class="order-success__detail-row"
            >
              <span class="order-success__detail-label">Стойност на продуктите:</span>
              <span class="order-success__detail-value"
                >{{ (order.subtotalBeforeDiscount || 0).toFixed(2) }} лв</span
              >
            </div>
            <div
              v-if="order.discountTotal && order.discountTotal > 0"
              class="order-success__detail-row"
            >
              <span class="order-success__detail-label"
                >Отстъпка{{ order.couponCode ? ` (${order.couponCode})` : "" }}:</span
              >
              <span class="order-success__detail-value" style="color: #e74c3c"
                >-{{ (order.discountTotal || 0).toFixed(2) }} лв</span
              >
            </div>
            <div class="order-success__detail-row">
              <span class="order-success__detail-label">Стойност на продуктите:</span>
              <span class="order-success__detail-value order-success__paid-amount"
                >{{ (order.subtotal || 0).toFixed(2) }} лв</span
              >
            </div>
            <div class="order-success__detail-row">
              <span class="order-success__detail-label">Доставка (при получаване):</span>
              <span class="order-success__detail-value"
                >{{ (order.shippingCost || 0).toFixed(2) }} лв</span
              >
            </div>
            <div class="order-success__detail-row order-success__total-row">
              <span class="order-success__detail-label">Обща стойност (вкл. ДДС):</span>
              <span class="order-success__detail-value">{{ order.total?.toFixed(2) }} лв</span>
            </div>
          </template>

          <!-- For COD, show breakdown -->
          <template v-else>
            <div
              v-if="order.subtotalBeforeDiscount && order.subtotalBeforeDiscount !== order.subtotal"
              class="order-success__detail-row"
            >
              <span class="order-success__detail-label">Стойност на продуктите:</span>
              <span class="order-success__detail-value"
                >{{ (order.subtotalBeforeDiscount || 0).toFixed(2) }} лв</span
              >
            </div>
            <div
              v-if="order.discountTotal && order.discountTotal > 0"
              class="order-success__detail-row"
            >
              <span class="order-success__detail-label"
                >Отстъпка{{ order.couponCode ? ` (${order.couponCode})` : "" }}:</span
              >
              <span class="order-success__detail-value" style="color: #e74c3c"
                >-{{ (order.discountTotal || 0).toFixed(2) }} лв</span
              >
            </div>
            <div class="order-success__detail-row">
              <span class="order-success__detail-label">Стойност на продуктите:</span>
              <span class="order-success__detail-value"
                >{{ (order.subtotal || 0).toFixed(2) }} лв</span
              >
            </div>
            <div class="order-success__detail-row">
              <span class="order-success__detail-label">Доставка (при получаване):</span>
              <span class="order-success__detail-value"
                >{{ (order.shippingCost || 0).toFixed(2) }} лв</span
              >
            </div>
            <div class="order-success__detail-row order-success__total-row">
              <span class="order-success__detail-label">Обща сума (вкл. ДДС):</span>
              <span class="order-success__detail-value">{{ order.total?.toFixed(2) }} лв</span>
            </div>
          </template>

          <div class="order-success__detail-row">
            <span class="order-success__detail-label">Метод на плащане:</span>
            <span class="order-success__detail-value">
              {{ order.paymentMethod === "stripe_card" ? "Карта (Stripe)" : "Наложен платеж" }}
            </span>
          </div>
          <div class="order-success__detail-row">
            <span class="order-success__detail-label">Статус:</span>
            <span class="order-success__detail-value order-success__status">
              {{ getStatusLabel(order.orderStatus) }}
            </span>
          </div>
        </div>

        <!-- Guest Account Creation (only for guest orders) -->
        <div v-if="isGuestOrder && !accountCreated" class="order-success__account-creation">
          <h2 class="order-success__account-title">📧 Създайте акаунт за по-лесно проследяване</h2>
          <p class="order-success__account-desc">
            Създайте акаунт, за да проследявате поръчката си и да пазарувате по-бързо следващия път.
          </p>

          <form class="account-form" @submit.prevent="handleCreateAccount">
            <div class="form-group">
              <label class="form-label">Имейл</label>
              <input
                v-model="accountForm.email"
                type="email"
                class="form-input"
                readonly
                disabled
              >
            </div>

            <div class="form-group">
              <label class="form-label">Парола <span class="required">*</span></label>
              <input
                v-model="accountForm.password"
                type="password"
                class="form-input"
                placeholder="Минимум 6 символа"
                required
                minlength="6"
              >
            </div>

            <div class="form-group">
              <label class="form-label">Потвърди парола <span class="required">*</span></label>
              <input
                v-model="accountForm.confirmPassword"
                type="password"
                class="form-input"
                placeholder="Повторете паролата"
                required
              >
            </div>

            <div v-if="accountError" class="account-error">
              {{ accountError }}
            </div>

            <button type="submit" class="account-submit-btn" :disabled="isCreatingAccount">
              <span v-if="!isCreatingAccount">✨ Създай акаунт</span>
              <span v-else>Създаване...</span>
            </button>

            <div class="account-benefits">
              <p class="benefits-title">Предимства:</p>
              <ul>
                <li>✓ Проследявайте всички поръчки</li>
                <li>✓ По-бърза поръчка следващия път</li>
                <li>✓ Запазете множество адреси</li>
              </ul>
            </div>
          </form>
        </div>

        <!-- Success message after account creation -->
        <div v-if="accountCreated" class="order-success__account-success">
          <div class="success-icon">✅</div>
          <h3>Акаунтът е създаден успешно!</h3>
          <p>Вече можете да влезете и да проследявате поръчките си.</p>
        </div>

        <!-- Next Steps -->
        <div class="order-success__next-steps">
          <h2 class="order-success__next-title">Следващи стъпки:</h2>
          <ul class="order-success__steps-list">
            <li>Ще получите имейл с потвърждение на поръчката</li>
            <li>Нашият екип ще обработи поръчката Ви в рамките на 8 часа</li>
            <li>Ще Ви уведомим, когато поръчката бъде изпратена</li>
            <li>Очаквайте доставка до 3 работни дни</li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="order-success__actions">
          <NuxtLink
            v-if="!isGuestOrder"
            to="/orders"
            class="order-success__btn order-success__btn--primary"
          >
            Виж моите поръчки
          </NuxtLink>
          <NuxtLink to="/products" class="order-success__btn order-success__btn--secondary">
            Продължи пазаруването
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useToast } from "~/composables/useToast";
import { useApi } from "~/composables/useApi";

// No auth middleware - support both guest and authenticated users

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const api = useApi();

const order = ref<any>(null);
const loading = ref(true);
const error = ref("");

// Guest account creation
const isGuestOrder = computed(() => order.value && !order.value.user && order.value.guestEmail);
const accountCreated = ref(false);
const isCreatingAccount = ref(false);
const accountError = ref("");
const accountForm = ref({
  email: "",
  password: "",
  confirmPassword: "",
});

// Fetch order details
onMounted(async () => {
  const token = route.query.token as string;
  const orderId = route.query.orderId as string;
  const isStripePayment = route.query.stripe === "true";

  // Token-based access is preferred (secure, time-limited)
  if (token) {
    try {
      console.log("[OrderSuccess] Fetching order by secure token");

      // Clear cart
      const { useCartStore } = await import("~/stores/cart");
      const cartStore = useCartStore();
      cartStore.clearCart();

      // Fetch order using secure token endpoint
      const response = await api.get(`orders/success/${token}`);

      if (response.success) {
        order.value = response.data;
        // Pre-fill email for guest orders
        if (order.value.guestEmail) {
          accountForm.value.email = order.value.guestEmail;
        }
      } else {
        error.value = response.message || "Не успяхме да заредим детайлите на поръчката";
      }
    } catch (err: any) {
      console.error("Failed to fetch order by token:", err);
      error.value =
        err.data?.message ||
        "Връзката е изтекла или е невалидна. Моля, използвайте проследяване на поръчка, за да видите детайлите.";
    } finally {
      loading.value = false;
    }
    return;
  }

  // Fallback to legacy orderId-based access (backward compatibility)
  if (!orderId) {
    error.value = "Невалиден номер на поръчка. Моля, използвайте линка от имейла за потвърждение.";
    loading.value = false;
    return;
  }

  try {
    // For Stripe payments, orderId is actually the session_id
    // We need to fetch the order using the session endpoint
    if (isStripePayment) {
      console.log("[OrderSuccess] Stripe payment detected, fetching session:", orderId);

      // Clear cart for Stripe payments
      const { useCartStore } = await import("~/stores/cart");
      const cartStore = useCartStore();
      cartStore.clearCart();

      // Fetch order via Stripe session
      const sessionResponse = await api.get(`payments/checkout-session/${orderId}`);

      if (sessionResponse.success && sessionResponse.data.order) {
        order.value = sessionResponse.data.order;
        // Pre-fill email for guest orders
        if (order.value.guestEmail) {
          accountForm.value.email = order.value.guestEmail;
        }

        // If token exists, redirect to token-based URL for better security
        if (order.value.successToken) {
          router.replace(`/order-success?token=${order.value.successToken}`);
          return;
        }
      }
    } else {
      // Regular COD order - fetch by orderId (legacy method)
      console.log("[OrderSuccess] COD payment, fetching order (legacy method):", orderId);

      const headers: any = {};
      if (authStore.accessToken) {
        headers.Authorization = `Bearer ${authStore.accessToken}`;
      }

      const response = await api.get(`orders/${orderId}`, {
        headers,
      });

      if (response.success) {
        order.value = response.data;
        // Pre-fill email for guest orders
        if (order.value.guestEmail) {
          accountForm.value.email = order.value.guestEmail;
        }

        // If token exists, redirect to token-based URL for better security
        if (order.value.successToken) {
          router.replace(`/order-success?token=${order.value.successToken}`);
          return;
        }
      }
    }
  } catch (err: any) {
    console.error("Failed to fetch order:", err);
    error.value = "Не успяхме да заредим детайлите на поръчката";
  } finally {
    loading.value = false;
  }
});

// Handle account creation for guest orders
const handleCreateAccount = async () => {
  accountError.value = "";

  // Validate passwords match
  if (accountForm.value.password !== accountForm.value.confirmPassword) {
    accountError.value = "Паролите не съвпадат";
    return;
  }

  if (accountForm.value.password.length < 6) {
    accountError.value = "Паролата трябва да бъде поне 6 символа";
    return;
  }

  isCreatingAccount.value = true;

  try {
    const response = await api.post("auth/register", {
      email: accountForm.value.email,
      password: accountForm.value.password,
      firstName: order.value.guestInfo?.firstName || "",
      lastName: order.value.guestInfo?.lastName || "",
      phone: order.value.guestInfo?.phone || "",
    });

    if (response.success) {
      accountCreated.value = true;
      toast.success("Акаунтът е създаден успешно! Моля, влезте.");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  } catch (err: any) {
    console.error("Account creation error:", err);
    accountError.value =
      err.data?.message ||
      "Грешка при създаване на акаунт. Възможно е имейлът вече да е регистриран.";
  } finally {
    isCreatingAccount.value = false;
  }
};

// Get status label in Bulgarian
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "Изчакваща",
    confirmed: "Потвърдена",
    processing: "В обработка",
    shipped: "Изпратена",
    delivered: "Доставена",
    cancelled: "Отказана",
  };
  return labels[status] || status;
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/_colors.scss";

.order-success {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, $color-linen 0%, $color-sage 50%, $color-forest 100%);
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;

  &__container {
    width: 100%;
    max-width: 600px;
  }

  &__card {
    background: $color-white;
    border-radius: 20px;
    padding: 3rem 2rem;
    box-shadow: 0 20px 60px rgba(47, 58, 42, 0.15);
    text-align: center;
    border: 1px solid $color-pebble;
  }

  &__icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 2rem;
    animation: scaleIn 0.5s ease-out;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    color: $color-forest;
    margin-bottom: 1rem;
  }

  &__message {
    font-size: 1.1rem;
    color: $color-slate;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  &__details {
    background: $color-linen;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    text-align: left;
    border: 1px solid $color-pebble;
  }

  &__detail-row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid $color-pebble;

    &:last-child {
      border-bottom: none;
    }
  }

  &__detail-label {
    font-weight: 500;
    color: $color-slate;
  }

  &__detail-value {
    font-weight: 600;
    color: $color-forest;
  }

  &__status {
    color: $color-success;
  }

  &__paid-amount {
    color: #27ae60;
    font-weight: 700;
  }

  &__total-row {
    border-top: 2px solid $color-sage;
    padding-top: 0.75rem;
    margin-top: 0.5rem;
    font-weight: 600;
  }

  &__next-steps {
    text-align: left;
    margin-bottom: 2rem;
  }

  &__next-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: $color-forest;
  }

  &__steps-list {
    list-style: none;
    padding: 0;

    li {
      padding: 0.5rem 0 0.5rem 2rem;
      position: relative;
      color: $color-slate;
      line-height: 1.6;

      &::before {
        content: "✓";
        position: absolute;
        left: 0;
        color: $color-success;
        font-weight: bold;
      }
    }
  }

  &__actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  &__btn {
    padding: 1rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    flex: 1;
    min-width: 200px;
    text-align: center;

    &--primary {
      background: $color-sage;
      color: $color-forest;

      &:hover {
        background: $color-sage-deep;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(185, 198, 170, 0.4);
      }
    }

    &--secondary {
      background: $color-white;
      color: $color-forest;
      border: 2px solid $color-sage;

      &:hover {
        background: $color-sage;
        color: $color-forest;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(185, 198, 170, 0.4);
      }
    }
  }
}

// Guest Account Creation Styles
.order-success__account-creation {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 2px solid $color-sage;
}

.order-success__account-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: $color-forest;
  margin-bottom: 0.5rem;
  text-align: center;
}

.order-success__account-desc {
  text-align: center;
  color: $color-slate;
  margin-bottom: 1.5rem;
}

.account-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 500;
  color: $color-forest;
  margin-bottom: 0.5rem;
  font-size: 0.9375rem;
}

.required {
  color: #e74c3c;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: $color-sage;
    box-shadow: 0 0 0 3px rgba(185, 198, 170, 0.1);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
}

.account-error {
  padding: 0.75rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
}

.account-submit-btn {
  width: 100%;
  padding: 1rem;
  background: $color-sage;
  color: $color-forest;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;

  &:hover:not(:disabled) {
    background: $color-sage-deep;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(185, 198, 170, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.account-benefits {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid $color-pebble;
}

.benefits-title {
  font-weight: 600;
  color: $color-forest;
  margin-bottom: 0.5rem;
  font-size: 0.9375rem;
}

.account-benefits ul {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 0.25rem 0;
    color: $color-slate;
    font-size: 0.875rem;
  }
}

.order-success__account-success {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  border: 2px solid #28a745;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.order-success__account-success h3 {
  color: #155724;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.order-success__account-success p {
  color: #155724;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
