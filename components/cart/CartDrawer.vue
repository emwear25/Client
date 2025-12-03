<template>
  <Teleport to="body">
    <div v-if="isOpen" class="cart-drawer">
      <!-- Backdrop -->
      <div class="cart-drawer__backdrop" @click="closeCart"/>

      <!-- Panel (RIGHT slide-in) -->
      <aside
        class="cart-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <!-- Close Button -->
        <button class="cart-drawer__close" aria-label="Затвори" @click="closeCart">×</button>

        <!-- Header -->
        <div class="cart-drawer__header">
          <h2 id="cart-title" class="cart-drawer__title">Количка</h2>
          <p class="cart-drawer__count">
            {{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? "продукт" : "продукта" }}
          </p>
        </div>

        <!-- Body -->
        <div class="cart-drawer__body">
          <!-- Empty State -->
          <div v-if="cartStore.isEmpty" class="cart-drawer__empty">
            <svg
              class="cart-drawer__empty-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <h3 class="cart-drawer__empty-title">Количката е празна</h3>
            <p class="cart-drawer__empty-text">Добавете продукти, за да продължите</p>
            <NuxtLink to="/products" class="btn btn--primary" @click="closeCart">
              Разгледай Продукти
            </NuxtLink>
          </div>

          <!-- Cart Items -->
          <div v-else class="cart-drawer__items">
            <div
              v-for="item in cartStore.items"
              :key="`${item.id}-${item.size}-${item.color}`"
              class="cart-item"
            >
              <img
                :src="item.image || '/img/placeholder.png'"
                :alt="item.name"
                class="cart-item__img"
              >
              <div class="cart-item__details">
                <h4 class="cart-item__name">{{ item.name }}</h4>
                <div class="cart-item__meta">
                  <span v-if="item.size" class="cart-item__attr">Размер: {{ item.size }}</span>
                  <span v-if="item.color" class="cart-item__attr">Цвят: {{ item.color }}</span>
                </div>
                <div class="cart-item__footer">
                  <div class="cart-item__quantity">
                    <button
                      class="cart-item__qty-btn"
                      :disabled="item.quantity <= 1"
                      @click="
                        cartStore.updateQuantity(item.id, item.quantity - 1, item.size, item.color)
                      "
                    >
                      −
                    </button>
                    <span class="cart-item__qty">{{ item.quantity }}</span>
                    <button
                      class="cart-item__qty-btn"
                      @click="
                        cartStore.updateQuantity(item.id, item.quantity + 1, item.size, item.color)
                      "
                    >
                      +
                    </button>
                  </div>
                  <span class="cart-item__price">{{
                    formatPrice(item.price * item.quantity)
                  }}</span>
                </div>
              </div>
              <button
                class="cart-item__remove"
                aria-label="Премахни"
                @click="cartStore.removeItem(item.id, item.size, item.color)"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="!cartStore.isEmpty" class="cart-drawer__footer">
          <div class="cart-drawer__total">
            <span class="cart-drawer__total-label">Общо:</span>
            <span class="cart-drawer__total-price">{{ formatPrice(cartStore.totalPrice) }}</span>
          </div>
          <button class="btn btn--primary cart-drawer__cta" @click="goToCheckout">
            Към плащане
          </button>
          <p class="cart-drawer__shipping">Безплатна доставка над 50 лв</p>
        </div>
      </aside>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";
import { useToast } from "~/composables/useToast";

const cartStore = useCartStore();
const router = useRouter();
const toast = useToast();

const isOpen = computed(() => cartStore.isOpen);

const closeCart = () => {
  cartStore.closeCart();
};

const formatPrice = (price: number) => {
  return `${price.toFixed(2)} лв.`;
};

// Navigate to checkout
const goToCheckout = () => {
  // Close cart drawer first
  closeCart();

  // Check if cart is empty
  if (cartStore.isEmpty) {
    toast.error("Количката е празна. Добавете продукти преди да продължите.");
    return;
  }

  // Navigate to checkout (no auth required - supports guest checkout)
  router.push("/checkout");
};
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

// ═══════════════════════════════════════════════════
// CART DRAWER - RIGHT slide-in
// ═══════════════════════════════════════════════════

.cart-drawer {
  position: fixed;
  inset: 0;
  z-index: 200;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(2px);
  }

  &__panel {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: min(420px, 92vw);
    background: $bg-card;
    color: $text-primary;
    box-shadow: -8px 0 30px rgba(0, 0, 0, 0.18);
    transform: translateX(100%);
    animation: slide-in 0.35s ease forwards;
    display: grid;
    grid-template-rows: auto 1fr auto;
    overflow: hidden;
  }

  @keyframes slide-in {
    to {
      transform: translateX(0);
    }
  }

  &__close {
    position: absolute;
    top: 8px;
    left: 12px;
    width: 36px;
    height: 36px;
    border-radius: 999px;
    border: 1px solid $border-base;
    background: $color-white;
    cursor: pointer;
    color: $brand-ink;
    font-size: 1.75rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    z-index: 10;
    box-shadow: 0 2px 8px $shadow-soft;

    &:hover {
      background: $brand;
      color: $color-white;
      transform: scale(1.1);
    }
  }

  &__header {
    padding: 18px;
    border-bottom: 1px solid $border-base;
    background: $bg-page;
  }

  &__title {
    font-family: $font-heading;
    color: $brand-ink;
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0 0 0.25rem;
  }

  &__count {
    font-size: 0.9375rem;
    color: $text-secondary;
    margin: 0;
  }

  &__body {
    overflow: auto;
    padding: 18px;
  }

  // Empty State
  &__empty {
    text-align: center;
    padding: 3rem 1rem;
  }

  &__empty-icon {
    width: 4rem;
    height: 4rem;
    color: $text-secondary;
    margin: 0 auto 1.5rem;
  }

  &__empty-title {
    font-family: $font-heading;
    font-size: 1.25rem;
    color: $brand-ink;
    margin: 0 0 0.5rem;
  }

  &__empty-text {
    font-size: 0.9375rem;
    color: $text-secondary;
    margin: 0 0 1.5rem;
  }

  // Cart Items
  &__items {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  // Footer
  &__footer {
    padding: 18px;
    border-top: 1px solid $border-base;
    background: $bg-page;
  }

  &__total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  &__total-label {
    font-size: 1.125rem;
    font-weight: 600;
    color: $brand-ink;
  }

  &__total-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: $brand-ink;
  }

  &__cta {
    width: 100%;
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }

  &__shipping {
    text-align: center;
    font-size: 0.8125rem;
    color: $text-secondary;
    margin: 0.75rem 0 0;
  }
}

// ═══════════════════════════════════════════════════
// CART ITEM
// ═══════════════════════════════════════════════════

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 12px;
  padding: 12px;
  background: $bg-page;
  border: 1px solid $border-base;
  border-radius: 8px;
  position: relative;

  &__img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  &__name {
    font-family: $font-body;
    font-size: 0.9375rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__attr {
    font-size: 0.8125rem;
    color: $text-secondary;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
  }

  &__quantity {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid $border-base;
    border-radius: 4px;
    padding: 2px;
  }

  &__qty-btn {
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    color: $brand-ink;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: $brand;
      color: $color-white;
      border-radius: 2px;
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  &__qty {
    font-size: 0.9375rem;
    font-weight: 600;
    color: $brand-ink;
    min-width: 20px;
    text-align: center;
  }

  &__price {
    font-size: 0.9375rem;
    font-weight: 600;
    color: $brand-ink;
  }

  &__remove {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    border-radius: 999px;
    border: 1px solid $border-base;
    background: $color-white;
    color: $brand-ink;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
      background: $error;
      border-color: $error;
      color: $color-white;
    }
  }
}
</style>
