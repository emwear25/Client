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
      <li
        class="site-header__nav-item site-header__nav-item--dropdown nav-item"
        :class="{ 'nav-item--open': isProductsOpen }"
        @mouseenter="isProductsOpen = true"
        @mouseleave="isProductsOpen = false"
      >
        <button
          class="site-header__nav-link site-header__nav-link--button"
          type="button"
          :class="{
            'site-header__nav-link--active': route.path.startsWith('/products'),
          }"
          @click="toggleProductsOnMobile"
        >
          Продукти
          <svg
            class="site-header__nav-arrow"
            :class="{ 'site-header__nav-arrow--open': isProductsOpen }"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <NavDropdown :is-open="isProductsOpen" :items="dropdownItems" @item-click="closeDropdown" />
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
import { useRoute } from "vue-router";
import { useApi } from "~/composables/useApi";

interface Category {
  _id: string;
  name: string;
  slug: string;
  displayName: string;
  productCount?: number;
}

// Get current route for active link highlighting
const route = useRoute();

// Dropdown state
const isProductsOpen = ref(false);

// Use shared categories composable to prevent duplicate requests
const { categories: categoriesWithProducts, fetchCategories } = useCategories();

// Toggle dropdown on mobile/touch devices
const toggleProductsOnMobile = (event: MouseEvent) => {
  // On desktop we rely on hover only, on mobile/touch we toggle by click
  if (window.matchMedia("(pointer: coarse)").matches) {
    isProductsOpen.value = !isProductsOpen.value;
    event.preventDefault();
  }
};

const closeDropdown = () => {
  isProductsOpen.value = false;
};

// Computed dropdown items
const dropdownItems = computed(() => [
  { label: "Всички продукти", to: "/products" },
  { label: "Колекции", to: "/collections" },
  ...categoriesWithProducts.value.map((c) => ({
    label: c.displayName,
    to: `/category/${c.slug}`,
  })),
]);

// Fetch on mount
onMounted(() => {
  fetchCategories(true);
});
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

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
      position: relative;
    }

    &-link {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 0;
      color: rgb(77, 77, 77);
      text-decoration: none;
      font-family: $font-body;
      font-size: 16px;
      font-weight: 400;
      line-height: 28px;
      transition: color 0.2s ease;
      position: relative;
      background: none;
      border: none;
      cursor: pointer;

      &:hover {
        color: $brand;
      }

      &--active {
        color: $brand-ink;
        font-weight: 500;

        &::after {
          content: "";
          position: absolute;
          bottom: -0.25rem;
          left: 0;
          right: 0;
          height: 2px;
          background: $brand;
        }
      }

      &--button {
        // Ensure button variant looks like a link
        text-align: left;
      }

      &:focus-visible {
        outline: 2px solid $brand;
        outline-offset: 2px;
      }
    }

    &-arrow {
      transition: transform 0.2s ease;

      &--open {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
