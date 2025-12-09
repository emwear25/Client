<template>
  <div class="mobile-menu" :class="{ 'mobile-menu--open': isOpen }">
    <!-- Close Button -->
    <div class="mobile-menu__header">
      <button class="mobile-menu__close" aria-label="Close menu" @click="emit('close')">
        <Icon name="mdi:close" class="mobile-menu__close-icon" />
      </button>
    </div>

    <!-- Navigation Links -->
    <nav class="mobile-menu__nav">
      <ul class="mobile-menu__nav-list">
        <li class="mobile-menu__nav-item">
          <NuxtLink
            to="/"
            class="mobile-menu__nav-link"
            :class="{ 'mobile-menu__nav-link--active': route.path === '/' }"
            @click="emit('close')"
          >
            Начало
          </NuxtLink>
        </li>
        <li class="mobile-menu__nav-item">
          <NuxtLink
            to="/products"
            class="mobile-menu__nav-link"
            :class="{
              'mobile-menu__nav-link--active': route.path.startsWith('/products'),
            }"
            @click="emit('close')"
          >
            Продукти
          </NuxtLink>
        </li>
        <li class="mobile-menu__nav-item mobile-menu__nav-item--indent">
          <NuxtLink
            to="/collections"
            class="mobile-menu__nav-link mobile-menu__nav-link--sub"
            :class="{
              'mobile-menu__nav-link--active': route.path === '/collections',
            }"
            @click="emit('close')"
          >
            Колекции
          </NuxtLink>
        </li>
        <li
          v-for="category in categoriesWithProducts"
          :key="category._id"
          class="mobile-menu__nav-item mobile-menu__nav-item--indent"
        >
          <NuxtLink
            :to="`/category/${category.slug}`"
            class="mobile-menu__nav-link mobile-menu__nav-link--sub"
            :class="{
              'mobile-menu__nav-link--active': route.path === `/category/${category.slug}`,
            }"
            @click="emit('close')"
          >
            {{ category.displayName }}
          </NuxtLink>
        </li>
        <li class="mobile-menu__nav-item">
          <NuxtLink
            to="/sales"
            class="mobile-menu__nav-link"
            :class="{
              'mobile-menu__nav-link--active': route.path.startsWith('/sales'),
            }"
            @click="emit('close')"
          >
            Намаления
          </NuxtLink>
        </li>
        <li class="mobile-menu__nav-item">
          <NuxtLink
            to="/blog"
            class="mobile-menu__nav-link"
            :class="{
              'mobile-menu__nav-link--active': route.path.startsWith('/blog'),
            }"
            @click="emit('close')"
          >
            Блог
          </NuxtLink>
        </li>
        <li class="mobile-menu__nav-item">
          <NuxtLink
            to="/about"
            class="mobile-menu__nav-link"
            :class="{
              'mobile-menu__nav-link--active': route.path === '/about',
            }"
            @click="emit('close')"
          >
            За Нас
          </NuxtLink>
        </li>
        <li class="mobile-menu__nav-item">
          <NuxtLink
            to="/contact"
            class="mobile-menu__nav-link"
            :class="{
              'mobile-menu__nav-link--active': route.path === '/contact',
            }"
            @click="emit('close')"
          >
            Контакти
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Actions -->
    <div class="mobile-menu__actions">
      <NuxtLink to="/favorites" class="mobile-menu__action-link" @click="emit('close')">
        <Icon name="mdi:heart-outline" class="mobile-menu__action-icon" />
        <span>Любими</span>
      </NuxtLink>

      <NuxtLink to="/login" class="mobile-menu__action-link" @click="emit('close')">
        <Icon name="mdi:account-outline" class="mobile-menu__action-icon" />
        <span>Вход</span>
      </NuxtLink>
    </div>
  </div>
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

// Define props
defineProps<{
  isOpen: boolean;
}>();

// Define emits
const emit = defineEmits<{
  close: [];
}>();

// Get current route for active link highlighting
const route = useRoute();

// Use shared categories composable to prevent duplicate requests
const { categories: categoriesWithProducts, fetchCategories } = useCategories();

// Fetch on mount
onMounted(() => {
  fetchCategories(true);
});
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/fonts" as *;

.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100%;
  max-width: 320px;
  background: $bg-card;
  z-index: 200;
  transform: translateX(100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  box-shadow: -4px 0 20px $shadow-med;

  @media (min-width: 768px) {
    display: none;
  }

  &--open {
    transform: translateX(0);
    opacity: 1;
    visibility: visible;
  }

  &__header {
    padding: 1rem;
    border-bottom: 2px solid $brand;
    display: flex;
    justify-content: flex-end;
  }

  &__close {
    background: none;
    border: none;
    color: $text-primary;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    border-radius: 8px;

    &:hover {
      color: $brand;
      background: rgba($brand, 0.1);
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: 2px;
    }

    &-icon {
      font-size: 1.5rem;
    }
  }

  &__nav {
    padding: 1rem 0;

    &-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    &-item {
      border-bottom: 1px solid $border-base;

      &:last-child {
        border-bottom: none;
      }

      &--indent {
        background: rgba($brand, 0.03);
      }
    }

    &-link {
      display: block;
      padding: 1rem 1.5rem;
      color: $text-primary;
      text-decoration: none;
      font-family: $font-body;
      font-weight: 500;
      font-size: 1rem;
      transition: all 0.2s ease;

      &--sub {
        padding-left: 2.5rem;
        font-size: 0.9375rem;
        font-weight: 400;
      }

      &:hover {
        color: $brand;
        background: rgba($brand, 0.08);
      }

      &--active {
        color: $brand-ink;
        background: rgba($brand, 0.15);
        border-left: 3px solid $brand;
      }

      &:focus-visible {
        outline: 2px solid $brand;
        outline-offset: -2px;
      }
    }
  }

  &__actions {
    padding: 1rem;
    border-top: 1px solid $border-base;
    margin-top: auto;
  }

  &__action-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    color: $text-primary;
    text-decoration: none;
    font-family: $font-body;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.2s ease;
    margin-bottom: 0.5rem;

    &:hover {
      color: $brand;
      background: rgba($brand, 0.08);
    }

    &:last-child {
      margin-bottom: 0;
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: 2px;
    }
  }

  &__action-icon {
    font-size: 1.25rem;
  }
}
</style>
