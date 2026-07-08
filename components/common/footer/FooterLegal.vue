<template>
  <div class="footer-legal">
    <div class="footer-legal__copyright">
      <p class="footer-legal__text">© {{ currentYear }} emWear. Всички права запазени.</p>
    </div>
    <div class="footer-legal__links">
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
  </div>
</template>

<script setup lang="ts">
import { useCookieConsent } from "~/composables/useCookieConsent";

interface LegalLink {
  name: string;
  path: string;
}

const { openSettings } = useCookieConsent();

const currentYear = new Date().getFullYear();

const legalLinks: LegalLink[] = [
  {
    name: "Политика за поверителност",
    path: "/privacy",
  },
  {
    name: "Общи условия",
    path: "/terms",
  },
];
</script>

<style scoped lang="scss">
.footer-legal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }

  &__copyright {
    // No additional styles needed
  }

  &__text {
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }

  &__links {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;

    @media (min-width: 768px) {
      justify-content: flex-end;
    }
  }

  &__link {
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #e67e22;
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
