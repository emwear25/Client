<template>
  <div class="pdp">
    <!-- Loading State -->
    <div v-if="isLoading" class="pdp-loading">
      <div class="container">
        <div class="spinner" />
        <p>Зареждане...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="pdp-error">
      <div class="container">
        <div class="pdp-error__card">
          <h2>Продуктът не е намерен</h2>
          <p>{{ error }}</p>
          <NuxtLink to="/products" class="btn btn--primary">Към продукти</NuxtLink>
        </div>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="pdp-content">
      <!-- Breadcrumbs -->
      <nav class="pdp-breadcrumbs">
        <div class="container">
          <NuxtLink to="/" class="pdp-breadcrumbs__link">Начало</NuxtLink>
          <span class="pdp-breadcrumbs__sep">/</span>
          <NuxtLink to="/products" class="pdp-breadcrumbs__link">Продукти</NuxtLink>
          <span class="pdp-breadcrumbs__sep">/</span>
          <span class="pdp-breadcrumbs__current">{{ product.name }}</span>
        </div>
      </nav>

      <!-- Main Product Section -->
      <section class="pdp-main">
        <div class="container">
          <div class="pdp-grid">
            <!-- LEFT: Image Gallery -->
            <div class="pdp-gallery">
              <div class="pdp-gallery__main">
                <NuxtImg
                  :src="selectedImage?.url || product.images?.[0]?.url || '/img/placeholder.png'"
                  :alt="product.name"
                  class="pdp-gallery__img"
                  format="webp"
                  quality="85"
                  width="800"
                  height="800"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
                  loading="eager"
                  placeholder
                />
              </div>
              <div v-if="product.images && product.images.length > 1" class="pdp-gallery__thumbs">
                <button
                  v-for="(img, index) in product.images"
                  :key="index"
                  class="pdp-gallery__thumb"
                  :class="{
                    'pdp-gallery__thumb--active': selectedImageIndex === index,
                  }"
                  @click="selectImage(index)"
                >
                  <NuxtImg
                    :src="img.url"
                    :alt="`${product.name} - ${index + 1}`"
                    format="webp"
                    quality="70"
                    width="100"
                    height="100"
                    loading="lazy"
                    placeholder
                  />
                </button>
              </div>
            </div>

            <!-- RIGHT: Product Details -->
            <div class="pdp-details">
              <!-- Title & Price -->
              <div class="pdp-header">
                <h1 class="pdp-title">{{ product.name }}</h1>
                <!-- Badges -->
                <div v-if="badges.length > 0" class="pdp-badges">
                  <span
                    v-for="badge in badges"
                    :key="badge.key"
                    class="pdp-badge"
                    :class="`pdp-badge--${badge.key}`"
                  >
                    {{ badge.label }}
                  </span>
                </div>
              </div>

              <!-- Social Share -->
              <div class="pdp-social">
                <button
                  class="pdp-social__btn"
                  title="Сподели във Facebook"
                  @click="shareOn('facebook')"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                </button>
                <button
                  class="pdp-social__btn"
                  title="Сподели в Instagram"
                  @click="shareOn('instagram')"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                    />
                  </svg>
                </button>
                <button class="pdp-social__btn" title="Сподели в TikTok" @click="shareOn('tiktok')">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
                    />
                  </svg>
                </button>
              </div>

              <!-- Reviews Summary -->
              <div v-if="reviewStats.totalReviews > 0" class="pdp-reviews">
                <span class="pdp-reviews__stars">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="pdp-reviews__star"
                    :class="{
                      'pdp-reviews__star--filled': star <= Math.round(reviewStats.averageRating),
                    }"
                  >
                    ★
                  </span>
                </span>
                <span class="pdp-reviews__count">
                  {{ reviewStats.averageRating.toFixed(1) }}
                  <span class="pdp-reviews__text">
                    ({{ reviewStats.totalReviews }}
                    {{ reviewStats.totalReviews === 1 ? "отзив" : "отзива" }})
                  </span>
                </span>
              </div>
              <div v-else class="pdp-reviews">
                <span class="pdp-reviews__stars">
                  <span v-for="star in 5" :key="star" class="pdp-reviews__star">★</span>
                </span>
                <span class="pdp-reviews__count">
                  <span class="pdp-reviews__text">(Няма отзиви)</span>
                </span>
              </div>

              <!-- Price -->
              <div class="pdp-price">
                <span class="pdp-price__current">{{ formatPrice(currentPrice) }}</span>
                <span
                  v-if="product.compareAt && product.compareAt > currentPrice"
                  class="pdp-price__old"
                  >{{ formatPrice(product.compareAt) }}</span
                >
                <span
                  v-if="product.compareAt && product.compareAt > currentPrice"
                  class="pdp-price__badge"
                >
                  Спести
                  {{ Math.round(((product.compareAt - currentPrice) / product.compareAt) * 100) }}%
                </span>
              </div>

              <!-- Stock Status -->
              <div v-if="currentStock > 0" class="pdp-stock pdp-stock--in">Налично</div>
              <div v-else class="pdp-stock pdp-stock--out">Не е Налично</div>

              <!-- Colors -->
              <div v-if="product.colors && product.colors.length" class="pdp-option">
                <label class="pdp-option__label"
                  >Цвят:
                  <strong>{{
                    selectedColor
                      ? getColorDisplayName(selectedColor)
                      : product.colors && product.colors[0]
                        ? getColorDisplayName(product.colors[0])
                        : ""
                  }}</strong></label
                >
                <div class="pdp-option__swatches">
                  <button
                    v-for="color in product.colors"
                    :key="getColorName(color)"
                    class="pdp-swatch"
                    :class="{ 'pdp-swatch--active': selectedColor === getColorName(color) }"
                    :style="{ background: getColorHexValue(color) }"
                    :title="getColorDisplayName(color)"
                    @click="selectedColor = getColorName(color)"
                  />
                </div>
              </div>

              <!-- Sizes -->
              <div v-if="product.sizes && product.sizes.length" class="pdp-option">
                <label class="pdp-option__label"
                  >Размер: <strong>{{ selectedSize || product.sizes[0] }}</strong></label
                >
                <div class="pdp-option__buttons">
                  <button
                    v-for="size in product.sizes"
                    :key="size"
                    class="pdp-option__btn"
                    :class="{
                      'pdp-option__btn--active': selectedSize === size,
                    }"
                    @click="selectedSize = size"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>

              <!-- Embroidery Name Display (if enabled and name entered) -->
              <div
                v-if="product.customEmbroidery && embroideryEnabled && embroideryName.trim()"
                class="pdp-option"
              >
                <label class="pdp-option__label"
                  >Име за бродерия: <strong>{{ embroideryName.trim() }}</strong></label
                >
              </div>

              <!-- Embroidery Customization -->
              <div v-if="product.customEmbroidery" class="pdp-custom">
                <div class="pdp-custom__item">
                  <input
                    id="embroidery-enable"
                    v-model="embroideryEnabled"
                    type="checkbox"
                    class="pdp-custom__checkbox"
                  />
                  <label for="embroidery-enable" class="pdp-custom__label">
                    <img src="/img/embroidered.svg" alt="Бродерия" class="pdp-custom__icon" />
                    Добави име за бродерия
                  </label>
                </div>

                <div v-if="embroideryEnabled" class="pdp-custom__fields">
                  <p class="pdp-custom__note">
                    Забележка: Персонализираните артикули се нуждаят от допълнително време за
                    обработка.
                  </p>
                  <div class="pdp-custom__field">
                    <label class="pdp-custom__field-label">Име за бродерия</label>
                    <input
                      v-model="embroideryName"
                      type="text"
                      placeholder="Въведете име"
                      class="pdp-custom__input"
                      :class="{ 'pdp-custom__input--error': embroideryError }"
                      maxlength="15"
                      required
                      @blur="validateEmbroidery"
                    />
                    <span v-if="embroideryError" class="pdp-custom__error">{{
                      embroideryError
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="pdp-actions">
                <button
                  class="pdp-add-cart btn btn--primary"
                  :disabled="currentStock === 0"
                  @click="addToCart"
                >
                  {{ currentStock > 0 ? "Добави в количката" : "Не е Налично" }}
                </button>

                <button
                  class="pdp-wishlist-btn"
                  :class="{ 'pdp-wishlist-btn--active': isInWishlist }"
                  :title="isInWishlist ? 'Премахни от любими' : 'Добави в любими'"
                  @click="wishlistStore.toggle(product._id)"
                >
                  <svg viewBox="0 0 24 24" class="pdp-wishlist-icon">
                    <path
                      :fill="isInWishlist ? 'currentColor' : 'none'"
                      stroke="currentColor"
                      stroke-width="1.5"
                      d="M12.1 20.1s-7.1-4.3-9.1-8.1A5.4 5.4 0 0 1 12 6.2a5.4 5.4 0 0 1 9 5.8c-2 3.8-9 8.1-9 8.1z"
                    />
                  </svg>
                </button>
              </div>

              <!-- Trust Badges -->
              <div class="pdp-trust">
                <div class="pdp-trust__item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <span>Безплатна доставка над 110 лв</span>
                </div>
                <div class="pdp-trust__item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 4 23 10 17 10" />
                    <polyline points="1 20 1 14 7 14" />
                    <path
                      d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
                    />
                  </svg>
                  <span>Лесно връщане до 30 дни</span>
                </div>
                <div class="pdp-trust__item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Безопасни материали</span>
                </div>
              </div>

              <!-- Payment Methods -->
              <div class="pdp-payment">
                <span class="pdp-payment__label">Приемаме:</span>
                <div class="pdp-payment__icons">
                  <div class="pdp-payment__icon pdp-payment__icon--visa" title="VISA">
                    <NuxtImg src="/img/payments/visa.png" alt="VISA" width="60" height="40" />
                  </div>
                  <div class="pdp-payment__icon pdp-payment__icon--mastercard" title="Mastercard">
                    <NuxtImg src="/img/payments/card.png" alt="Mastercard" width="60" height="40" />
                  </div>
                  <div class="pdp-payment__icon pdp-payment__icon--applepay" title="Apple Pay">
                    <NuxtImg
                      src="/img/payments/apple-pay.png"
                      alt="Apple Pay"
                      width="60"
                      height="40"
                    />
                  </div>
                  <div class="pdp-payment__icon pdp-payment__icon--cod" title="Наложен платеж">
                    <NuxtImg
                      src="/img/payments/cash-on-delivery.png"
                      alt="Наложен платеж"
                      width="60"
                      height="40"
                    />
                  </div>
                </div>
              </div>

              <!-- Product Info -->
              <div class="pdp-info">
                <div class="pdp-info__row">
                  <strong>Категория:</strong>
                  <span>{{ formatCategory(product.category) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Description & Details - Accordion Style -->
      <section class="pdp-accordion">
        <div class="container">
          <!-- Description -->
          <div class="pdp-accordion__item">
            <button
              class="pdp-accordion__trigger"
              :class="{
                'pdp-accordion__trigger--open': openSection === 'description',
              }"
              @click="toggleSection('description')"
            >
              <span class="pdp-accordion__title">Описание</span>
              <svg
                class="pdp-accordion__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div v-show="openSection === 'description'" class="pdp-accordion__content">
              <div class="pdp-description" v-html="parsedDescription"></div>
            </div>
          </div>

          <!-- Materials & Care -->
          <div class="pdp-accordion__item">
            <button
              class="pdp-accordion__trigger"
              :class="{
                'pdp-accordion__trigger--open': openSection === 'care',
              }"
              @click="toggleSection('care')"
            >
              <span class="pdp-accordion__title">Материали и грижа</span>
              <svg
                class="pdp-accordion__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div v-show="openSection === 'care'" class="pdp-accordion__content">
              <ul class="pdp-list">
                <li>100% висококачествени материали</li>
                <li>Перете на ръка или в деликатен режим</li>
                <li>Не използвайте белина</li>
                <li>Сушете на хоризонтална повърхност</li>
                <li>Гладете на ниска температура</li>
              </ul>
            </div>
          </div>

          <!-- Shipping & Returns -->
          <div class="pdp-accordion__item">
            <button
              class="pdp-accordion__trigger"
              :class="{
                'pdp-accordion__trigger--open': openSection === 'shipping',
              }"
              @click="toggleSection('shipping')"
            >
              <span class="pdp-accordion__title">Доставка и връщане</span>
              <svg
                class="pdp-accordion__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div v-show="openSection === 'shipping'" class="pdp-accordion__content">
              <div class="pdp-shipping">
                <div class="pdp-shipping__item">
                  <strong>Безплатна доставка</strong>
                  <p>За поръчки над 110 лв с Еконт или Спиди</p>
                </div>
                <div class="pdp-shipping__item">
                  <strong>Време за доставка</strong>
                  <p>1-3 работни дни след обработка на поръчката</p>
                </div>
                <div class="pdp-shipping__item">
                  <strong>Връщане</strong>
                  <p>Лесно връщане до 30 дни от получаване</p>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ -->
          <div class="pdp-accordion__item">
            <button
              class="pdp-accordion__trigger"
              :class="{ 'pdp-accordion__trigger--open': openSection === 'faq' }"
              @click="toggleSection('faq')"
            >
              <span class="pdp-accordion__title">Често задавани въпроси</span>
              <svg
                class="pdp-accordion__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div v-show="openSection === 'faq'" class="pdp-accordion__content">
              <div class="pdp-faq">
                <div class="pdp-faq__item">
                  <strong>Колко време отнема персонализацията?</strong>
                  <p>Обикновено 1-2 работни дни за обработка на поръчката</p>
                </div>
                <div class="pdp-faq__item">
                  <strong>Мога ли да върна персонализиран продукт?</strong>
                  <p>
                    Персонализираните продукти могат да бъдат върнати само при производствен дефект
                  </p>
                </div>
                <div class="pdp-faq__item">
                  <strong>Как да избера размер?</strong>
                  <p>Препоръчваме да изберете размера според възрастта на детето</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Reviews Section -->
      <section v-if="product" class="pdp-reviews-section">
        <div class="container">
          <div class="pdp-reviews-section__main">
            <!-- Review Statistics (Sidebar) -->
            <aside v-if="reviewStats.totalReviews > 0" class="pdp-reviews-section__stats">
              <ReviewStats :stats="reviewStats" @filter-by-rating="handleRatingFilter" />
            </aside>

            <!-- Reviews List -->
            <div class="pdp-reviews-section__content">
              <ProductReviews
                :key="`reviews-${product._id}-${refreshKey}`"
                :product-id="product._id"
                :stats="reviewStats"
                @stats-updated="handleStatsUpdated"
                @open-review-form="showReviewModal = true"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Related Products -->
      <RelatedProducts v-if="product" :product-id="product._id" :limit="4" />
    </div>

    <!-- Review Form Modal -->
    <Modal v-if="product" v-model:open="showReviewModal">
      <ReviewForm
        :key="`form-${product._id}-${refreshKey}`"
        :product-id="product._id"
        @submitted="handleReviewSubmitted"
        @stats-updated="handleStatsUpdated"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";
import { useWishlist } from "~/stores/useWishlist";
import { useApi } from "~/composables/useApi";
import { useProductSEO } from "~/composables/useSEO";
import { useBreadcrumbs } from "~/composables/useBreadcrumbs";
import { useMarkdown } from "~/composables/useMarkdown";
import ReviewStats from "~/components/reviews/ReviewStats.vue";
import ProductReviews from "~/components/reviews/ProductReviews.vue";
import ReviewForm from "~/components/reviews/ReviewForm.vue";
import RelatedProducts from "~/components/products/RelatedProducts.vue";
import Modal from "~/components/common/Modal.vue";

interface ProductImage {
  url: string;
  publicId: string;
}

interface EmbroideryColor {
  name: string;
  value: string;
}

interface Variant {
  size: string;
  color: string;
  stock: number;
  price?: number;
  reserved?: number;
  lowStockThreshold?: number;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface Product {
  _id: string;
  slug?: string;
  name: string;
  description: string;
  price: number;
  compareAt?: number | null;
  category:
    | string
    | {
        _id: string;
        name: string;
        defaultWeight: number;
        defaultDimensions: {
          length: number;
          width: number;
          height: number;
        };
      };
  sizes: string[];
  colors: string[];
  variants?: Variant[];
  images?: ProductImage[];
  stock: number;
  weight?: number; // Weight in kg for shipping
  isActive: boolean;
  customEmbroidery?: boolean;
  embroideryFonts?: string[];
  embroideryColors?: EmbroideryColor[];
  reviewStats?: ReviewStats;
  createdAt: string;
}

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const wishlistStore = useWishlist();
const { parseMarkdown, isReady } = useMarkdown();

// State
const product = ref<Product | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Selection state
const selectedImageIndex = ref(0);
const selectedColor = ref<string>("");
const selectedSize = ref<string>("");

// Embroidery state
const embroideryEnabled = ref(false);
const embroideryName = ref("");
const embroideryColor = ref("");
const embroideryFont = ref("");
const embroideryError = ref("");

// Validation for embroidery
const validateEmbroidery = () => {
  if (embroideryEnabled.value && !embroideryName.value.trim()) {
    embroideryError.value = "Това поле е задължително.";
    return false;
  }
  embroideryError.value = "";
  return true;
};

// Accordion state
const openSection = ref<string>("description");

// Review modal state
const showReviewModal = ref(false);

// Review state
const reviewStats = ref({
  averageRating: 0,
  totalReviews: 0,
  ratingDistribution: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  },
});
const refreshKey = ref(0);

// Wishlist computed
const isInWishlist = computed(() =>
  product.value ? wishlistStore.ids.includes(product.value._id) : false
);

// Badges computed
const isNew = computed(() => {
  if (!product.value?.createdAt) return false;
  const productDate = new Date(product.value.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - productDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7; // 1 week
});

const badges = computed(() => {
  const arr: Array<{ key: string; label: string }> = [];
  if (isNew.value) arr.push({ key: "new", label: "Ново" });
  if (product.value?.customEmbroidery) arr.push({ key: "personal", label: "Персонализация" });
  return arr;
});

// Parsed markdown description
const parsedDescription = computed(() => {
  if (!product.value?.description) return "";
  // If libraries aren't ready yet, return escaped text (will update when ready)
  if (!isReady.value) {
    return product.value.description
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  return parseMarkdown(product.value.description);
});

// Computed
const selectedImage = computed(() => {
  if (!product.value?.images) return null;
  return product.value.images[selectedImageIndex.value];
});

// Get current variant price based on selected size and color
const currentPrice = computed(() => {
  if (!product.value) return 0;

  const firstColor = product.value.colors?.[0];
  const currentColor = selectedColor.value || (firstColor ? getColorName(firstColor) : "");
  const currentSize = selectedSize.value || (product.value.sizes?.[0] ?? "");

  // If product has variants, find the specific variant price
  if (product.value.variants && product.value.variants.length > 0 && currentSize && currentColor) {
    const variant = product.value.variants.find(
      (v: Variant) => v.size === currentSize && v.color === currentColor
    );

    // Return variant-specific price if set, otherwise fall back to base price
    if (variant && variant.price !== undefined && variant.price !== null) {
      return variant.price;
    }
  }

  // Fall back to base product price
  return product.value.price;
});

// Get current variant stock based on selected size and color
const currentStock = computed(() => {
  if (!product.value) return 0;

  const firstColor = product.value.colors?.[0];
  const currentColor = selectedColor.value || (firstColor ? getColorName(firstColor) : "");
  const currentSize = selectedSize.value || (product.value.sizes?.[0] ?? "");

  // If product has variants, find the specific variant stock
  if (product.value.variants && product.value.variants.length > 0 && currentSize && currentColor) {
    const variant = product.value.variants.find(
      (v: Variant) => v.size === currentSize && v.color === currentColor
    );

    if (variant) {
      // Return available stock (stock - reserved)
      return Math.max(0, variant.stock - (variant.reserved || 0));
    }
  }

  // Fall back to base product stock
  return product.value.stock || 0;
});

// Methods
const selectImage = (index: number) => {
  selectedImageIndex.value = index;
};

const formatPrice = (price?: number | null) => {
  if (price == null) return "";
  return `${price.toFixed(2)} лв.`;
};

const formatCategory = (category: string | { name: string } | undefined) => {
  if (!category) return "";
  const categoryName = typeof category === "string" ? category : category.name;
  const map: Record<string, string> = {
    "t-shirts": "Тениски",
    hoodies: "Суитчъри",
    sweatshirts: "Блузи",
    bags: "Чанти",
    accessories: "Аксесоари",
  };
  return map[categoryName] || categoryName;
};

// Helper functions for color handling (supports both object and string formats)
const getColorName = (color: string | { name: string; hex?: string }) => {
  return typeof color === "string" ? color : color.name;
};

// Color translation map: English to Bulgarian
const colorTranslationMap: Record<string, string> = {
  // English to Bulgarian
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
  // Already Bulgarian or custom colors - return as is
};

const getColorDisplayName = (color: string | { name: string; hex?: string }) => {
  const colorName = typeof color === "string" ? color : color.name;

  if (!colorName) return "";

  // Normalize to lowercase for matching
  const normalizedName = colorName.toLowerCase().trim();

  // Check if we have a translation
  if (colorTranslationMap[normalizedName]) {
    return colorTranslationMap[normalizedName];
  }

  // Return original name if no translation found (could be custom color already in Bulgarian)
  return colorName;
};

const getColorHexValue = (color: string | { name: string; hex?: string } | null | undefined) => {
  const DEFAULT_GREY = "#9CA3AF";

  // Handle null/undefined cases
  if (!color) {
    return DEFAULT_GREY;
  }

  // Get color name regardless of format (normalized to lowercase for matching)
  const colorName = typeof color === "string" ? color : color?.name;

  // Handle cases where colorName might be undefined/null/empty
  if (!colorName || typeof colorName !== "string") {
    // If it's an object with hex, try to use that
    if (typeof color === "object" && color?.hex) {
      return color.hex;
    }
    return DEFAULT_GREY;
  }

  const normalizedName = colorName.toLowerCase().trim();

  // Comprehensive color map matching dashboard available colors
  const colorMap: Record<string, string> = {
    // Bulgarian color names
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
    коричнев: "#8b4513",
    коричнево: "#8b4513",
    // English color names (matching dashboard exactly)
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
    crew: "#c5a572",
    beige: "#f5f5dc",
    brown: "#8b4513",
  };

  // First, try to map from color name (most reliable if name matches)
  const mappedFromName = colorMap[normalizedName];
  if (mappedFromName) {
    return mappedFromName;
  }

  // If color is an object with hex value
  if (typeof color === "object" && color.hex) {
    const hexValue = color.hex.trim().toLowerCase();
    // Use hex if it exists and is not the default grey
    // (we already tried name mapping above, so if hex is default, name didn't match)
    if (hexValue && hexValue !== DEFAULT_GREY.toLowerCase()) {
      return color.hex; // Return original with original case/format
    }
    // If hex is default grey and name didn't match, return default grey
    return hexValue === DEFAULT_GREY.toLowerCase() ? DEFAULT_GREY : color.hex;
  }

  // Fallback to default grey
  return DEFAULT_GREY;
};

const toggleSection = (section: string) => {
  openSection.value = openSection.value === section ? "" : section;
};

const shareOn = (platform: string) => {
  const url = window.location.href;
  const toast = useToast();

  switch (platform) {
    case "facebook":
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank"
      );
      break;
    case "instagram":
      // Instagram doesn't support direct URL sharing, so copy to clipboard
      navigator.clipboard.writeText(url);
      toast.success("Линкът е копиран! Споделете го в Instagram Stories или Bio.");
      break;
    case "tiktok":
      // TikTok doesn't support direct URL sharing, so copy to clipboard
      navigator.clipboard.writeText(url);
      toast.success("Линкът е копиран! Споделете го в TikTok Bio или видео описание.");
      break;
  }
};

const addToCart = () => {
  if (!product.value) return;

  // Validate color selection if MORE than 1 color exists (if exactly 1, it's auto-selected)
  if (product.value.colors && product.value.colors.length > 1 && !selectedColor.value) {
    const toast = useToast();
    toast.error("Моля изберете цвят", 3000);
    return;
  }

  // Validate size selection if sizes exist
  if (product.value.sizes && product.value.sizes.length > 0 && !selectedSize.value) {
    const toast = useToast();
    toast.error("Моля изберете размер", 3000);
    return;
  }

  // Validate embroidery if enabled
  if (embroideryEnabled.value && !validateEmbroidery()) {
    return;
  }

  // Calculate final price (use variant price or base price, NO embroidery cost)
  const finalPrice = currentPrice.value;

  // Prepare embroidery data if enabled
  const embroidery = embroideryEnabled.value
    ? {
        name: embroideryName.value.trim(),
        color: embroideryColor.value || undefined,
        font: embroideryFont.value || undefined,
      }
    : undefined;

  // Add to cart
  // Get color display name for cart
  let colorForCart: string | undefined = undefined;
  if (selectedColor.value) {
    // Find the color object from product colors
    const colorObj = product.value.colors?.find((c) => getColorName(c) === selectedColor.value);
    if (colorObj) {
      colorForCart = getColorDisplayName(colorObj);
    } else if (selectedColor.value) {
      colorForCart = selectedColor.value;
    }
  }

  cartStore.addItem(
    {
      id: product.value._id,
      name: product.value.name,
      price: finalPrice,
      image: product.value.images?.[0]?.url,
      size: selectedSize.value || undefined,
      color: colorForCart,
      weight: product.value.weight || 0.5, // Include weight for shipping calculation
      category: typeof product.value.category === "object" ? product.value.category : undefined, // Include category for shipping
      embroidery, // Include embroidery data
    },
    1
  );

  // Show success toast
  const toast = useToast();
  toast.success(`${product.value.name} е добавен в количката!`, 3000);

  // Navigate to cart after a short delay
  setTimeout(() => {
    router.push("/cart");
  }, 1000);
};

// Fetch review stats
const fetchReviewStats = async (productId: string) => {
  try {
    const api = useApi();
    const response = await api.get(`reviews/stats/${productId}`);

    if (response.success && response.data) {
      reviewStats.value = {
        averageRating: response.data.averageRating || 0,
        totalReviews: response.data.totalReviews || 0,
        ratingDistribution: response.data.ratingDistribution || {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
      };
    }
  } catch (error) {
    console.error("Error fetching review stats:", error);
    // Fail silently - not critical
  }
};

const fetchProduct = async () => {
  const id = route.params.id;
  isLoading.value = true;
  error.value = null;

  try {
    const api = useApi();
    const response = await api.get(`products/${id}`);

    if (response.success && response.data) {
      product.value = response.data;

      // Load review stats if available from product
      if (product.value?.reviewStats) {
        reviewStats.value = {
          averageRating: product.value.reviewStats.averageRating || 0,
          totalReviews: product.value.reviewStats.totalReviews || 0,
          ratingDistribution: product.value.reviewStats.ratingDistribution || {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
          },
        };
      } else if (product.value) {
        // Fetch review stats from API
        await fetchReviewStats(product.value._id);
      }
    } else {
      throw new Error("Продуктът не е намерен");
    }

    // Set defaults
    if (product.value) {
      // Auto-select first color ONLY if exactly 1 color exists
      if (product.value.colors && product.value.colors.length === 1) {
        const firstColor = product.value.colors[0];
        if (firstColor) {
          const colorName = getColorName(firstColor);
          selectedColor.value = colorName || "";
        } else {
          selectedColor.value = "";
        }
      } else {
        selectedColor.value = "";
      }

      // Auto-select first size if sizes exist (always if there's at least 1)
      if (product.value.sizes && product.value.sizes.length > 0 && product.value.sizes[0]) {
        selectedSize.value = product.value.sizes[0];
      } else {
        selectedSize.value = "";
      }

      // Set default embroidery options
      if (product.value.embroideryFonts && product.value.embroideryFonts.length > 0) {
        embroideryFont.value = product.value.embroideryFonts[0] || "";
      }
      if (product.value.embroideryColors && product.value.embroideryColors.length > 0) {
        const firstColor = product.value.embroideryColors[0];
        embroideryColor.value = firstColor?.value || "";
      }

      // Set SEO for product page
      useProductSEO({
        name: product.value.name,
        description: product.value.description,
        images: product.value.images || [],
        price: product.value.price,
        category: product.value.category,
        seoTitle: (product.value as any).seoTitle,
        metaDescription: (product.value as any).metaDescription,
        slug: product.value.slug,
        reviewStats: product.value.reviewStats,
      });

      // Add breadcrumbs
      const categoryName =
        typeof product.value.category === "object" ? product.value.category?.name : "Продукти";
      const categorySlug =
        typeof product.value.category === "object" ? (product.value.category as any)?.slug : null;

      const breadcrumbItems = [
        { name: "Начало", url: "/" },
        { name: "Продукти", url: "/products" },
      ];

      if (categoryName !== "Продукти" && categorySlug) {
        breadcrumbItems.push({ name: categoryName, url: `/category/${categorySlug}` });
      }

      breadcrumbItems.push({
        name: product.value.name,
        url: `/products/${product.value.slug || product.value._id}`,
      });

      useBreadcrumbs(breadcrumbItems);
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Възникна грешка";
  } finally {
    isLoading.value = false;
  }
};

// Handle review events
const handleRatingFilter = (_rating: number) => {
  // Triggered by ReviewStats component - refresh reviews list
  refreshKey.value += 1;
};

const handleReviewSubmitted = () => {
  refreshKey.value += 1;
  showReviewModal.value = false;
  // Refetch stats after review submission
  if (product.value) {
    fetchReviewStats(product.value._id);
  }
};

const handleStatsUpdated = (stats?: ReviewStats) => {
  if (stats) {
    reviewStats.value = stats;
  } else if (product.value) {
    // If no stats passed, refetch them (e.g., from ReviewForm)
    fetchReviewStats(product.value._id);
  }
};

onMounted(() => {
  fetchProduct();
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/colors" as *;
@use "@/assets/styles/breakpoints" as *;
@use "@/assets/styles/fonts" as *;

/* PDP - Moonkie-style Product Detail Page */

.pdp {
  background: $bg-page;
  min-height: 100vh;
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
}

/* Loading & Error */
.pdp-loading,
.pdp-error {
  padding: 4rem 0;
  text-align: center;
}

.pdp-error__card {
  background: $bg-card;
  padding: 3rem 2rem;
  border: 1px solid $border-base;

  h2 {
    font-family: $font-heading;
    font-size: 1.5rem;
    margin: 0 0 1rem;
  }

  p {
    color: $text-secondary;
    margin: 0 0 2rem;
  }
}

/* Breadcrumbs */
.pdp-breadcrumbs {
  padding: 1rem 0;
  font-size: 0.875rem;

  &__link {
    color: $text-secondary;
    text-decoration: none;

    &:hover {
      color: $brand-ink;
    }
  }

  &__sep {
    color: $text-secondary;
    margin: 0 0.5rem;
  }

  &__current {
    color: $text-primary;
  }
}

/* Main Grid */
.pdp-main {
  padding: 2rem 0 4rem;
}

.pdp-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @include up(lg) {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
}

/* Gallery - Sticky on desktop */
.pdp-gallery {
  @include up(lg) {
    position: sticky;
    top: 100px;
    align-self: start;
  }

  &__main {
    aspect-ratio: 1 / 1;
    background: $bg-card;
    border: 1px solid $border-base;
    padding: 2rem;
    margin-bottom: 1rem;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__thumbs {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.75rem;
  }

  &__thumb {
    aspect-ratio: 1;
    background: $bg-card;
    border: 2px solid transparent;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: $border-base;
    }

    &--active {
      border-color: $brand-ink;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}

/* Details */
.pdp-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pdp-header {
  margin-bottom: 0;
}

.pdp-title {
  font-family: $font-heading;
  font-size: 36px;
  font-weight: 300;
  line-height: 40px;
  color: #333333;
  letter-spacing: -0.8px;
  margin: 0 0 0.5rem 0;

  @media (max-width: 767px) {
    font-size: 28px;
    line-height: 32px;
    letter-spacing: -0.6px;
  }
}

/* Badges */
.pdp-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.pdp-badge {
  padding: 6px 12px;
  font-size: 0.6875rem;
  font-weight: 700;
  color: $color-white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-block;

  &--new {
    background: $color-honey;
    color: $brand-ink;
  }

  &--personal {
    background: $color-sage;
    color: $brand-ink;
  }
}

/* Social Share */
.pdp-social {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.25rem;

  &__btn {
    width: 36px;
    height: 36px;
    background: $bg-card;
    border: 1px solid $border-base;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    svg {
      width: 18px;
      height: 18px;
      color: $text-secondary;
    }

    &:hover {
      background: $brand;
      border-color: $brand;

      svg {
        color: $color-white;
      }
    }
  }
}

// Reviews
.pdp-reviews {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;

  &__stars {
    display: inline-flex;
    align-items: center;
    gap: 1px;
  }

  &__star {
    font-size: 16px;
    color: #d1d5db;
    line-height: 1;
    transition: color 0.2s ease;

    &--filled {
      color: #f59e0b;
    }
  }

  &__count {
    display: inline-flex;
    align-items: center;
    color: $text-primary;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.4;
  }

  &__text {
    color: $text-secondary;
    font-weight: 400;
  }
}

/* Price */
.pdp-price {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin: 0 0 0.75rem 0;

  &__current {
    font-family: $font-body;
    font-size: 23px;
    font-weight: 400;
    line-height: 40px;
    color: #2f3a2a;
  }

  &__old {
    font-family: $font-body;
    font-size: 18px;
    font-weight: 400;
    line-height: 28px;
    color: #917b69;
    text-decoration: line-through;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    background: $color-honey;
    color: $brand-ink;
    font-family: $font-body;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 4px;
    white-space: nowrap;
  }
}

/* Stock */
.pdp-stock {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;

  &--in {
    background: rgba(#10b981, 0.1);
    color: #10b981;
  }

  &--out {
    background: rgba(#ef4444, 0.1);
    color: #ef4444;
  }
}

/* Options */
.pdp-option {
  &__label {
    display: block;
    font-family: $font-body;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: #333333;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    strong {
      font-weight: 600;
    }
  }

  &__swatches {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__btn {
    padding: 0.625rem 1.25rem;
    background: $bg-card;
    border: 2px solid $border-base;
    color: $brand-ink;
    font-family: $font-body;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: $brand-ink;
    }

    &--active {
      background: $brand-ink;
      color: $color-white;
      border-color: $brand-ink;
    }
  }
}

.pdp-swatch {
  width: 40px;
  height: 40px;
  border: 2px solid $border-base;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  &--active {
    border-color: $brand-ink;
    border-width: 3px;
  }
}

/* Custom Embroidery */
.pdp-custom {
  background: $bg-card;
  border: 1px solid $border-base;
  padding: 0.5rem 1.25rem;

  &__item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__checkbox {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: $brand;
    flex-shrink: 0;
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: $font-body;
    font-size: 15px;
    font-weight: 400;
    line-height: 26px;
    color: #333333;
    cursor: pointer;
    user-select: none;
  }

  &__icon {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
  }

  &__fields {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid $border-base;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__field-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  &__input {
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

  &__note {
    font-family: $font-body;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
    color: #333333;
    margin: 0 0 1rem 0;
  }

  &__error {
    display: block;
    font-size: 0.875rem;
    color: $error;
    margin-top: 0.25rem;
  }
}

/* Action Buttons */
.pdp-actions {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
}

/* Add to Cart */
.pdp-add-cart {
  flex: 1;
  padding: 0;
  height: 48px;
  font-family: $font-body;
  font-size: 14px;
  font-weight: 700;
  line-height: 48px;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* Wishlist Button */
.pdp-wishlist-btn {
  width: 48px;
  height: 48px;
  background: $bg-card;
  border: 2px solid $border-base;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: $brand-ink;
    transform: scale(1.05);
  }

  &--active {
    background: $color-white;
    border-color: #ef4444;

    .pdp-wishlist-icon {
      color: #ef4444;
    }
  }
}

.pdp-wishlist-icon {
  width: 24px;
  height: 24px;
  color: $brand-ink;
  transition: color 0.2s ease;
}

/* Trust Badges */
.pdp-trust {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  background: $bg-card;
  border: 1px solid $border-base;

  &__item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: $text-primary;

    svg {
      width: 20px;
      height: 20px;
      color: $brand;
      flex-shrink: 0;
    }
  }
}

/* Payment */
.pdp-payment {
  padding-top: 1.5rem;
  border-top: 1px solid $border-base;

  &__label {
    font-size: 0.875rem;
    color: $text-secondary;
    display: block;
    margin-bottom: 0.75rem;
  }

  &__icons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__icon {
    width: 60px;
    height: 40px;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
    cursor: pointer;
    flex-shrink: 0;
    background: $bg-card;
    border: 1px solid $border-base;
    padding: 4px;

    svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    &:hover {
      transform: scale(1.05);
    }
  }
}

/* Info */
.pdp-info {
  padding-top: 1.5rem;
  border-top: 1px solid $border-base;

  &__row {
    font-size: 0.9375rem;
    margin-bottom: 0.5rem;

    strong {
      color: $brand-ink;
      margin-right: 0.5rem;
    }

    span {
      color: $text-secondary;
    }
  }
}

/* Accordion Section - Moonkie Style */
.pdp-accordion {
  padding: 3rem 0;
  background: $bg-page;

  &__item {
    border-bottom: 1px solid $border-base;

    &:first-child {
      border-top: 1px solid $border-base;
    }
  }

  &__trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 0;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      .pdp-accordion__title {
        color: $brand;
      }
    }

    &--open {
      .pdp-accordion__icon {
        transform: rotate(180deg);
      }
    }
  }

  &__title {
    font-family: $font-body;
    font-size: 1.125rem;
    font-weight: 600;
    color: $brand-ink;
    text-align: left;
    transition: color 0.2s;
  }

  &__icon {
    width: 20px;
    height: 20px;
    color: $brand-ink;
    flex-shrink: 0;
    transition: transform 0.2s;
  }

  &__content {
    padding-bottom: 1.5rem;
    font-family: $font-body;
    font-size: 16px;
    font-weight: 400;
    line-height: 27.7px;
    color: #333333;
  }
}

/* Product Description - Markdown Styling */
.pdp-description {
  font-family: $font-body;
  font-size: 16px;
  line-height: 1.7;
  color: $text-primary;

  // Paragraphs
  p {
    margin: 0 0 1rem;
    line-height: 1.7;

    &:last-child {
      margin-bottom: 0;
    }
  }

  // Headings
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: $font-heading;
    font-weight: 600;
    color: $brand-ink;
    margin: 1.5rem 0 0.75rem;
    line-height: 1.4;

    &:first-child {
      margin-top: 0;
    }
  }

  h1 {
    font-size: 1.75rem;
  }

  h2 {
    font-size: 1.5rem;
    border-bottom: 1px solid $border-base;
    padding-bottom: 0.5rem;
  }

  h3 {
    font-size: 1.25rem;
    border-bottom: 1px solid $border-base;
    padding-bottom: 0.5rem;
  }

  h4 {
    font-size: 1.125rem;
  }

  h5,
  h6 {
    font-size: 1rem;
  }

  // Lists
  ul,
  ol {
    margin: 1rem 0 1.5rem;
    padding-left: 1.5rem;
    list-style-position: outside;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  li {
    margin-bottom: 0.5rem;
    line-height: 1.6;

    &:last-child {
      margin-bottom: 0;
    }
  }

  // Text formatting
  strong {
    font-weight: 600;
    color: $brand-ink;
  }

  em {
    font-style: italic;
  }

  u {
    text-decoration: underline;
  }

  // Links
  a {
    color: $brand;
    text-decoration: underline;
    transition: color 0.2s;

    &:hover {
      color: $brand-hover;
    }
  }

  // Blockquote
  blockquote {
    margin: 1rem 0;
    padding: 0.75rem 1rem;
    border-left: 3px solid $brand;
    background: rgba($brand, 0.05);
    font-style: italic;
    color: $text-secondary;
  }

  // Code
  code {
    background: rgba($brand-ink, 0.05);
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
    color: $brand-ink;
  }

  pre {
    background: rgba($brand-ink, 0.05);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;

    code {
      background: none;
      padding: 0;
    }
  }

  // Horizontal rule
  hr {
    border: none;
    border-top: 1px solid $border-base;
    margin: 1.5rem 0;
  }

  // Line breaks
  br {
    display: block;
    margin-bottom: 0.5rem;
  }
}

.pdp-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 0.5rem 0 0.5rem 2rem;
    position: relative;

    &::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: $brand;
      font-weight: 700;
    }
  }
}

.pdp-shipping {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  &__item {
    strong {
      display: block;
      font-weight: 600;
      color: $brand-ink;
      margin-bottom: 0.25rem;
    }

    p {
      margin: 0;
      color: $text-secondary;
      font-size: 0.9375rem;
    }
  }
}

.pdp-faq {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  &__item {
    strong {
      display: block;
      font-weight: 600;
      color: $brand-ink;
      margin-bottom: 0.5rem;
    }

    p {
      margin: 0;
      color: $text-secondary;
      font-size: 0.9375rem;
      line-height: 1.6;
    }
  }
}

/* Reviews Section */
.pdp-reviews-section {
  padding: 2rem 0;
  background: linear-gradient(to bottom, transparent 0%, rgba($brand, 0.02) 100%);

  @include up(lg) {
    padding: 2.5rem 0;
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;

    @include up(lg) {
      flex-direction: row;
      gap: 2rem;
      align-items: flex-start;
    }
  }

  &__stats {
    flex-shrink: 0;

    @include up(lg) {
      width: 280px;
      position: sticky;
      top: 100px;
    }
  }

  &__content {
    flex: 1;
    min-width: 0;
  }
}

.pdp-section-title {
  font-family: $font-heading;
  font-size: 1.75rem;
  color: $brand-ink;
  margin: 0 0 2rem;
}

.pdp-reviews-placeholder {
  background: $bg-card;
  border: 2px dashed $border-base;
  padding: 4rem 2rem;
  text-align: center;

  &__icon {
    width: 64px;
    height: 64px;
    color: $brand;
    margin: 0 auto 1.5rem;
    stroke-width: 1.5;
  }

  h3 {
    font-family: $font-heading;
    font-size: 1.5rem;
    color: $brand-ink;
    margin: 0 0 0.75rem;
  }

  p {
    color: $text-secondary;
    margin: 0;
    font-size: 1rem;
  }
}

/* Spinner */
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid $border-base;
  border-top-color: $brand;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
