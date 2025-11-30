<template>
  <div class="topbar">
    <div class="topbar__container">
      <div class="topbar__content">
        <!-- Left side - Shipping info -->
        <div class="topbar__left">
          <span class="topbar__info">
            Безплатна доставка над 50лв
          </span>
        </div>

        <!-- Center - Main promotional text -->
        <div class="topbar__center">
          <span class="topbar__promo">
            Ръчно бродирани изделия с любов ✨
          </span>
        </div>

        <!-- Right side - Contact or extra info -->
        <div class="topbar__right">
          <span class="topbar__contact">
            <!-- Can add contact info if needed -->
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed for this static component
</script>

<style scoped lang="scss">
@use '~/assets/styles/colors' as *;
@use '~/assets/styles/breakpoints' as *;
@use '~/assets/styles/fonts' as *;

.topbar {
  background: $bg-page;
  border-bottom: 1px solid $border-base;
  font-family: $font-body;
  font-size: 0.875rem;

  &__container {
    width: 100%;
    margin-inline: auto;
    padding-inline: 16px;

    @include up(md) { 
      max-width: 960px; 
      padding-inline: 20px; 
    }
    @include up(lg) { 
      max-width: 1280px; 
      padding-inline: 24px; 
    }
    @include up(xl) { 
      max-width: 1440px; 
      padding-inline: 32px; 
    }
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    min-height: 40px;
    gap: 1rem;

    @media (max-width: 767px) {
      grid-template-columns: 1fr;
      justify-items: center;
    }
  }

  &__left {
    @media (max-width: 767px) {
      display: none;
    }
  }

  &__center {
    text-align: center;
  }

  &__right {
    text-align: right;

    @media (max-width: 767px) {
      display: none;
    }
  }

  &__info {
    color: $text-secondary;
    font-weight: 500;
    font-size: 0.8125rem;

    @media (max-width: 767px) {
      font-size: 0.75rem;
    }
  }

  &__promo {
    color: $brand-ink;
    font-weight: 500;
    font-family: $font-heading;
    font-size: 0.9375rem;
    letter-spacing: 0.01em;

    @media (max-width: 767px) {
      font-size: 0.875rem;
    }
  }

  &__contact {
    color: $text-secondary;
    font-size: 0.8125rem;
  }
}
</style>
