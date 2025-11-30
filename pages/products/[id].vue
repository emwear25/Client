<template>
  <div class="pdp">
    <!-- Loading State -->
    <div v-if="isLoading" class="pdp-loading">
      <div class="container">
        <div class="spinner"></div>
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
                  quality="80"
                />
              </div>
              <div v-if="product.images && product.images.length > 1" class="pdp-gallery__thumbs">
                <button
                  v-for="(img, index) in product.images"
                  :key="index"
                  class="pdp-gallery__thumb"
                  :class="{ 'pdp-gallery__thumb--active': selectedImageIndex === index }"
                  @click="selectImage(index)"
                >
                  <NuxtImg 
                    :src="img.url" 
                    :alt="`${product.name} - ${index + 1}`" 
                    format="webp"
                    quality="60"
                    width="100"
                  />
                </button>
              </div>
            </div>

            <!-- RIGHT: Product Details -->
            <div class="pdp-details">
              <!-- Title & Price -->
              <div class="pdp-header">
                <h1 class="pdp-title">{{ product.name }}</h1>
                
                <!-- Social Share -->
                <div class="pdp-social">
                  <button class="pdp-social__btn" @click="shareOn('facebook')" title="Сподели във Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button class="pdp-social__btn" @click="shareOn('instagram')" title="Сподели в Instagram">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </button>
                  <button class="pdp-social__btn" @click="shareOn('tiktok')" title="Сподели в TikTok">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Reviews Placeholder -->
              <div class="pdp-reviews">
                <div class="pdp-reviews__stars">
                  ★★★★★
                </div>
                <span class="pdp-reviews__count">(Скоро ще добавим отзиви)</span>
              </div>

              <!-- Price -->
              <div class="pdp-price">
                <span class="pdp-price__current">{{ formatPrice(product.price) }}</span>
                <span v-if="product.compareAt" class="pdp-price__old">{{ formatPrice(product.compareAt) }}</span>
              </div>

              <!-- Stock Status -->
              <div v-if="product.stock > 0" class="pdp-stock pdp-stock--in">
                На склад ({{ product.stock }} бр.)
              </div>
              <div v-else class="pdp-stock pdp-stock--out">
                Изчерпан
              </div>

              <!-- Colors -->
              <div v-if="product.colors && product.colors.length" class="pdp-option">
                <label class="pdp-option__label">Цвят: <strong>{{ selectedColor || product.colors[0] }}</strong></label>
                <div class="pdp-option__swatches">
                  <button
                    v-for="color in product.colors"
                    :key="color"
                    class="pdp-swatch"
                    :class="{ 'pdp-swatch--active': selectedColor === color }"
                    :style="{ background: getColorHex(color) }"
                    @click="selectedColor = color"
                    :title="color"
                  />
                </div>
              </div>

              <!-- Sizes -->
              <div v-if="product.sizes && product.sizes.length" class="pdp-option">
                <label class="pdp-option__label">Размер: <strong>{{ selectedSize || product.sizes[0] }}</strong></label>
                <div class="pdp-option__buttons">
                  <button
                    v-for="size in product.sizes"
                    :key="size"
                    class="pdp-option__btn"
                    :class="{ 'pdp-option__btn--active': selectedSize === size }"
                    @click="selectedSize = size"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>

              <!-- Embroidery Customization -->
              <div v-if="product.customEmbroidery && (product.embroideryFonts?.length || product.embroideryColors?.length)" class="pdp-custom">
                <div class="pdp-custom__item">
                  <input
                    type="checkbox"
                    id="embroidery-enable"
                    v-model="embroideryEnabled"
                    class="pdp-custom__checkbox"
                  />
                  <label for="embroidery-enable" class="pdp-custom__label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Бродерия с име (+ 10.00 лв)
                  </label>
                </div>

                <div v-if="embroideryEnabled" class="pdp-custom__fields">
                  <div class="pdp-custom__field">
                    <label class="pdp-custom__field-label">Име за бродерия</label>
                    <input
                      type="text"
                      v-model="embroideryName"
                      placeholder="Въведете име..."
                      class="pdp-custom__input"
                      maxlength="15"
                    />
                  </div>

                  <!-- Font Selection -->
                  <div v-if="product.embroideryFonts && product.embroideryFonts.length" class="pdp-custom__field">
                    <label class="pdp-custom__field-label">Шрифт</label>
                    <div class="pdp-option__buttons">
                      <button
                        v-for="font in product.embroideryFonts"
                        :key="font"
                        class="pdp-option__btn"
                        :class="{ 'pdp-option__btn--active': embroideryFont === font }"
                        @click="embroideryFont = font"
                      >
                        {{ font }}
                      </button>
                    </div>
                  </div>

                  <!-- Color Selection -->
                  <div v-if="product.embroideryColors && product.embroideryColors.length" class="pdp-custom__field">
                    <label class="pdp-custom__field-label">Цвят на бродерията</label>
                    <div class="pdp-option__swatches">
                      <button
                        v-for="color in product.embroideryColors"
                        :key="color.value"
                        class="pdp-swatch"
                        :class="{ 'pdp-swatch--active': embroideryColor === color.value }"
                        :style="{ background: color.value }"
                        @click="embroideryColor = color.value"
                        :title="color.name"
                      >
                        <span class="sr-only">{{ color.name }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="pdp-actions">
                <button
                  class="pdp-add-cart btn btn--primary"
                  :disabled="product.stock === 0"
                  @click="addToCart"
                >
                  {{ product.stock > 0 ? 'Добави в количката' : 'Изчерпан' }}
                </button>
                
                <button
                  class="pdp-wishlist-btn"
                  :class="{ 'pdp-wishlist-btn--active': isInWishlist }"
                  @click="wishlistStore.toggle(product._id)"
                  :title="isInWishlist ? 'Премахни от любими' : 'Добави в любими'"
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
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  <span>Безплатна доставка над 50 лв</span>
                </div>
                <div class="pdp-trust__item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 4 23 10 17 10"/>
                    <polyline points="1 20 1 14 7 14"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                  </svg>
                  <span>Лесно връщане до 30 дни</span>
                </div>
                <div class="pdp-trust__item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span>Безопасни материали</span>
                </div>
              </div>

              <!-- Payment Methods -->
              <div class="pdp-payment">
                <span class="pdp-payment__label">Приемаме:</span>
                <div class="pdp-payment__icons">
                  <span class="pdp-payment__icon">VISA</span>
                  <span class="pdp-payment__icon">Mastercard</span>
                  <span class="pdp-payment__icon">PayPal</span>
                  <span class="pdp-payment__icon">Apple Pay</span>
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
              :class="{ 'pdp-accordion__trigger--open': openSection === 'description' }"
              @click="toggleSection('description')"
            >
              <span class="pdp-accordion__title">Описание</span>
              <svg class="pdp-accordion__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div v-show="openSection === 'description'" class="pdp-accordion__content">
              <p>{{ product.description }}</p>
            </div>
          </div>

          <!-- Materials & Care -->
          <div class="pdp-accordion__item">
            <button 
              class="pdp-accordion__trigger"
              :class="{ 'pdp-accordion__trigger--open': openSection === 'care' }"
              @click="toggleSection('care')"
            >
              <span class="pdp-accordion__title">Материали и грижа</span>
              <svg class="pdp-accordion__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
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
              :class="{ 'pdp-accordion__trigger--open': openSection === 'shipping' }"
              @click="toggleSection('shipping')"
            >
              <span class="pdp-accordion__title">Доставка и връщане</span>
              <svg class="pdp-accordion__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div v-show="openSection === 'shipping'" class="pdp-accordion__content">
              <div class="pdp-shipping">
                <div class="pdp-shipping__item">
                  <strong>Безплатна доставка</strong>
                  <p>За поръчки над 50 лв с Еконт или Спиди</p>
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
              <svg class="pdp-accordion__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
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
                  <p>Персонализираните продукти могат да бъдат върнати само при производствен дефект</p>
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

      <!-- Reviews Section (Placeholder) -->
      <section class="pdp-reviews-section">
        <div class="container">
          <h2 class="pdp-section-title">Отзиви на клиенти</h2>
          <div class="pdp-reviews-placeholder">
            <svg class="pdp-reviews-placeholder__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <h3>Скоро ще добавим система за отзиви!</h3>
            <p>Бъдете първите, които ще споделят мнението си за този продукт.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '#app'
import { useCartStore } from '~/stores/cart'
import { useWishlist } from '~/stores/useWishlist'

interface ProductImage {
  url: string
  publicId: string
}

interface EmbroideryColor {
  name: string
  value: string
}

interface Product {
  _id: string
  slug?: string
  name: string
  description: string
  price: number
  compareAt?: number | null
  category: string | {
    _id: string
    name: string
    defaultWeight: number
    defaultDimensions: {
      length: number
      width: number
      height: number
    }
  }
  sizes: string[]
  colors: string[]
  images?: ProductImage[]
  stock: number
  weight?: number // Weight in kg for shipping
  isActive: boolean
  customEmbroidery?: boolean
  embroideryFonts?: string[]
  embroideryColors?: EmbroideryColor[]
  createdAt: string
}

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlist()

// State
const product = ref<Product | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Selection state
const selectedImageIndex = ref(0)
const selectedColor = ref<string>('')
const selectedSize = ref<string>('')

// Embroidery state
const embroideryEnabled = ref(false)
const embroideryName = ref('')
const embroideryColor = ref('')
const embroideryFont = ref('')

// Accordion state
const openSection = ref<string>('description')

// Wishlist computed
const isInWishlist = computed(() => product.value ? wishlistStore.ids.includes(product.value._id) : false)

// Computed
const selectedImage = computed(() => {
  if (!product.value?.images) return null
  return product.value.images[selectedImageIndex.value]
})

// Methods
const selectImage = (index: number) => {
  selectedImageIndex.value = index
}

const formatPrice = (price?: number | null) => {
  if (price == null) return ''
  return `${price.toFixed(2)} лв.`
}

const formatCategory = (category: string | { name: string } | undefined) => {
  if (!category) return ''
  const categoryName = typeof category === 'string' ? category : category.name
  const map: Record<string, string> = {
    't-shirts': 'Тениски',
    'hoodies': 'Суитчъри',
    'sweatshirts': 'Блузи',
    'bags': 'Чанти',
    'accessories': 'Аксесоари',
  }
  return map[categoryName] || categoryName
}

const getColorHex = (color: string) => {
  const colorMap: Record<string, string> = {
    'червен': '#EF4444',
    'червено': '#EF4444',
    'син': '#3B82F6',
    'синьо': '#3B82F6',
    'зелен': '#10B981',
    'зелено': '#10B981',
    'жълт': '#F59E0B',
    'жълто': '#F59E0B',
    'бял': '#F9FAFB',
    'бяло': '#F9FAFB',
    'черен': '#1F2937',
    'черно': '#1F2937',
    'розов': '#EC4899',
    'розово': '#EC4899',
    'сив': '#6B7280',
    'синьо': '#3B82F6',
  }
  return colorMap[color.toLowerCase()] || '#9CA3AF'
}

const toggleSection = (section: string) => {
  openSection.value = openSection.value === section ? '' : section
}

const shareOn = (platform: string) => {
  const url = window.location.href
  const title = product.value?.name || 'Продукт от emWear'
  const toast = useToast()

  switch (platform) {
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
      break
    case 'instagram':
      // Instagram doesn't support direct URL sharing, so copy to clipboard
      navigator.clipboard.writeText(url)
      toast.success('Линкът е копиран! Споделете го в Instagram Stories или Bio.')
      break
    case 'tiktok':
      // TikTok doesn't support direct URL sharing, so copy to clipboard
      navigator.clipboard.writeText(url)
      toast.success('Линкът е копиран! Споделете го в TikTok Bio или видео описание.')
      break
  }
}

const addToCart = () => {
  if (!product.value) return

  // Calculate final price (add embroidery cost if enabled)
  let finalPrice = product.value.price
  if (embroideryEnabled.value) {
    finalPrice += 10.00 // Embroidery cost
  }

  // Add to cart
  cartStore.addItem({
    id: product.value._id,
    name: product.value.name,
    price: finalPrice,
    image: product.value.images?.[0]?.url,
    size: selectedSize.value,
    color: selectedColor.value,
    weight: product.value.weight || 0.5, // Include weight for shipping calculation
    category: typeof product.value.category === 'object' ? product.value.category : undefined // Include category for shipping
  }, 1)

  // Show success toast
  const toast = useToast()
  toast.success(`${product.value.name} е добавен в количката!`, 3000)
  
  // Navigate to cart after a short delay
  setTimeout(() => {
    router.push('/cart')
  }, 1000)
}

const fetchProduct = async () => {
  const id = route.params.id
  isLoading.value = true
  error.value = null

  try {
    const response = await fetch(`http://127.0.0.1:3030/api/products/${id}`)

    if (!response.ok) {
      throw new Error('Продуктът не е намерен')
    }

    const data = await response.json()
    product.value = data.data

    // Set defaults
    if (product.value) {
      selectedColor.value = product.value.colors[0] || ''
      selectedSize.value = product.value.sizes[0] || ''
      
      // Set default embroidery options
      if (product.value.embroideryFonts && product.value.embroideryFonts.length) {
        embroideryFont.value = product.value.embroideryFonts[0]
      }
      if (product.value.embroideryColors && product.value.embroideryColors.length) {
        embroideryColor.value = product.value.embroideryColors[0].value
      }

      useHead({
        title: `${product.value.name} - emWear`,
        meta: [
          { name: 'description', content: product.value.description }
        ]
      })
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Възникна грешка'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProduct()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/colors' as *;
@use '@/assets/styles/breakpoints' as *;
@use '@/assets/styles/fonts' as *;

/* PDP - Moonkie-style Product Detail Page */

.pdp {
  background: $bg-page;
  min-height: 100vh;
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
  gap: 1.5rem;
}

.pdp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.pdp-title {
  font-family: $font-heading;
  font-size: 36px;
  font-weight: 300;
  line-height: 40px;
  color: rgb(51, 51, 51);
  letter-spacing: -0.8px;
  margin: 0;
  flex: 1;

  @media (max-width: 767px) {
    font-size: 28px;
    line-height: 32px;
    letter-spacing: -0.6px;
  }
}

/* Social Share */
.pdp-social {
  display: flex;
  gap: 0.5rem;

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
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &__stars {
    color: #F59E0B;
    font-size: 1.125rem;
  }

  &__count {
    color: $text-secondary;
    font-size: 0.875rem;
  }
}

/* Price */
.pdp-price {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin: 0.5rem 0 1rem;

  &__current {
    font-family: $font-body;
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    color: rgb(51, 51, 51);
  }

  &__old {
    font-family: $font-body;
    font-size: 18px;
    font-weight: 400;
    line-height: 28px;
    color: rgb(145, 123, 105);
    text-decoration: line-through;
  }
}

/* Stock */
.pdp-stock {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;

  &--in {
    background: rgba(#10B981, 0.1);
    color: #10B981;
  }

  &--out {
    background: rgba(#EF4444, 0.1);
    color: #EF4444;
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
    color: rgb(51, 51, 51);
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
  padding: 1.25rem;

  &__item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__checkbox {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;

    svg {
      width: 18px;
      height: 18px;
      color: $brand;
    }
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
    padding: 0.75rem;
    border: 1px solid $border-base;
    font-family: $font-body;
    font-size: 0.9375rem;

    &:focus {
      outline: none;
      border-color: $brand;
    }
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
    border-color: #EF4444;
    
    .pdp-wishlist-icon {
      color: #EF4444;
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
    padding: 0.375rem 0.75rem;
    background: $bg-card;
    border: 1px solid $border-base;
    font-size: 0.75rem;
    font-weight: 600;
    color: $text-secondary;
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
    color: rgb(51, 51, 51);
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
      content: '✓';
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
  padding: 3rem 0;
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
  to { transform: rotate(360deg); }
}
</style>

