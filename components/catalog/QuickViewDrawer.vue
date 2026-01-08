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
              
              <!-- Standard Name Field (shows if no NON-checkbox category-specific fields) -->
              <div v-if="personalizationFields.filter(f => f.type !== 'checkbox').length === 0" class="qv__custom-field">
                <label class="qv__custom-field-label">Име за бродерия <span class="qv__custom-required">*</span></label>
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
                <span v-if="embroideryError" class="qv__custom-error">{{ embroideryError }}</span>
              </div>
              
              <!-- Category-Specific Personalization Fields (exclude checkboxes) -->
              <template v-if="personalizationFields.filter(f => f.type !== 'checkbox').length > 0">
                <div 
                  v-for="field in personalizationFields.filter(f => f.type !== 'checkbox')" 
                  :key="field.name" 
                  class="qv__custom-field"
                >
                  <label class="qv__custom-field-label">
                    {{ field.label }}
                    <span class="qv__custom-required">*</span>
                  </label>
                  <input
                    v-if="field.type === 'text' || field.type === 'number'"
                    v-model="customFields[field.name]"
                    :type="field.type"
                    :placeholder="field.placeholder"
                    class="qv__custom-input"
                    :class="{ 'qv__custom-input--error': customFieldErrors[field.name] }"
                    @blur="validateEmbroidery"
                  />
                  <input
                    v-else-if="field.type === 'date'"
                    v-model="customFields[field.name]"
                    type="date"
                    class="qv__custom-input"
                    :class="{ 'qv__custom-input--error': customFieldErrors[field.name] }"
                    @blur="validateEmbroidery"
                  />
                  <input
                    v-else-if="field.type === 'time'"
                    v-model="customFields[field.name]"
                    type="time"
                    class="qv__custom-input"
                    :class="{ 'qv__custom-input--error': customFieldErrors[field.name] }"
                    @blur="validateEmbroidery"
                  />
                  <span v-if="customFieldErrors[field.name]" class="qv__custom-error">
                    {{ customFieldErrors[field.name] }}
                  </span>
                </div>
              </template>
              
              <!-- Checkbox fields with price (optional add-ons) -->
              <div 
                v-for="field in personalizationFields.filter(f => f.type === 'checkbox')" 
                :key="field.name" 
                class="qv__custom-checkbox-field"
              >
                <label class="qv__custom-checkbox-label">
                  <input
                    type="checkbox"
                    :checked="customFields[field.name] === true"
                    class="qv__custom-checkbox-input"
                    @change="customFields[field.name] = ($event.target as HTMLInputElement).checked"
                  />
                  <span class="qv__custom-checkbox-text">
                    {{ field.label }}
                    <span v-if="field.price" class="qv__custom-checkbox-price">+{{ field.price.toFixed(2) }} лв.</span>
                  </span>
                </label>
              </div>
              
              <!-- Notes Field (always visible) -->
              <div class="qv__custom-field qv__custom-field--notes">
                <label class="qv__custom-field-label">
                  Специални инструкции <span class="qv__custom-optional">(по желание)</span>
                </label>
                <textarea
                  v-model="embroideryNotes"
                  placeholder="Въведете специални пожелания..."
                  rows="2"
                  class="qv__custom-input qv__custom-textarea"
                  maxlength="200"
                />
                <span class="qv__char-count">{{ embroideryNotes.length }}/200</span>
              </div>
            </div>
          </div>

          <button
            class="btn btn--primary qv__cta"
            :disabled="availableStock <= 0"
            @click="addToCart"
          >
            {{ availableStock > 0 ? "Добави в количката" : "Не е Налично" }}
          </button>

          <!-- USP List -->
          <ul class="qv__usp">
            <li>✓ Безплатна доставка над €56 (110 лв)</li>
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
import { useCurrency } from "~/composables/useCurrency";
import { useFacebookPixel } from "~/composables/useFacebookPixel";

interface ProductImage {
  url: string;
  publicId: string;
}

interface Variant {
  size: string;
  color: string;
  stock: number;
  reserved?: number;
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
  variants?: Variant[];
  weight?: number;
  customEmbroidery?: boolean;
  category?: {
    _id?: string;
    name?: string;
    personalizationFields?: {
      name: string;
      label: string;
      type: string;
      placeholder?: string;
      required?: boolean;
      order?: number;
    }[];
  };
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
const embroideryNotes = ref("");
const customFields = ref<Record<string, string | boolean>>({});
const customFieldErrors = ref<Record<string, string>>({});

// Computed: Total price of checked priced options (checkboxes with price)
const pricedOptionsTotal = computed(() => {
  let total = 0;
  for (const field of personalizationFields.value) {
    if (field.type === 'checkbox' && field.price && customFields.value[field.name] === true) {
      total += field.price;
    }
  }
  return total;
});

// Computed: Get personalization fields from category
const personalizationFields = computed(() => {
  if (!props.product?.category || typeof props.product.category !== 'object') return [];
  return props.product.category.personalizationFields || [];
});

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
    embroideryNotes.value = "";
    customFields.value = {};
    customFieldErrors.value = {};
  },
  { immediate: true }
);

// Calculate actual available stock (from variants if they exist)
const availableStock = computed(() => {
  if (!props.product) return 0;
  
  // If product has variants, calculate total stock from variants
  if (props.product.variants && props.product.variants.length > 0) {
    return props.product.variants.reduce((total, variant) => {
      const available = Math.max(0, variant.stock - (variant.reserved || 0));
      return total + available;
    }, 0);
  }
  
  // Otherwise use base stock
  return props.product.stock || 0;
});

// Validation for embroidery
const validateEmbroidery = () => {
  let isValid = true;
  
  // Get non-checkbox personalization fields
  const nonCheckboxFields = personalizationFields.value.filter((f: any) => f.type !== 'checkbox');
  
  // Validate name field if there are NO non-checkbox category-specific fields
  if (embroideryEnabled.value && nonCheckboxFields.length === 0 && !embroideryName.value.trim()) {
    embroideryError.value = "Това поле е задължително.";
    isValid = false;
  } else {
    embroideryError.value = "";
  }
  
  // Validate custom fields (all non-checkbox fields are required when embroidery is enabled)
  customFieldErrors.value = {};
  if (embroideryEnabled.value) {
    nonCheckboxFields.forEach((field: any) => {
      const value = customFields.value[field.name];
      if (!value || (typeof value === 'string' && !value.trim())) {
        customFieldErrors.value[field.name] = "Това поле е задължително.";
        isValid = false;
      }
    });
  }
  
  return isValid;
};

const { formatDualPrice } = useCurrency();

const formatPrice = (price?: number | null) => {
  if (price == null) return "";
  return formatDualPrice(price);
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

  // Build priced options array from checked checkboxes with prices
  const pricedOptions = personalizationFields.value
    .filter((f: any) => f.type === 'checkbox' && f.price && customFields.value[f.name] === true)
    .map((f: any) => ({
      name: f.name,
      label: f.label,
      price: f.price,
    }));

  // Calculate final price including priced options
  const finalPrice = props.product.price + pricedOptionsTotal.value;

  // Prepare embroidery data if enabled
  const embroidery = embroideryEnabled.value
    ? {
        name: embroideryName.value.trim() || undefined,
        color: undefined,
        font: undefined,
        notes: embroideryNotes.value.trim() || undefined,
        customFields: Object.keys(customFields.value).length > 0 
          ? { ...customFields.value }
          : undefined,
        pricedOptions: pricedOptions.length > 0 ? pricedOptions : undefined,
        optionsTotal: pricedOptionsTotal.value > 0 ? pricedOptionsTotal.value : undefined,
      }
    : undefined;

  cartStore.addItem(
    {
      id: props.product._id,
      name: props.product.name,
      price: finalPrice,
      image: props.product.images?.[0]?.url,
      size: selectedSize.value || props.product.sizes?.[0],
      color: colorForCart,
      weight: props.product.weight || 0.5,
      embroidery,
    },
    1
  );

  // Track AddToCart event for Facebook Pixel
  const { trackAddToCart } = useFacebookPixel();
  trackAddToCart({
    id: props.product._id,
    name: props.product.name,
    price: finalPrice,
    quantity: 1,
  });

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
  
  &__custom-checkbox-field {
    margin-top: 0.75rem;
    padding: 0.75rem;
    background: #e8f5e9;
    border-radius: 8px;
    border: 1px solid #c8e6c9;
  }
  
  &__custom-checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    color: #333;
  }
  
  &__custom-checkbox-input {
    width: 18px;
    height: 18px;
    accent-color: #6c8474;
    cursor: pointer;
  }
  
  &__custom-checkbox-text {
    flex: 1;
  }
  
  &__custom-checkbox-price {
    background: #6c8474;
    color: white;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-left: 0.25rem;
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