<template>
  <div class="footer-legal">
    <NuxtLink
      v-for="link in legalLinks"
      :key="link.path"
      :to="link.path"
      class="footer-legal__link"
    >
      {{ link.name }}
    </NuxtLink>
    <button
      type="button"
      class="footer-legal__link footer-legal__link--button"
      @click="openSettings"
    >
      Настройки на бисквитките
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCookieConsent } from "~/composables/useCookieConsent";

interface LegalLink {
  name: string;
  path: string;
}

const { openSettings } = useCookieConsent();

const legalLinks: LegalLink[] = [
  {
    name: "Политика за поверителност",
    path: "/privacy-policy",
  },
  {
    name: "Общи условия",
    path: "/terms",
  },
];
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

.footer-legal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;

  @include up(sm) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
  }

  &__link {
    font-family: $font-body;
    font-weight: 400;
    font-size: 0.875rem;
    color: rgba($color-white, 0.7);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: $brand;
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: 2px;
      border-radius: 4px;
    }

    &--button {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
    }
  }
}
</style>
