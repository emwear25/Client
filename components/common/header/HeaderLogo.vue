<template>
  <div class="site-header__logo">
    <NuxtLink to="/" class="site-header__logo-link">
      <img
        src="/logo-dark.png"
        alt="emWear"
        class="site-header__logo-img"
        width="195"
        height="59"
        loading="eager"
      />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed for the logo component
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;

.site-header {
  &__logo {
    flex-shrink: 0;

    &-link {
      display: block;
      text-decoration: none;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.85;
      }

      &:focus-visible {
        outline: 2px solid $brand;
        outline-offset: 4px;
        border-radius: 4px;
      }
    }

    &-img {
      height: 54px; // 40px * 1.35 = 54px (35% increase on mobile)
      width: auto;
      display: block;

      @media (min-width: 768px) {
        height: 59px; // 45px * 1.3 = 58.5px rounded to 59px (30% increase on desktop)
      }
    }
  }
}
</style>
