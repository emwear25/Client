<template>
  <Teleport to="body">
    <div v-if="open" class="qv">
      <!-- Backdrop -->
      <div class="qv__backdrop" @click="$emit('close')"/>

      <!-- Panel (RIGHT slide-in) -->
      <aside class="qv__panel" role="dialog" aria-modal="true" aria-labelledby="qv-title">
        <!-- Close Button -->
        <button class="qv__close" aria-label="Затвори" @click="$emit('close')">×</button>

        <!-- Header with Image -->
        <div class="qv__header">
          <NuxtImg
            :src="product?.images?.[0]?.url || '/img/placeholder.png'"
            :alt="product?.name"
            class="qv__header-img"
            format="webp"
            quality="80"
          />
        </div>

        <!-- Body -->
        <div class="qv__body">
          <h3 id="qv-title" class="qv__title">{{ product?.name }}</h3>

          <!-- Price -->
          <div class="qv__price">
            <span class="qv__price-current">{{ formatPrice(product?.price) }}</span>
            <span v-if="product?.compareAt" class="qv__price-old">
              {{ formatPrice(product?.compareAt) }}
            </span>
          </div>

          <!-- Colors (if available) -->
          <div v-if="product?.colors?.length" class="qv__group">
            <p class="qv__label">
              ЦВЯТ: <strong>{{ selectedColor ? getColorDisplayName(selectedColor) : getColorDisplayName(product.colors[0]) }}</strong>
            </p>
            <div class="qv__swatches">
              <button
                v-for="color in product.colors"
                :key="getColorName(color)"
                class="qv__swatch"
                :class="{ 'qv__swatch--active': getColorName(color) === selectedColor }"
                :style="{ background: getColorHex(color) }"
                :aria-label="getColorDisplayName(color)"
                :title="getColorDisplayName(color)"
                @click="selectedColor = getColorName(color)"
              />
            </div>
          </div>

          <!-- Sizes (if available) -->
          <div v-if="product?.sizes?.length" class="qv__group">
            <p class="qv__label">
              РАЗМЕР: <strong>{{ selectedSize || product.sizes[0] }}</strong>
            </p>
            <div class="qv__choices">
              <button
                v-for="size in product.sizes"
                :key="size"
                class="qv__choice"
                :class="{ 'qv__choice--active': selectedSize === size }"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Embroidery Customization -->
          <div v-if="product?.customEmbroidery" class="qv__custom">
            <div class="qv__custom-item">
              <input
                id="qv-embroidery-enable"
                v-model="embroideryEnabled"
                type="checkbox"
                class="qv__custom-checkbox"
              />
              <label for="qv-embroidery-enable" class="qv__custom-label">
                <img src="/img/embroidered.svg" alt="Бродерия" class="qv__custom-icon" />
                Добави име за бродерия
              </label>
            </div>

            <div v-if="embroideryEnabled" class="qv__custom-fields">
              <p class="qv__custom-note">
                Забележка: Персонализираните артикули се нуждаят от допълнително време за обработка.
              </p>
              <div class="qv__custom-field">
                <label class="qv__custom-field-label">Име за бродерия</label>
                <input
                  v-model="embroideryName"
                  type="text"
                  placeholder="Въведете име"
                  class="qv__custom-input"
                  :class="{ 'qv__custom-input--error': embroideryError }"
                  maxlength="15"
                  required
                  @blur="validateEmbroidery"
                />
                <span v-if="embroideryError" class="qv__custom-error">{{
                  embroideryError
                }}</span>
              </div>
            </div>
          </div>

          <button
            class="btn btn--primary qv__cta"
            :disabled="!product?.stock || product.stock <= 0"
            @click="addToCart"
          >
            {{ product?.stock && product.stock > 0 ? "Добави в количката" : "Не е Налично" }}
          </button>

          <!-- USP List -->
          <ul class="qv__usp">
            <li>✓ Безплатна доставка над 110 лв</li>
            <li>✓ Лесно връщане до 30 дни</li>
            <li>✓ Безопасни материали</li>
          </ul>

          <!-- View Full Product -->
          <NuxtLink
            :to="`/products/${product?.slug || product?._id}`"
            class="qv__view"
            @click="$emit('close')"
          >
            Виж пълния продукт →
          </NuxtLink>
        </div>
      </aside>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useCartStore } from "~/stores/cart";
import { useToast } from "~/composables/useToast";

interface ProductImage {
  url: string;
  publicId: string;
}

interface Product {
  _id: string;
  slug?: string;
  name: string;
  price: number;
  compareAt?: number | null;
  images?: ProductImage[];
  colors?: (string | { name: string; hex?: string })[];
  sizes?: string[];
  stock: number;
  weight?: number;
  customEmbroidery?: boolean;
}

const props = defineProps<{
  open: boolean;
  product: Product | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const cartStore = useCartStore();
const toast = useToast();

// Selection state
const selectedColor = ref<string>("");
const selectedSize = ref<string>("");

// Embroidery state
const embroideryEnabled = ref(false);
const embroideryName = ref("");
const embroideryError = ref("");

// Auto-select first color/size when product changes
watch(
  () => props.product,
  (newProduct) => {
    if (!newProduct) {
      selectedColor.value = "";
      selectedSize.value = "";
      embroideryEnabled.value = false;
      embroideryName.value = "";
      embroideryError.value = "";
      return;
    }

    // Auto-select first color if only one exists
    if (newProduct.colors && newProduct.colors.length === 1) {
      selectedColor.value = getColorName(newProduct.colors[0]);
    } else {
      selectedColor.value = "";
    }

    // Auto-select first size if sizes exist
    if (newProduct.sizes && newProduct.sizes.length > 0) {
      selectedSize.value = newProduct.sizes[0];
    } else {
      selectedSize.value = "";
    }

    // Reset embroidery
    embroideryEnabled.value = false;
    embroideryName.value = "";
    embroideryError.value = "";
  },
  { immediate: true }
);

// Validation for embroidery
const validateEmbroidery = () => {
  if (embroideryEnabled.value && !embroideryName.value.trim()) {
    embroideryError.value = "Това поле е задължително.";
    return false;
  }
  embroideryError.value = "";
  return true;
};

const formatPrice = (price?: number | null) => {
  if (price == null) return "";
  return `${price.toFixed(2)} лв.`;
};

// Helper functions for color handling
const getColorName = (color: string | { name: string; hex?: string }) => {
  return typeof color === "string" ? color : color.name;
};

// Color translation map: English to Bulgarian
const colorTranslationMap: Record<string, string> = {
  black: "Черен",
  white: "Бял",
  red: "Червен",
  blue: "Син",
  green: "Зелен",
  yellow: "Жълт",
  purple: "Лилав",
  pink: "Розов",
  gray: "Сив",
  grey: "Сив",
  navy: "Морско синьо",
};

const getColorDisplayName = (color: string | { name: string; hex?: string } | null | undefined) => {
  if (!color) return "";
  const colorName = typeof color === "string" ? color : color?.name || "";
  if (!colorName) return "";
  const normalizedName = colorName.toLowerCase().trim();
  return colorTranslationMap[normalizedName] || colorName;
};

const getColorHex = (color: string | { name: string; hex?: string } | null | undefined) => {
  const DEFAULT_GREY = "#9CA3AF";
  
  if (!color) return DEFAULT_GREY;

  const colorName = typeof color === "string" ? color : color?.name;

  if (!colorName || typeof colorName !== "string") {
    if (typeof color === "object" && color?.hex) {
      return color.hex;
    }
    return DEFAULT_GREY;
  }

  const normalizedName = colorName.toLowerCase().trim();

  const colorMap: Record<string, string> = {
    червен: "#ef4444",
    червено: "#ef4444",
    син: "#3b82f6",
    синьо: "#3b82f6",
    зелен: "#10b981",
    зелено: "#10b981",
    жълт: "#f59e0b",
    жълто: "#f59e0b",
    бял: "#ffffff",
    бяло: "#ffffff",
    черен: "#000000",
    черно: "#000000",
    розов: "#ec4899",
    розово: "#ec4899",
    сив: "#6b7280",
    black: "#000000",
    white: "#ffffff",
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#10b981",
    yellow: "#f59e0b",
    purple: "#8b5cf6",
    pink: "#ec4899",
    gray: "#6b7280",
    grey: "#6b7280",
    navy: "#1e40af",
  };

  const mappedFromName = colorMap[normalizedName];
  if (mappedFromName) {
    return mappedFromName;
  }

  if (typeof color === "object" && color.hex) {
    const hexValue = color.hex.trim().toLowerCase();
    if (hexValue && hexValue !== DEFAULT_GREY.toLowerCase()) {
      return color.hex;
    }
  }

  return DEFAULT_GREY;
};

const addToCart = () => {
  if (!props.product) return;

  // Validate color selection if MORE than 1 color exists
  if (props.product.colors && props.product.colors.length > 1 && !selectedColor.value) {
    toast.error("Моля изберете цвят", 3000);
    return;
  }

  // Validate size selection if sizes exist
  if (props.product.sizes && props.product.sizes.length > 0 && !selectedSize.value) {
    toast.error("Моля изберете размер", 3000);
    return;
  }

  // Validate embroidery if enabled
  if (embroideryEnabled.value && !validateEmbroidery()) {
    return;
  }

  // Get color display name for cart
  let colorForCart: string | undefined = undefined;
  if (selectedColor.value) {
    const colorObj = props.product.colors?.find((c) => getColorName(c) === selectedColor.value);
    if (colorObj) {
      colorForCart = getColorDisplayName(colorObj);
    } else {
      colorForCart = selectedColor.value;
    }
  } else if (props.product.colors && props.product.colors.length === 1) {
    colorForCart = getColorDisplayName(props.product.colors[0]);
  }

  // Prepare embroidery data if enabled
  const embroidery = embroideryEnabled.value && embroideryName.value.trim()
    ? {
        name: embroideryName.value.trim(),
        color: undefined,
        font: undefined,
      }
    : undefined;

  cartStore.addItem(
    {
      id: props.product._id,
      name: props.product.name,
      price: props.product.price,
      image: props.product.images?.[0]?.url,
      size: selectedSize.value || props.product.sizes?.[0],
      color: colorForCart,
      weight: props.product.weight || 0.5,
      embroidery,
    },
    1
  );

  toast.success(`${props.product.name} е добавен в количката!`);

  // Close drawer after adding
  emit("close");
};
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

// ═══════════════════════════════════════════════════
// QUICK VIEW DRAWER - RIGHT slide-in
// ═══════════════════════════════════════════════════

.qv {
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
    width: min(560px, 92vw);
    background: $bg-card;
    color: $text-primary;
    box-shadow: -8px 0 30px rgba(0, 0, 0, 0.18);
    transform: translateX(100%);
    animation: qv-in 0.35s ease forwards;
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: hidden;
  }

  @keyframes qv-in {
    to {
      transform: translateX(0);
    }
  }

  &__close {
    position: absolute;
    top: 8px;
    right: 12px;
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
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__header-img {
    width: 100%;
    max-width: 400px;
    height: auto;
    max-height: 320px;
    object-fit: contain;
    display: block;
  }

  &__body {
    padding: 18px;
    overflow: auto;
  }

  &__title {
    font-family: $font-heading;
    color: $brand-ink;
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    line-height: 1.3;
  }

  &__price {
    display: flex;
    gap: 10px;
    align-items: baseline;
    margin-bottom: 1rem;
  }

  &__price-current {
    font-weight: 600;
    font-size: 1.25rem;
    color: $brand-ink;
  }

  &__price-old {
    color: $text-secondary;
    text-decoration: line-through;
    font-size: 1rem;
  }

  &__group {
    margin: 1rem 0;
  }

  &__label {
    font-size: 0.85rem;
    font-weight: 600;
    color: $text-secondary;
    margin-bottom: 0.4rem;
    letter-spacing: 0.05em;

    strong {
      color: $brand-ink;
      font-weight: 600;
    }
  }

  &__swatches {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__swatch {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.15);
      box-shadow: 0 2px 8px $shadow-soft;
    }

    &--active {
      border-color: $brand-ink;
      box-shadow: 0 0 0 2px $bg-card, 0 0 0 4px $brand-ink;
    }
  }

  &__choices {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__choice {
    border: 1px solid $border-base;
    border-radius: 999px;
    padding: 0.45rem 0.8rem;
    background: $bg-page;
    color: $brand-ink;
    font-family: $font-body;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: $brand;
      border-color: $brand;
      color: $brand-ink;
    }

    &--active {
      background: $brand;
      border-color: $brand;
      color: $color-white;
      font-weight: 600;
    }
  }

  // Embroidery customization styles
  &__custom {
    margin: 1rem 0;
    padding: 1rem 1.25rem;
    background: $bg-page;
    border-radius: 8px;
  }

  &__custom-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__custom-checkbox {
    width: 20px;
    height: 20px;
    accent-color: $brand;
    cursor: pointer;
  }

  &__custom-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: $font-body;
    font-size: 15px;
    font-weight: 400;
    line-height: 26px;
    color: #333333;
    cursor: pointer;
  }

  &__custom-icon {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
  }

  &__custom-fields {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__custom-note {
    font-family: $font-body;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
    color: #333333;
    margin: 0;
  }

  &__custom-field {
    display: flex;
    flex-direction: column;
  }

  &__custom-field-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  &__custom-input {
    width: 100%;
    padding: 0.5rem 0;
    border: none;
    border-bottom: 1px solid $border-base;
    background: transparent;
    font-family: $font-body;
    font-size: 0.9375rem;
    border-radius: 0;

    &:focus {
      outline: none;
      border-bottom-color: $brand;
      border-bottom-width: 2px;
    }

    &--error {
      border-bottom-color: $error;
      border-bottom-width: 2px;
    }
  }

  &__custom-error {
    display: block;
    font-size: 0.875rem;
    color: $error;
    margin-top: 0.25rem;
  }

  &__cta {
    width: 100%;
    margin-top: 8px;
    padding: 0.875rem 1.5rem;
    font-size: 1rem;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__usp {
    margin: 12px 0;
    padding-left: 0;
    list-style: none;
    color: $text-secondary;
    font-size: 0.9375rem;

    li {
      padding: 0.25rem 0;
      line-height: 1.6;
    }
  }

  &__view {
    display: inline-block;
    margin-top: 6px;
    text-decoration: underline;
    color: $brand-ink;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: $brand;
    }
  }
}
</style>