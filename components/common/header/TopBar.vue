<template>
  <div class="topbar">
    <div class="topbar__container">
      <!-- Left side - Shipping info -->
      <div class="topbar__left">
        <span class="topbar__info"> Безплатна доставка над 110 лв </span>
      </div>

      <!-- Center - Main promotional text -->
      <div class="topbar__center">
        <span class="topbar__promo"> Персонализирани бродирани изделия с любов ✨ </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed for this static component
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

.topbar {
  background: #6c8474;
  border-bottom: none;
  font-family: $font-body;
  font-size: 0.875rem;
  color: white;

  &__container {
    width: 100%;
    margin-inline: auto;
    padding-inline: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 40px;

    @include up(md) {
      max-width: 1104px;
      padding-inline: 20px;
    }
    @include up(lg) {
      max-width: 1472px;
      padding-inline: 24px;
    }
    @include up(xl) {
      max-width: 1656px;
      padding-inline: 32px;
    }
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 1rem;

    @media (max-width: 767px) {
      flex-direction: column;
      justify-content: center;
    }
  }

  &__left {
    flex: 0 0 auto;

    @media (max-width: 767px) {
      display: none;
    }
  }

  &__center {
    flex: 0 0 auto;
    margin-left: auto;
    text-align: right;

    @media (max-width: 767px) {
      margin-left: 0;
    }
  }

  &__right {
    display: none;
  }

  &__info {
    color: white;
    font-weight: 500;
    font-size: 0.8125rem;

    @media (max-width: 767px) {
      font-size: 0.75rem;
    }
  }

  &__promo {
    color: white;
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
