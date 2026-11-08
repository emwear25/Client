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
        <template v-for="group in productMenuGroups" :key="group.title">
          <li class="mobile-menu__nav-item mobile-menu__nav-item--indent mobile-menu__group-title">
            {{ group.title }}
          </li>
          <li
            v-for="item in group.items"
            :key="item.to"
            class="mobile-menu__nav-item mobile-menu__nav-item--indent"
          >
            <NuxtLink
              :to="item.to"
              class="mobile-menu__nav-link mobile-menu__nav-link--sub mobile-menu__nav-link--thumb"
              :class="{
                'mobile-menu__nav-link--active': route.path === item.to,
              }"
              @click="emit('close')"
            >
              <span class="mobile-menu__thumb">
                <img :src="item.image" :alt="item.label" loading="lazy" />
              </span>
              <span>{{ item.label }}</span>
            </NuxtLink>
          </li>
        </template>
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
            За нас
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

// Curated product groups shared with the desktop mega-menu (see ~/utils/productMenu).
// productMenuGroups is auto-imported by Nuxt from the utils directory.
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/fonts" as *;

.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  height: 100dvh;
  width: 100%;
  max-width: 320px;
  background: $bg-card;
  z-index: 200;
  transform: translateX(100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  box-shadow: -4px 0 20px $shadow-med;
  display: flex;
  flex-direction: column;

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
    flex-shrink: 0;
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
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;

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

      &--thumb {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding-left: 1.5rem;
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

  &__group-title {
    padding: 0.75rem 1.5rem 0.4rem;
    font-family: $font-body;
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $text-secondary;
    background: rgba($brand, 0.03);
  }

  &__thumb {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 8px;
    overflow: hidden;
    background: rgba($brand, 0.08);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  &__actions {
    padding: 1rem;
    border-top: 1px solid $border-base;
    margin-top: auto;
    flex-shrink: 0;
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
