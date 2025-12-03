<template>
  <section class="about-hero">
    <div class="about-hero__container">
      <div class="about-hero__content">
        <span class="about-hero__label">Открийте нашата история</span>
        <h1 class="about-hero__heading">За нас</h1>
        <p class="about-hero__subtext">
          Създаваме персонализирани подаръци с внимание към всеки детайл, които носят радост и
          уникалност
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

.about-hero {
  background: $grad-brand-a;
  padding: 5rem 0;
  width: 100%;
  position: relative;
  overflow: hidden;

  @include up(md) {
    padding: 6rem 0;
  }

  @include up(lg) {
    padding: 7rem 0;
  }

  // Decorative circle
  &::before {
    content: "";
    position: absolute;
    top: -20%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba($brand, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  &__container {
    width: 100%;
    margin-inline: auto;
    padding-inline: 16px;
    position: relative;
    z-index: 1;

    @include up(md) {
      max-width: 960px;
      padding-inline: 20px;
    }
    @include up(lg) {
      max-width: 1280px;
      padding-inline: 24px;
    }
    @include up(xl) {
      max-width: 1440px;
      padding-inline: 32px;
    }
  }

  &__content {
    text-align: center;
    max-width: 720px;
    margin: 0 auto;
  }

  &__label {
    display: inline-block;
    font-family: $font-body;
    font-size: 0.875rem;
    font-weight: 600;
    color: $brand-ink;
    background: rgba($color-white, 0.7);
    padding: 8px 20px;
    border-radius: 30px;
    margin-bottom: 1.5rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  &__heading {
    font-family: $font-heading;
    font-weight: 700;
    font-size: clamp(2.5rem, 8vw, 4rem);
    color: $brand-ink;
    margin: 0 0 1.5rem 0;
    line-height: 1.1;
    letter-spacing: 0.02em;
  }

  &__subtext {
    font-family: $font-body;
    font-weight: 400;
    font-size: clamp(1.0625rem, 3vw, 1.25rem);
    color: $text-secondary;
    line-height: 1.7;
    margin: 0;
  }
}
</style>
