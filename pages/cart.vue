<template>
  <div class="cart-page">
    <!-- Page Header -->
    <header class="cart-page__header">
      <div class="cart-page__container">
        <h1 class="cart-page__title">Количка</h1>
        <p v-if="!cartStore.isEmpty" class="cart-page__subtitle">
          {{ cartStore.itemCount }}
          {{ cartStore.itemCount === 1 ? "продукт" : "продукта" }}
        </p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="cart-page__content">
      <div class="cart-page__container">
        <!-- Empty Cart State -->
        <div v-if="cartStore.isEmpty" class="empty-cart">
          <div class="empty-cart__icon">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="60" cy="60" r="58" stroke="currentColor" stroke-width="2" opacity="0.2" />
              <path
                d="M40 45L45 30H75L80 45M40 45H80M40 45L45 85H75L80 45"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="50" cy="92" r="3" fill="currentColor" />
              <circle cx="70" cy="92" r="3" fill="currentColor" />
            </svg>
          </div>
          <h2 class="empty-cart__title">Вашата количка е празна</h2>
          <p class="empty-cart__message">Добавете продукти, за да започнете пазаруването</p>
          <NuxtLink to="/products" class="btn btn--primary btn--large empty-cart__cta">
            Разгледай Продукти
          </NuxtLink>
        </div>

        <!-- Cart with Items -->
        <div v-else class="cart-page__grid">
          <!-- Cart Items Section -->
          <section class="cart-page__items">
            <TransitionGroup name="cart-item" tag="div" class="cart-items-list">
              <article
                v-for="item in cartStore.items"
                :key="`${item.id}-${item.size}-${item.color}`"
                class="cart-item"
              >
                <!-- Product Image -->
                <div class="cart-item__image">
                  <NuxtImg
                    :src="item.image || '/placeholder-product.jpg'"
                    :alt="item.name"
                    format="webp"
                    quality="75"
                    width="100"
                    height="100"
                    loading="lazy"
                    placeholder
                  />
                </div>

                <!-- Product Details -->
                <div class="cart-item__details">
                  <h3 class="cart-item__name">{{ item.name }}</h3>

                  <div class="cart-item__meta">
                    <span v-if="item.size" class="cart-item__meta-item">
                      <strong>Размер:</strong> {{ item.size }}
                    </span>
                    <span v-if="item.color" class="cart-item__meta-item">
                      <strong>Цвят:</strong> {{ item.color }}
                    </span>
                    <span v-if="item.embroidery?.name" class="cart-item__meta-item">
                      <strong>Бродерия:</strong> {{ item.embroidery.name }}
                    </span>
                  </div>

                  <div class="cart-item__price">{{ formatPrice(item.price) }} лв.</div>
                </div>

                <!-- Quantity Controls -->
                <div class="cart-item__quantity">
                  <label class="cart-item__quantity-label">Количество</label>
                  <div class="cart-item__quantity-controls">
                    <button
                      class="cart-item__quantity-btn"
                      :aria-label="`Намали количеството на ${item.name}`"
                      @click="decrementQuantity(item)"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M3 8H13"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                      </svg>
                    </button>
                    <input
                      type="number"
                      class="cart-item__quantity-input"
                      :value="item.quantity"
                      min="1"
                      :aria-label="`Количество за ${item.name}`"
                      @change="updateQuantityInput($event, item)"
                    >
                    <button
                      class="cart-item__quantity-btn"
                      :aria-label="`Увеличи количеството на ${item.name}`"
                      @click="incrementQuantity(item)"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M8 3V13M3 8H13"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Subtotal -->
                <div class="cart-item__subtotal">
                  <span class="cart-item__subtotal-label">Сума</span>
                  <span class="cart-item__subtotal-value">
                    {{ formatPrice(item.price * item.quantity) }} лв.
                  </span>
                </div>

                <!-- Remove Button -->
                <button
                  class="cart-item__remove"
                  :aria-label="`Премахни ${item.name} от количката`"
                  @click="removeItem(item)"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 5L15 15M5 15L15 5"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              </article>
            </TransitionGroup>
          </section>

          <!-- Order Summary Section -->
          <aside class="order-summary">
            <div class="order-summary__sticky">
              <h2 class="order-summary__title">Обобщение</h2>

              <div class="order-summary__content">
                <div class="order-summary__row">
                  <span class="order-summary__label">Междинна сума</span>
                  <span class="order-summary__value"
                    >{{ formatPrice(cartStore.totalPrice) }} лв.</span
                  >
                </div>

                <div class="order-summary__divider"/>

                <div class="order-summary__row order-summary__total">
                  <span class="order-summary__label">Общо</span>
                  <span class="order-summary__value"
                    >{{ formatPrice(cartStore.totalPrice) }} лв.</span
                  >
                </div>

                <button
                  class="btn btn--primary btn--large order-summary__cta"
                  :disabled="cartStore.isEmpty"
                  @click="goToCheckout"
                >
                  Към Плащане
                </button>

                <NuxtLink to="/products" class="order-summary__continue">
                  ← Продължи пазаруването
                </NuxtLink>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";
import { useToast } from "~/composables/useToast";

const cartStore = useCartStore();
const router = useRouter();
const toast = useToast();

// Debug: Log cart items on mount
onMounted(() => {
  console.log("Cart page mounted. Items:", cartStore.items);
  console.log("Is empty:", cartStore.isEmpty);
  console.log("Item count:", cartStore.itemCount);
});

// Navigate to checkout
const goToCheckout = () => {
  // Check if cart is empty
  if (cartStore.isEmpty) {
    toast.error("Количката е празна. Добавете продукти преди да продължите.");
    return;
  }

  // Navigate to checkout (no auth required - supports guest checkout)
  router.push("/checkout");
};

// Shipping calculation (free shipping over 110 BGN)
const shippingCost = computed(() => {
  return cartStore.totalPrice >= 110 ? 0 : 5.99;
});

const _totalWithShipping = computed(() => {
  return cartStore.totalPrice + shippingCost.value;
});

// Format price to 2 decimal places
const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

// Quantity controls
const incrementQuantity = (item: any) => {
  cartStore.updateQuantity(item.id, item.quantity + 1, item.size, item.color);
};

const decrementQuantity = (item: any) => {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.id, item.quantity - 1, item.size, item.color);
  }
};

const updateQuantityInput = (event: Event, item: any) => {
  const target = event.target as HTMLInputElement;
  const newQuantity = parseInt(target.value) || 1;
  cartStore.updateQuantity(item.id, Math.max(1, newQuantity), item.size, item.color);
};

const removeItem = (item: any) => {
  if (confirm(`Сигурни ли сте, че искате да премахнете "${item.name}" от количката?`)) {
    cartStore.removeItem(item.id, item.size, item.color);
  }
};

// SEO
useHead({
  title: "Количка - emWear",
  meta: [
    {
      name: "description",
      content: "Прегледайте вашата количка и завършете поръчката си от emWear.",
    },
  ],
});
</script>

<style lang="scss" scoped>
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

// ═══════════════════════════════════════════════════
// CART PAGE
// ═══════════════════════════════════════════════════

.cart-page {
  min-height: 100vh;
  background: $bg-page;
  padding-bottom: 3rem;

  &__header {
    background: $grad-brand-a;
    padding: 2rem 1rem;
    border-bottom: 1px solid $border-base;

    @include up(md) {
      padding: 2.5rem 1.5rem;
    }

    @include up(lg) {
      padding: 3rem 2rem;
    }
  }

  &__container {
    max-width: 1280px;
    margin: 0 auto;
    width: 100%;
  }

  &__title {
    font-family: $font-heading;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 0.5rem;
    letter-spacing: -0.01em;
  }

  &__subtitle {
    font-family: $font-body;
    font-size: 1rem;
    color: $text-secondary;
    margin: 0;
  }

  &__content {
    padding: 2rem 1rem;

    @include up(md) {
      padding: 2.5rem 1.5rem;
    }

    @include up(lg) {
      padding: 3rem 2rem;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @include up(lg) {
      grid-template-columns: 1fr 380px;
      gap: 3rem;
    }
  }

  &__items {
    order: 1;

    @include up(lg) {
      order: 0;
    }
  }
}

// ═══════════════════════════════════════════════════
// EMPTY CART STATE
// ═══════════════════════════════════════════════════

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1rem;
  min-height: 50vh;

  &__icon {
    color: $brand;
    margin-bottom: 2rem;
    opacity: 0.8;
  }

  &__title {
    font-family: $font-heading;
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 1rem;
  }

  &__message {
    font-family: $font-body;
    font-size: 1.0625rem;
    color: $text-secondary;
    margin: 0 0 2rem;
    max-width: 400px;
  }

  &__cta {
    min-width: 220px;
  }
}

// ═══════════════════════════════════════════════════
// CART ITEMS LIST
// ═══════════════════════════════════════════════════

.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @include up(md) {
    gap: 1.25rem;
  }
}

// ═══════════════════════════════════════════════════
// CART ITEM
// ═══════════════════════════════════════════════════

.cart-item {
  background: $bg-card;
  border: 1px solid $border-base;
  border-radius: 14px;
  padding: 1rem;
  display: grid;
  grid-template-columns: 80px 1fr;
  grid-template-areas:
    "image details"
    "image quantity"
    "subtotal subtotal"
    "remove remove";
  gap: 1rem;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px $shadow-soft;

  @include up(sm) {
    grid-template-columns: 100px 1fr auto;
    grid-template-areas:
      "image details quantity"
      "image details subtotal"
      "remove remove remove";
    padding: 1.25rem;
  }

  @include up(md) {
    grid-template-columns: 120px 1fr auto auto auto;
    grid-template-areas: "image details quantity subtotal remove";
    gap: 1.5rem;
    padding: 1.5rem;
  }

  &:hover {
    box-shadow: 0 4px 12px $shadow-med;
  }

  &__image {
    grid-area: image;
    aspect-ratio: 1 / 1;
    background: $bg-page;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid $border-base;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 0.5rem;
    }
  }

  &__details {
    grid-area: details;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
  }

  &__name {
    font-family: $font-heading;
    font-size: 1.125rem;
    font-weight: 500;
    color: $brand-ink;
    margin: 0;
    line-height: 1.3;

    @include up(md) {
      font-size: 1.25rem;
    }
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.875rem;
    color: $text-secondary;

    @include up(sm) {
      flex-direction: row;
      gap: 1rem;
    }
  }

  &__meta-item {
    strong {
      font-weight: 500;
      color: $text-primary;
    }
  }

  &__price {
    font-family: $font-body;
    font-size: 1rem;
    font-weight: 600;
    color: $brand-ink;
    margin-top: auto;

    @include up(md) {
      font-size: 1.125rem;
    }
  }

  &__quantity {
    grid-area: quantity;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__quantity-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: $text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: none;

    @include up(md) {
      display: block;
    }
  }

  &__quantity-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: $bg-page;
    border: 1px solid $border-base;
    border-radius: 8px;
    padding: 0.25rem;
  }

  &__quantity-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: $bg-card;
    border: 1px solid $border-base;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: $brand-ink;

    &:hover {
      background: $brand;
      border-color: $brand;
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: 2px;
    }
  }

  &__quantity-input {
    width: 50px;
    height: 32px;
    text-align: center;
    border: none;
    background: transparent;
    font-family: $font-body;
    font-size: 1rem;
    font-weight: 600;
    color: $brand-ink;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &:focus {
      outline: none;
    }
  }

  &__subtotal {
    grid-area: subtotal;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;

    @include up(md) {
      align-items: center;
      justify-content: center;
    }
  }

  &__subtotal-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: $text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    @include up(md) {
      display: none;
    }
  }

  &__subtotal-value {
    font-family: $font-body;
    font-size: 1.125rem;
    font-weight: 700;
    color: $brand-ink;

    @include up(md) {
      font-size: 1.25rem;
    }
  }

  &__remove {
    grid-area: remove;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: transparent;
    border: 1px solid $border-base;
    border-radius: 8px;
    color: $error;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: $font-body;
    font-size: 0.875rem;
    font-weight: 500;

    @include up(md) {
      width: 44px;
      height: 44px;
      padding: 0;
    }

    &:hover {
      background: rgba($error, 0.1);
      border-color: $error;
    }

    &:focus-visible {
      outline: 2px solid $error;
      outline-offset: 2px;
    }
  }
}

// ═══════════════════════════════════════════════════
// ORDER SUMMARY
// ═══════════════════════════════════════════════════

.order-summary {
  order: 0;

  @include up(lg) {
    order: 1;
  }

  &__sticky {
    background: $bg-card;
    border: 1px solid $border-base;
    border-radius: 14px;
    padding: 1.5rem;
    box-shadow: 0 6px 16px $shadow-soft;

    @include up(lg) {
      position: sticky;
      top: 100px;
    }
  }

  &__title {
    font-family: $font-heading;
    font-size: 1.5rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 1.5rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: $font-body;
    font-size: 1rem;
  }

  &__label {
    color: $text-secondary;
    font-weight: 400;
  }

  &__value {
    color: $text-primary;
    font-weight: 600;
  }

  &__divider {
    height: 1px;
    background: $border-base;
    margin: 0.5rem 0;
  }

  &__total {
    font-size: 1.25rem;
    margin-top: 0.5rem;

    .order-summary__label,
    .order-summary__value {
      color: $brand-ink;
      font-weight: 700;
    }
  }

  &__cta {
    width: 100%;
    margin-top: 1rem;
  }

  &__continue {
    display: block;
    text-align: center;
    font-family: $font-body;
    font-size: 0.9375rem;
    color: $text-secondary;
    text-decoration: none;
    margin-top: 1rem;
    transition: color 0.2s ease;

    &:hover {
      color: $brand;
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: 2px;
      border-radius: 4px;
    }
  }
}

// ═══════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════

.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.3s ease;
}

.cart-item-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.cart-item-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.cart-item-move {
  transition: transform 0.3s ease;
}
</style>
