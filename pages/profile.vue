<template>
  <div class="profile-page">
    <div class="profile-page__container">
      <h1 class="profile-page__title">Моят профил</h1>

      <div class="profile-card">
        <div class="profile-card__section">
          <h2 class="profile-card__heading">Информация за профила</h2>

          <div class="profile-info">
            <div class="profile-info__item">
              <span class="profile-info__label">Имейл</span>
              <span class="profile-info__value">{{
                authStore.user?.email
              }}</span>
            </div>

            <div class="profile-info__item">
              <span class="profile-info__label">Име</span>
              <span class="profile-info__value">
                {{ authStore.fullName || 'Не е посочено' }}
              </span>
            </div>

            <div class="profile-info__item">
              <span class="profile-info__label">Телефон</span>
              <span class="profile-info__value">
                {{ authStore.user?.phone || 'Не е посочен' }}
              </span>
            </div>

            <div class="profile-info__item">
              <span class="profile-info__label">Роля</span>
              <span class="profile-info__value">
                {{
                  authStore.user?.role === 'admin' ? 'Администратор' : 'Клиент'
                }}
              </span>
            </div>
          </div>

          <p class="profile-card__note">
            💡 Вашето име и телефон ще бъдат попълнени автоматично при първата
            поръчка.
          </p>
        </div>

        <div class="profile-card__divider"></div>

        <!-- Saved Addresses Section -->
        <div class="profile-card__section">
          <h2 class="profile-card__heading">Запазени адреси</h2>

          <div v-if="authStore.user?.addresses?.length" class="addresses-grid">
            <div
              v-for="address in authStore.user.addresses"
              :key="address._id"
              class="address-card"
              :class="{ 'address-card--default': address.isDefault }"
            >
              <div class="address-card__badge-container">
                <span v-if="address.isDefault" class="address-card__badge">
                  По подразбиране
                </span>
                <span 
                  v-if="address.type === 'econt_office'" 
                  class="address-card__type-badge address-card__type-badge--econt"
                >
                  📦 Офис на Еконт
                </span>
                <span 
                  v-else-if="address.type === 'econt_automat'" 
                  class="address-card__type-badge address-card__type-badge--econt"
                >
                  🤖 Еконтомат
                </span>
              </div>
              <p class="address-card__street">{{ address.street }}</p>
              <p class="address-card__city">{{ address.city }}, {{ address.postalCode }}</p>
              <p class="address-card__country">{{ address.country }}</p>
              <p v-if="address.econtOfficeName" class="address-card__econt-name">
                {{ address.econtOfficeName }}
              </p>
            </div>
          </div>
          <p v-else class="profile-card__empty">
            Нямате запазени адреси. Адресите се запазват автоматично при поръчка.
          </p>
        </div>

        <div class="profile-card__divider"></div>

        <div class="profile-card__section">
          <h2 class="profile-card__heading">Бързи действия</h2>

          <div class="profile-actions">
            <NuxtLink to="/profile-edit" class="btn btn--primary btn--large">
              <Icon name="mdi:account-edit" />
              <span>Редактирай профила</span>
            </NuxtLink>

            <NuxtLink to="/orders" class="btn btn--secondary btn--large">
              <Icon name="mdi:package-variant" />
              <span>Моите поръчки</span>
            </NuxtLink>

            <NuxtLink to="/cart" class="btn btn--secondary btn--large">
              <Icon name="mdi:cart-outline" />
              <span>Количка</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

// Middleware to check authentication
definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()

// Refresh user data on mount
onMounted(async () => {
  console.log('[Profile Page] Refreshing user data...')
  await authStore.fetchUser()
  console.log('[Profile Page] User data:', authStore.user)
})

// SEO
useHead({
  title: 'Профил - emWear',
  meta: [
    { name: 'description', content: 'Управлявайте вашия профил в emWear' },
  ],
})
</script>

<style lang="scss" scoped>
@use '~/assets/styles/colors' as *;
@use '~/assets/styles/fonts' as *;
@use '~/assets/styles/breakpoints' as *;

.profile-page {
  min-height: 100vh;
  background: $bg-page;
  padding: 2rem 1rem;

  @include up(md) {
    padding: 3rem 1.5rem;
  }

  &__container {
    max-width: 800px;
    margin: 0 auto;
  }

  &__title {
    font-family: $font-heading;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 2rem;
  }
}

.profile-card {
  background: $bg-card;
  border: 1px solid $border-base;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px $shadow-soft;

  @include up(md) {
    padding: 2.5rem;
  }

  &__section {
    margin-bottom: 2rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__heading {
    font-family: $font-heading;
    font-size: 1.25rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 1.5rem;
  }

  &__divider {
    height: 1px;
    background: $border-base;
    margin: 2rem 0;
  }

  &__note {
    font-family: $font-body;
    font-size: 0.875rem;
    color: $text-secondary;
    margin: 1.5rem 0 0;
    padding: 1rem;
    background: rgba($brand, 0.05);
    border-radius: 8px;
    border-left: 3px solid $brand;
  }
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  &__item {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;

    @include up(sm) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__label {
    font-family: $font-body;
    font-size: 0.875rem;
    font-weight: 500;
    color: $text-secondary;
    min-width: 120px;
  }

  &__value {
    font-family: $font-body;
    font-size: 1rem;
    color: $text-primary;
    font-weight: 500;
  }
}

.addresses-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @include up(md) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.address-card {
  background: $bg-page;
  border: 1px solid $border-base;
  border-radius: 10px;
  padding: 1.25rem;
  position: relative;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &--default {
    border-color: $brand;
    background: rgba($brand, 0.05);
  }

  &__badge-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  &__badge {
    display: inline-block;
    padding: 0.25rem 0.625rem;
    background: $brand;
    color: $brand-ink;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    border-radius: 4px;
    letter-spacing: 0.05em;
  }

  &__type-badge {
    display: inline-block;
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 4px;

    &--econt {
      background: rgba(#B9C6AA, 0.2);
      color: #2F3A2A;
      border: 1px solid #B9C6AA;
    }
  }

  &__street {
    font-family: $font-body;
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 0.375rem;
    font-size: 0.9375rem;
  }

  &__city,
  &__country,
  &__econt-name {
    font-family: $font-body;
    font-size: 0.875rem;
    color: $text-secondary;
    margin: 0.25rem 0 0;
  }

  &__econt-name {
    font-weight: 500;
    color: #2F3A2A;
    font-style: italic;
  }
}

.profile-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @include up(sm) {
    grid-template-columns: repeat(3, 1fr);
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    svg {
      font-size: 1.25rem;
    }
  }
}
</style>
```
