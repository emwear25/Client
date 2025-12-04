<template>
  <div class="site-header__logo">
    <NuxtLink to="/" class="site-header__logo-link">
      <img
        src="/logo-dark.png"
        alt="emWear"
        class="site-header__logo-img"
        width="233"
        height="70"
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
      height: 70px;
      width: auto;
      display: block;
    }
  }
}
</style>
