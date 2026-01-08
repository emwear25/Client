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
                <div class="pdp-price__main">
                  <span class="pdp-price__current">{{ formatPrice(currentPrice) }}</span>
                  <span class="pdp-price__vat">(вкл. 20% ДДС)</span>
                </div>
                <div class="pdp-price__discount">
                  <span
                    v-if="
                      (product.compareAt || product.originalPrice) &&
                      (product.compareAt || product.originalPrice) > currentPrice
                    "
                    class="pdp-price__old"
                    >{{ formatPrice(product.compareAt || product.originalPrice) }}</span
                  >
                  <span
                    v-if="
                      (product.compareAt || product.originalPrice) &&
                      (product.compareAt || product.originalPrice) > currentPrice
                    "
                    class="pdp-price__badge"
                  >
                    Спести
                    {{ saveAmount.toFixed(2) }} лв
                  </span>
                </div>
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
                    v-for="size in sortedSizes"
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
                  
                  <!-- Standard Name Field (shows if no NON-checkbox category-specific fields) -->
                  <div v-if="personalizationFields.filter(f => f.type !== 'checkbox').length === 0" class="pdp-custom__field">
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
                  
                  <!-- Category-Specific Personalization Fields (e.g., birth details for гергефи) -->
                  <template v-if="personalizationFields.length > 0">
                    <div 
                      v-for="field in personalizationFields.filter(f => f.type !== 'checkbox')" 
                      :key="field.name" 
                      class="pdp-custom__field"
                    >
                      <label class="pdp-custom__field-label">
                        {{ field.label }}
                        <span v-if="field.required" class="pdp-custom__required">*</span>
                      </label>
                      
                      <!-- Text input -->
                      <input
                        v-if="field.type === 'text' || field.type === 'number'"
                        v-model="customFields[field.name]"
                        :type="field.type"
                        :placeholder="field.placeholder"
                        class="pdp-custom__input"
                        :class="{ 'pdp-custom__input--error': customFieldErrors[field.name] }"
                        @blur="validateEmbroidery"
                      />
                      
                      <!-- Date input -->
                      <input
                        v-else-if="field.type === 'date'"
                        v-model="customFields[field.name]"
                        type="date"
                        class="pdp-custom__input"
                        :class="{ 'pdp-custom__input--error': customFieldErrors[field.name] }"
                        @blur="validateEmbroidery"
                      />
                      
                      <!-- Time input -->
                      <input
                        v-else-if="field.type === 'time'"
                        v-model="customFields[field.name]"
                        type="time"
                        :placeholder="field.placeholder"
                        class="pdp-custom__input"
                        :class="{ 'pdp-custom__input--error': customFieldErrors[field.name] }"
                        @blur="validateEmbroidery"
                      />
                      
                      <!-- Textarea -->
                      <textarea
                        v-else-if="field.type === 'textarea'"
                        v-model="customFields[field.name]"
                        :placeholder="field.placeholder"
                        rows="3"
                        class="pdp-custom__input pdp-custom__textarea"
                        :class="{ 'pdp-custom__input--error': customFieldErrors[field.name] }"
                        @blur="validateEmbroidery"
                      />
                      
                      <span v-if="customFieldErrors[field.name]" class="pdp-custom__error">
                        {{ customFieldErrors[field.name] }}
                      </span>
                    </div>
                  </template>
                  
                  <!-- Checkbox fields with price (separate section) -->
                  <div 
                    v-for="field in personalizationFields.filter(f => f.type === 'checkbox')" 
                    :key="field.name" 
                    class="pdp-custom__checkbox-field"
                  >
                    <label class="pdp-custom__checkbox-label">
                      <input
                        type="checkbox"
                        :checked="customFields[field.name] === true"
                        class="pdp-custom__checkbox-input"
                        @change="customFields[field.name] = ($event.target as HTMLInputElement).checked"
                      />
                      <span class="pdp-custom__checkbox-text">
                        {{ field.label }}
                        <span v-if="field.price" class="pdp-custom__checkbox-price">+{{ field.price.toFixed(2) }} лв.</span>
                      </span>
                    </label>
                  </div>
                  
                  <!-- General Notes Field (always visible) -->
                  <div class="pdp-custom__field pdp-custom__field--notes">
                    <label class="pdp-custom__field-label">
                      Специални инструкции 
                      <span class="pdp-custom__optional">(по желание)</span>
                    </label>
                    <textarea
                      v-model="embroideryNotes"
                      placeholder="Въведете специални пожелания или инструкции..."
                      rows="2"
                      class="pdp-custom__input pdp-custom__textarea"
                      maxlength="200"
                    />
                    <span class="pdp-custom__char-count">{{ embroideryNotes.length }}/200</span>
                  </div>
                </div>
              </div>

              <!-- Custom Design Notice -->
              <div v-if="product.customEmbroidery" class="pdp-custom-notice">
                <div class="pdp-custom-notice__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div class="pdp-custom-notice__content">
                  <p class="pdp-custom-notice__text">
                    <strong>Искате индивидуален дизайн?</strong> Свържете се с нас в 
                    <a href="https://m.me/emwearbg" target="_blank" rel="noopener" class="pdp-custom-notice__link">
                      Messenger
                    </a> или 
                    <a href="https://www.instagram.com/emwear.bg/" target="_blank" rel="noopener" class="pdp-custom-notice__link">
                      Instagram
                    </a>. Или на телефон 
                    <a href="tel:+359890927520" class="pdp-custom-notice__link">
                      +359 890 927 520
                    </a>
                  </p>
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
                  <span>Безплатна доставка над €56 (110 лв)</span>
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
                    <img src="/img/payments/visa.png" alt="VISA" width="60" height="40" />
                  </div>
                  <div class="pdp-payment__icon pdp-payment__icon--mastercard" title="Mastercard">
                    <img src="/img/payments/card.png" alt="Mastercard" width="60" height="40" />
                  </div>
                  <div class="pdp-payment__icon pdp-payment__icon--applepay" title="Apple Pay">
                    <img src="/img/payments/apple-pay.png" alt="Apple Pay" width="60" height="40" />
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
                  <p>За поръчки над €56 (110 лв) с Еконт или Спиди</p>
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
import { ref, computed, watchEffect, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";
import { useWishlist } from "~/stores/useWishlist";
import { useApi } from "~/composables/useApi";
import { useProductSEO } from "~/composables/useSEO";
import { useBreadcrumbs } from "~/composables/useBreadcrumbs";
import { useMarkdown } from "~/composables/useMarkdown";
import { useCurrency } from "~/composables/useCurrency";
import ReviewStats from "~/components/reviews/ReviewStats.vue";
import ProductReviews from "~/components/reviews/ProductReviews.vue";
import ReviewForm from "~/components/reviews/ReviewForm.vue";
import RelatedProducts from "~/components/products/RelatedProducts.vue";
import Modal from "~/components/common/Modal.vue";
import { useFacebookPixel } from "~/composables/useFacebookPixel";

const { formatDualPrice, bgnToEur, formatEur } = useCurrency();

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
  originalPrice?: number | null;
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
const embroideryNotes = ref(""); // General notes/instructions field
const customFields = ref<Record<string, string | boolean>>({}); // Category-specific fields (e.g., birth details, checkbox options)
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
}); // Validation errors for custom fields

// Computed: Get personalization fields from category
const personalizationFields = computed(() => {
  if (!product.value?.category || typeof product.value.category !== 'object') return [];
  const category = product.value.category as any;
  return category.personalizationFields || [];
});

// Validation for embroidery
const validateEmbroidery = () => {
  let isValid = true;
  
  // Get non-checkbox personalization fields
  const nonCheckboxFields = personalizationFields.value.filter((f: any) => f.type !== 'checkbox');
  
  // Validate embroideryName if there are NO non-checkbox category-specific personalization fields
  // (i.e., category has only checkbox optionals or no fields at all)
  if (embroideryEnabled.value && nonCheckboxFields.length === 0 && !embroideryName.value.trim()) {
    embroideryError.value = "Това поле е задължително.";
    isValid = false;
  } else {
    embroideryError.value = "";
  }
  
  // Validate custom fields (skip checkbox fields - they're optional by nature)
  customFieldErrors.value = {};
  if (embroideryEnabled.value) {
    nonCheckboxFields.forEach((field: any) => {
      // All non-checkbox fields are required when embroidery is enabled
      const value = customFields.value[field.name];
      if (!value || (typeof value === 'string' && !value.trim())) {
        customFieldErrors.value[field.name] = "Това поле е задължително.";
        isValid = false;
      }
    });
  }
  
  return isValid;
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

// ===== SSR DATA FETCHING =====
// Fetch product data on server-side for SEO and Facebook crawlers
// Support both slug and ID (with 301 redirect from ID to slug)
const identifier = route.params.slug as string;
const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);

const { data: productData, error: fetchError } = await useAsyncData(
  `product-${identifier}`,
  async () => {
    const api = useApi();
    let response;

    // Fetch by ID or slug
    if (isObjectId) {
      // Fetch by ID
      response = await api.get(`products/${identifier}`);
    } else {
      // Fetch by slug
      response = await api.get(`products/slug/${identifier}`);
    }
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Product not found');
  },
  {
    server: true,
    lazy: false,
  }
);

// If fetched by ID and product has slug, redirect to slug URL (301)
if (productData.value && isObjectId && productData.value.slug) {
  await navigateTo(`/products/${productData.value.slug}`, {
    redirectCode: 301,
    external: false,
  });
}

// Set product from server data
if (productData.value) {
  product.value = productData.value;
  isLoading.value = false;
  
  // Auto-select single color
  if (product.value.colors && product.value.colors.length === 1) {
    const firstColor = product.value.colors[0];
    if (firstColor) {
      const colorName = typeof firstColor === 'string' ? firstColor : firstColor.name;
      selectedColor.value = colorName || '';
    }
  }
  
  // Auto-select first size
  if (product.value.sizes && product.value.sizes.length > 0) {
    selectedSize.value = product.value.sizes[0];
  }

  // Set default embroidery options
  if (product.value.embroideryFonts && product.value.embroideryFonts.length > 0) {
    embroideryFont.value = product.value.embroideryFonts[0] || '';
  }
  if (product.value.embroideryColors && product.value.embroideryColors.length > 0) {
    const firstColor = product.value.embroideryColors[0];
    embroideryColor.value = firstColor?.value || '';
  }

  // Load review stats if available
  if (product.value?.reviewStats) {
    reviewStats.value = {
      averageRating: product.value.reviewStats.averageRating || 0,
      totalReviews: product.value.reviewStats.totalReviews || 0,
      ratingDistribution: product.value.reviewStats.ratingDistribution || {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      },
    };
  }
} else if (fetchError.value) {
  error.value = fetchError.value.message || 'Product not found';
  isLoading.value = false;
}

// ===== FACEBOOK PIXEL TRACKING =====
// Initialize Facebook Pixel tracking (client-side only)
const { trackViewContent, trackAddToCart: fbTrackAddToCart } = useFacebookPixel();

// Track ViewContent on client-side when product page loads
onMounted(() => {
  if (product.value) {
    // Get category name for tracking
    const categoryName = typeof product.value.category === 'object' 
      ? product.value.category.name 
      : product.value.category || '';
    
    // Track ViewContent event for Facebook Pixel
    trackViewContent({
      id: product.value._id,
      name: product.value.name,
      price: currentPrice.value,
      category: categoryName,
    });
  }
});

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

const isSale = computed(() => {
  if (!product.value) return false;
  const originalPrice = product.value.compareAt || product.value.originalPrice;
  return originalPrice != null && originalPrice > currentPrice.value;
});

const savePercent = computed(() => {
  if (!product.value) return 0;
  const originalPrice = product.value.compareAt || product.value.originalPrice;
  if (!originalPrice || originalPrice <= currentPrice.value) return 0;
  return Math.round(100 - (currentPrice.value / originalPrice) * 100);
});

const saveAmount = computed(() => {
  if (!product.value) return 0;
  const originalPrice = product.value.compareAt || product.value.originalPrice;
  if (!originalPrice || originalPrice <= currentPrice.value) return 0;
  return originalPrice - currentPrice.value;
});

const badges = computed(() => {
  const arr: Array<{ key: string; label: string }> = [];
  if (isNew.value) arr.push({ key: "new", label: "Ново" });
  if (product.value?.customEmbroidery) arr.push({ key: "personal", label: "Персонализация" });
  if (isSale.value) arr.push({ key: "sale", label: `${savePercent.value}% Отстъпка` });
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
  return formatDualPrice(price);
};

// Sort sizes in correct order: months first, then years
const sortedSizes = computed(() => {
  if (!product.value?.sizes) return [];
  
  const sizes = [...product.value.sizes];
  
  return sizes.sort((a, b) => {
    // Extract numbers and units from size strings
    // Format: "6-12(м)" or "3-4(г)"
    const parseSize = (size: string) => {
      const match = size.match(/(\d+)-(\d+)\(([мг])\)/);
      if (!match) return { start: 0, end: 0, unit: '' };
      return {
        start: parseInt(match[1]),
        end: parseInt(match[2]),
        unit: match[3] // 'м' for months, 'г' for years
      };
    };
    
    const sizeA = parseSize(a);
    const sizeB = parseSize(b);
    
    // Sort by unit first (months before years)
    if (sizeA.unit !== sizeB.unit) {
      return sizeA.unit === 'м' ? -1 : 1;
    }
    
    // Then sort by start number
    return sizeA.start - sizeB.start;
  });
});

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

  // Calculate final price (use variant price or base price + priced options)
  const finalPrice = currentPrice.value + pricedOptionsTotal.value;

  // Build priced options array for checked checkboxes with prices
  const pricedOptions = personalizationFields.value
    .filter((f: any) => f.type === 'checkbox' && f.price && customFields.value[f.name] === true)
    .map((f: any) => ({ name: f.name, label: f.label, price: f.price }));

  // Prepare embroidery data if enabled
  const embroidery = embroideryEnabled.value
    ? {
        name: embroideryName.value.trim() || undefined,
        color: embroideryColor.value || undefined,
        font: embroideryFont.value || undefined,
        notes: embroideryNotes.value.trim() || undefined,
        // Include category-specific custom fields (e.g., birth details)
        customFields: Object.keys(customFields.value).length > 0 
          ? { ...customFields.value }
          : undefined,
        // Include priced options (checkboxes with prices)
        pricedOptions: pricedOptions.length > 0 ? pricedOptions : undefined,
        optionsTotal: pricedOptionsTotal.value > 0 ? pricedOptionsTotal.value : undefined,
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

  // Track AddToCart event for Facebook Pixel
  fbTrackAddToCart({
    id: product.value._id,
    name: product.value.name,
    price: finalPrice,
    quantity: 1,
  });

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

// ===== FACEBOOK CATALOG META TAGS =====
watchEffect(() => {
  if (!product.value) return;

  const productImage = product.value.images && product.value.images.length > 0
    ? product.value.images[0].url
    : '/img/placeholder-product.jpg';

  const productDescription = product.value.description
    ? product.value.description.substring(0, 200).replace(/<[^>]*>/g, '')
    : `Персонализиран ${product.value.name} от emWear`;

  const availability = currentStock.value > 0 ? 'in stock' : 'out of stock';

  useHead({
    title: product.value.name,
    link: [
      // Dynamic canonical per product page (SEO best practice)
      { rel: 'canonical', href: `https://emwear.bg/products/${product.value.slug || product.value._id}` },
    ],
    meta: [
      // Open Graph / Facebook (Shopify-style)
      // Note: og:site_name, og:locale set globally in nuxt.config.ts
      { property: 'og:type', content: 'product' },
      { property: 'og:title', content: product.value.name },
      { property: 'og:description', content: productDescription },
      { property: 'og:image', content: productImage },
      { property: 'og:image:secure_url', content: productImage },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: product.value.name },
      { property: 'og:url', content: `https://emwear.bg/products/${product.value.slug || product.value._id}` },
      
      // Open Graph Product Price (og: prefix for wider compatibility)
      { property: 'og:price:amount', content: currentPrice.value.toFixed(2) },
      { property: 'og:price:currency', content: 'BGN' },
      
      // Facebook Product Catalog - Critical Tags
      { property: 'product:brand', content: 'emWear' },
      { property: 'product:availability', content: availability },
      { property: 'product:condition', content: 'new' },
      { property: 'product:price:amount', content: currentPrice.value.toFixed(2) },
      { property: 'product:price:currency', content: 'BGN' },
      { property: 'product:retailer_item_id', content: product.value._id },
      { property: 'product:category', content: formatCategory(product.value.category) },
      // Google Product Category for Facebook Product Catalog
      ...(typeof product.value.category === 'object' && (product.value.category as any).googleProductCategory
        ? [{ property: 'product:google_product_category', content: (product.value.category as any).googleProductCategory }]
        : []),
      
      // Twitter Card - title/description/image override globals for this product
      // Note: twitter:card and twitter:site set globally in nuxt.config.ts
      { name: 'twitter:title', content: product.value.name },
      { name: 'twitter:description', content: productDescription },
      { name: 'twitter:image', content: productImage },
      { name: 'twitter:image:alt', content: product.value.name },
      
      // Standard meta
      { name: 'description', content: productDescription },
    ],
  });

  // Set breadcrumbs
  const categoryName = formatCategory(product.value.category);
  const categorySlug = typeof product.value.category === 'object' 
    ? (product.value.category as any).slug 
    : undefined;

  const breadcrumbItems = [
    { name: 'Начало', url: '/' },
    { name: 'Продукти', url: '/products' },
  ];

  if (categoryName !== 'Продукти' && categorySlug) {
    breadcrumbItems.push({ name: categoryName, url: `/category/${categorySlug}` });
  }

  breadcrumbItems.push({
    name: product.value.name,
    url: `/products/${product.value.slug || product.value._id}`,
  });

  useBreadcrumbs(breadcrumbItems);
});

// ===== ENHANCED GOOGLE SCHEMA.ORG PRODUCT DATA =====
// SEO Benefit: Rich product cards in Google with price, stars, availability, shipping
const productSchema = computed(() => {
  if (!product.value) return null;

  // Map availability to Schema.org format
  const availabilityMap: Record<string, string> = {
    'in stock': 'https://schema.org/InStock',
    'out of stock': 'https://schema.org/OutOfStock',
    'preorder': 'https://schema.org/PreOrder',
    'discontinued': 'https://schema.org/Discontinued',
    'limited availability': 'https://schema.org/LimitedAvailability',
  };

  const availability = currentStock.value > 0 ? 'in stock' : 'out of stock';
  const schemaAvailability = availabilityMap[availability] || 'https://schema.org/InStock';

  // Base product schema
  const schema: any = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.value.name,
    description: product.value.description
      ? product.value.description.substring(0, 500).replace(/<[^>]*>/g, '').trim()
      : `Персонализиран ${product.value.name} от emWear`,
    image: product.value.images && product.value.images.length > 0
      ? product.value.images.map((img: any) => img.url)
      : ['https://emwear.bg/img/placeholder-product.jpg'],
    brand: {
      '@type': 'Brand',
      name: 'emWear',
    },
    offers: {
      '@type': 'Offer',
      url: `https://emwear.bg/products/${product.value.slug || product.value._id}`,
      priceCurrency: 'BGN',
      price: currentPrice.value.toFixed(2),
      availability: schemaAvailability,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'emWear',
      },
      // Merchant Return Policy (Google recommendation)
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'BG',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      // Note: shippingDetails removed - free shipping only applies over 110 лв
      // Including conditional shipping in schema is complex; rely on on-page copy instead
    },
    // Use internal product ID as SKU (valid) - do NOT include fake GTIN/MPN
    sku: product.value._id,
  };

  // Add aggregate rating ONLY if real reviews exist (Google strict policy)
  if (reviewStats.value && reviewStats.value.totalReviews > 0 && reviewStats.value.averageRating > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: reviewStats.value.averageRating.toFixed(1),
      reviewCount: reviewStats.value.totalReviews,
      bestRating: '5',
      worstRating: '1',
    };
  }

  return schema;
});

// Inject schema into head
watchEffect(() => {
  if (!productSchema.value) return;

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(productSchema.value),
      },
    ],
  });
});

// ===== FAQ SCHEMA =====
// SEO Benefit: FAQ rich results in Google for product questions
const faqSchema = computed(() => {
  if (!product.value) return null;

  // Common FAQ questions for personalized products
  const faqItems = [
    {
      "@type": "Question",
      name: "Колко време отнема изработката на персонализиран продукт?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Изработката на персонализиран продукт с бродерия обикновено отнема 1-2 работни дни. След това доставката е в рамките на 1-3 работни дни в зависимост от избрания куриер."
      }
    },
    {
      "@type": "Question",
      name: "Мога ли да избера свой собствен шрифт за бродерията?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Предлагаме богат избор от шрифтове за бродерия, от които можете да изберете. При поръчка ще имате възможност да видите как изглежда вашият текст в различни стилове."
      }
    },
    {
      "@type": "Question",
      name: "Как да се грижа за продукта с бродерия?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Препоръчваме пране при 30-40°C на деликатен режим. Избягвайте използването на белина и сушене в сушилня. Бродерията е издръжлива и запазва качеството си при правилна грижа."
      }
    },
    {
      "@type": "Question",
      name: "Предлагате ли безплатна доставка?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Да, предлагаме безплатна доставка за поръчки над 110 лв. За поръчки под тази сума, доставката се заплаща според тарифите на избрания куриер."
      }
    }
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems
  };
});

// Inject FAQ schema
watchEffect(() => {
  if (!faqSchema.value) return;

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(faqSchema.value),
      },
    ],
  });
});

// ===== BREADCRUMB SCHEMA =====
// SEO Benefit: Shows navigation path in Google search results
const breadcrumbSchema = computed(() => {
  if (!product.value) return null;

  const items: any[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Начало",
      item: "https://emwear.bg"
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Продукти",
      item: "https://emwear.bg/products"
    }
  ];

  // Add category if exists
  if (typeof product.value.category === 'object' && product.value.category?.slug) {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: product.value.category.name,
      item: `https://emwear.bg/category/${product.value.category.slug}`
    });
    
    items.push({
      "@type": "ListItem",
      position: 4,
      name: product.value.name,
      item: `https://emwear.bg/products/${product.value.slug || product.value._id}`
    });
  } else {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: product.value.name,
      item: `https://emwear.bg/products/${product.value.slug || product.value._id}`
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items
  };
});

// Inject breadcrumb schema
watchEffect(() => {
  if (!breadcrumbSchema.value) return;

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(breadcrumbSchema.value),
      },
    ],
  });
});

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

// SSR data fetching is now handled above with useAsyncData
// No need for onMounted - data is loaded on server
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

  &--sale {
    background: #dc4f3e;
    color: $color-white;
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
  flex-direction: column;
  gap: 0.5rem;
}

.pdp-price__main {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pdp-price__vat {
  font-size: 0.875rem;
  color: $text-secondary;
  font-weight: 400;
}

.pdp-price__discount {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem 1rem;
    
    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
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
    grid-column: 1 / -1; // Span full width so fields appear below
  }

  &__error {
    display: block;
    font-size: 0.875rem;
    color: $error;
    margin-top: 0.25rem;
  }
  
  &__required {
    color: $error;
    font-weight: 600;
  }
  
  &__optional {
    color: #888;
    font-weight: 400;
    font-size: 0.85em;
  }
  
  &__textarea {
    resize: vertical;
    min-height: 60px;
    font-family: inherit;
  }
  
  &__char-count {
    display: block;
    text-align: right;
    font-size: 0.75rem;
    color: #888;
    margin-top: 0.25rem;
  }
  
  &__field--notes {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px dashed #e0e0e0;
    grid-column: 1 / -1;
  }
  
  &__checkbox-field {
    grid-column: 1 / -1;
    margin-top: 0.75rem;
    padding: 0.875rem 1rem;
    background: linear-gradient(135deg, rgba(#6c8474, 0.08) 0%, rgba(#6c8474, 0.03) 100%);
    border: 1px solid rgba(#6c8474, 0.2);
    border-radius: 8px;
    transition: all 0.2s ease;
    
    &:hover {
      border-color: rgba(#6c8474, 0.4);
      background: linear-gradient(135deg, rgba(#6c8474, 0.12) 0%, rgba(#6c8474, 0.05) 100%);
    }
  }
  
  &__checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    font-size: 0.9375rem;
    color: $brand-ink;
  }
  
  &__checkbox-input {
    width: 20px;
    height: 20px;
    accent-color: #6c8474;
    cursor: pointer;
    flex-shrink: 0;
  }
  
  &__checkbox-text {
    flex: 1;
    font-weight: 500;
  }
  
  &__checkbox-price {
    display: inline-block;
    margin-left: 0.5rem;
    padding: 0.2rem 0.6rem;
    background: #6c8474;
    color: white;
    font-size: 0.8125rem;
    font-weight: 700;
    border-radius: 4px;
  }
}

/* Custom Design Notice */
.pdp-custom-notice {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba($brand, 0.06) 0%, rgba($brand, 0.03) 100%);
  border-left: 3px solid $brand;
  border-radius: 6px;
  margin-top: 1.25rem;

  &__icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: $brand;
    margin-top: 2px;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &__content {
    flex: 1;
  }

  &__text {
    font-size: 0.875rem;
    line-height: 1.5;
    color: $text-primary;
    margin: 0;

    strong {
      color: $brand-ink;
      font-weight: 600;
    }
  }

  &__link {
    color: $brand;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;

    &:hover {
      text-decoration: underline;
      color: darken($brand, 10%);
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
