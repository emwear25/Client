<template>
  <nav class="site-header__nav">
    <ul class="site-header__nav-list">
      <li class="site-header__nav-item">
        <NuxtLink
          to="/"
          class="site-header__nav-link"
          :class="{ 'site-header__nav-link--active': route.path === '/' }"
        >
          Начало
        </NuxtLink>
      </li>
      <li class="site-header__nav-item">
        <NuxtLink
          to="/products"
          class="site-header__nav-link"
          :class="{
            'site-header__nav-link--active': route.path.startsWith('/products'),
          }"
        >
          Продукти
        </NuxtLink>
      </li>
      <li class="site-header__nav-item">
        <NuxtLink
          to="/sales"
          class="site-header__nav-link"
          :class="{
            'site-header__nav-link--active': route.path.startsWith('/sales'),
          }"
        >
          Намаления
        </NuxtLink>
      </li>
      <li class="site-header__nav-item">
        <NuxtLink
          to="/blog"
          class="site-header__nav-link"
          :class="{
            'site-header__nav-link--active': route.path.startsWith('/blog'),
          }"
        >
          Блог
        </NuxtLink>
      </li>
      <li class="site-header__nav-item">
        <NuxtLink
          to="/about"
          class="site-header__nav-link"
          :class="{
            'site-header__nav-link--active': route.path === '/about',
          }"
        >
          За Нас
        </NuxtLink>
      </li>
      <li class="site-header__nav-item">
        <NuxtLink
          to="/contact"
          class="site-header__nav-link"
          :class="{
            'site-header__nav-link--active': route.path === '/contact',
          }"
        >
          Контакти
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

// Get current route for active link highlighting
const route = useRoute()
</script>

<style scoped lang="scss">
@use '~/assets/styles/colors' as *;
@use '~/assets/styles/breakpoints' as *;
@use '~/assets/styles/fonts' as *;

.site-header {
  &__nav {
    display: none;

    @include up(md) {
      display: block;
    }

    &-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 2rem;
    }

    &-item {
      // No specific styles needed for desktop
    }

    &-link {
      display: block;
      padding: 0.5rem 0;
      color: rgb(77, 77, 77);
      text-decoration: none;
      font-family: $font-body;
      font-size: 16px;
      font-weight: 400;
      line-height: 28px;
      transition: color 0.2s ease;
      position: relative;

      &:hover {
        color: $brand;
      }

      &--active {
        color: $brand-ink;
        font-weight: 500;

        &::after {
          content: '';
          position: absolute;
          bottom: -0.25rem;
          left: 0;
          right: 0;
          height: 2px;
          background: $brand;
        }
      }

      &:focus-visible {
        outline: 2px solid $brand;
        outline-offset: 2px;
      }
    }
  }
}
</style>
