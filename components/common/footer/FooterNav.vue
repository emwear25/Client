<template>
  <nav class="footer-nav">
    <div class="footer-nav__grid">
      <div class="footer-nav__section footer-nav__section--brand">
        <NuxtLink to="/" class="footer-nav__logo-link">
          <img
            src="/logo-dark.png"
            alt="emWear"
            class="footer-nav__logo-img"
            width="233"
            height="70"
            loading="eager"
          />
        </NuxtLink>
        <p class="footer-nav__desc">Персонализирани подаръци с грижа и стил.</p>
      </div>
      <div class="footer-nav__section">
        <h3 class="footer-nav__heading">Колекция</h3>
        <ul class="footer-nav__list">
          <li v-for="link in collectionLinks" :key="link.path" class="footer-nav__item">
            <NuxtLink :to="link.path" class="footer-nav__link">
              {{ link.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div class="footer-nav__section">
        <h3 class="footer-nav__heading">Компания</h3>
        <ul class="footer-nav__list">
          <li v-for="link in companyLinks" :key="link.path" class="footer-nav__item">
            <NuxtLink :to="link.path" class="footer-nav__link">
              {{ link.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface NavigationLink {
  name: string;
  path: string;
}

const collectionLinks: NavigationLink[] = [
  { name: "Продукти", path: "/products" },
  { name: "Намаления", path: "/sales" },
  { name: "Блог", path: "/blog" },
];

const companyLinks: NavigationLink[] = [
  { name: "За Нас", path: "/about" },
  { name: "Контакти", path: "/contact" },
  { name: "Доставка и връщане", path: "/shipping" },
];
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

.footer-nav {
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @include up(md) {
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }

    @include up(lg) {
      grid-template-columns: 2fr 1fr 1fr;
      gap: 4rem;
    }
  }

  &__section {
    &--brand {
      @include up(md) {
        grid-column: 1 / -1;
      }

      @include up(lg) {
        grid-column: auto;
      }
    }
  }

  &__logo-link {
    display: inline-block;
    text-decoration: none;
    margin-bottom: 1rem;
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

  &__logo-img {
    height: 70px;
    width: auto;
    display: block;
    filter: brightness(0) invert(1);
  }

  &__desc {
    font-family: $font-body;
    font-weight: 400;
    font-size: 1rem;
    color: rgba($color-white, 0.8);
    line-height: 1.7;
    margin: 0;
    max-width: 280px;
  }

  &__heading {
    font-family: $font-body;
    font-weight: 700;
    font-size: 13px;
    line-height: 16px;
    color: rgb(255, 255, 255);
    margin: 0 0 1.5rem 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__item {
    // No additional styles needed
  }

  &__link {
    font-family: $font-body;
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: rgb(255, 255, 255);
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: 2px;
    }
  }
}
</style>
