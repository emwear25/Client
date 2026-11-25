<template>
  <section v-if="BLACK_FRIDAY_ACTIVE" class="bf">
    <div class="bf__inner">
      <span class="bf__eyebrow">⚡ Black Friday в emWear</span>
      <h2 class="bf__title">−15% на всичко</h2>
      <p class="bf__sub">
        <strong>−15%</strong> на всички продукти, раниците <strong>−10%</strong> и
        <strong>подарък ключодържател</strong> към всяка раница. Цените вече са намалени —
        отстъпката важи автоматично.
      </p>

      <div class="bf__deals">
        <div class="bf__deal">
          <span class="bf__pct">−15%</span>
          <span class="bf__label">На всички продукти</span>
        </div>
        <div class="bf__deal">
          <span class="bf__pct">−10% + 🎁</span>
          <span class="bf__label">Раница + подарък ключодържател</span>
        </div>
        <div class="bf__deal">
          <span class="bf__pct">€80</span>
          <span class="bf__label">Безплатна доставка над</span>
        </div>
      </div>

      <NuxtLink to="/products" class="bf__cta">Разгледай продуктите</NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
// Black Friday promo banner for the homepage. Hidden when BLACK_FRIDAY_ACTIVE
// is false (see utils/blackFriday.ts).
import { BLACK_FRIDAY_ACTIVE } from "~/utils/blackFriday";
</script>

<style scoped lang="scss">
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

.bf {
  background: radial-gradient(120% 140% at 50% 0%, #2f3a2a 0%, #1b2119 70%);
  color: #fff;
  padding: 3rem 1rem;

  @include up(md) {
    padding: 4rem 2rem;
  }

  &__inner {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  &__eyebrow {
    display: inline-block;
    font-family: $font-ui;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #e7c873;
    margin-bottom: 0.75rem;
  }

  &__title {
    font-family: "Outfit", sans-serif;
    font-weight: 300;
    font-size: clamp(30px, 5vw, 48px);
    margin: 0 0 0.5rem;
    color: #fff;
  }

  &__sub {
    font-family: $font-body;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 2rem;

    strong {
      color: #e7c873;
      font-weight: 700;
    }
  }

  &__deals {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;

    @include up(sm) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__deal {
    border: 1px solid rgba(231, 200, 115, 0.35);
    border-radius: 14px;
    padding: 1.25rem 1rem;
    background: rgba(255, 255, 255, 0.03);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
  }

  &__pct {
    font-family: "Outfit", sans-serif;
    font-weight: 700;
    font-size: clamp(28px, 6vw, 40px);
    color: #e7c873;
    line-height: 1;
  }

  &__label {
    font-family: $font-body;
    font-size: 0.9375rem;
    color: rgba(255, 255, 255, 0.85);
  }

  &__cta {
    display: inline-block;
    background: #e7c873;
    color: #1b2119;
    font-family: $font-ui;
    font-weight: 600;
    font-size: 0.875rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-decoration: none;
    padding: 0.85rem 2.25rem;
    border-radius: 999px;
    transition:
      transform 0.2s ease,
      background 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      background: #f0d58a;
    }
  }
}
</style>
