<template>
  <section class="banner-section">
    <div
      class="banner-section__background"
      :style="{ backgroundImage: `url('/img/home/bag-keychain-set.webp')` }"
    />
    <div class="banner-section__overlay" />
    <div class="banner-section__container">
      <div class="banner-section__content">
        <h2 class="banner-section__title">Раница + ключодържател в комплект</h2>
        <p class="banner-section__subtitle">
          Към всяка раничка добавете подходящ персонализиран ключодържател с името на детето –
          малкото допълнение, което прави подаръка завършен.
        </p>
        <NuxtLink to="/category/keychains" class="banner-section__button"> Виж ключодържателите </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Banner section component
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

.banner-section {
  position: relative;
  width: 100%;
  min-height: 500px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  background: #ffffff;

  @include up(md) {
    min-height: 500px;
    padding: 5rem 2rem;
  }

  @include up(lg) {
    min-height: 600px;
    padding: 6rem 2rem;
  }

  &__background {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 1610px;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 1;

    @media (max-width: 767px) {
      background-size: cover;
      background-position: center;
      height: 100%;
      min-height: 500px;
    }
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 1610px;
    height: 100%;
    // Darker behind the text (left), clearer over the product (right)
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.62) 0%,
      rgba(0, 0, 0, 0.45) 45%,
      rgba(0, 0, 0, 0.2) 100%
    );
    z-index: 2;

    @media (max-width: 767px) {
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.62) 0%,
        rgba(0, 0, 0, 0.45) 50%,
        rgba(0, 0, 0, 0.3) 100%
      );
    }
  }

  &__container {
    position: relative;
    z-index: 3;
    width: 100%;
    max-width: 1610px;
    margin: 0 auto;
    padding: 3rem 1rem;

    @include up(md) {
      padding: 4rem 2rem;
    }

    @include up(lg) {
      padding: 5rem 2rem;
    }
  }

  &__content {
    text-align: left;
    max-width: 800px;
    margin-left: 0;
    margin-right: auto;
  }

  &__title {
    font-family: "Outfit", sans-serif;
    font-size: 48px;
    font-weight: 300;
    color: #b9c6aa;
    margin: 0 0 1.5rem;
    line-height: 52px;

    @include up(md) {
      margin-bottom: 2rem;
    }

    @media (max-width: 767px) {
      font-size: 36px;
      line-height: 42px;
    }
  }

  &__subtitle {
    font-family:
      system-ui,
      -apple-system,
      "Segoe UI",
      Roboto,
      "Helvetica Neue",
      "Noto Sans",
      "Liberation Sans",
      Arial,
      sans-serif,
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
      "Noto Color Emoji";
    font-size: 16px;
    font-weight: 400;
    color: rgb(255, 255, 255);
    margin: 0 0 2.5rem;
    line-height: 28px;

    @include up(md) {
      margin-bottom: 3rem;
    }
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 2rem;
    background: rgb(255, 255, 255);
    color: rgb(46, 46, 46);
    font-family:
      system-ui,
      -apple-system,
      "Segoe UI",
      Roboto,
      "Helvetica Neue",
      "Noto Sans",
      "Liberation Sans",
      Arial,
      sans-serif,
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
      "Noto Color Emoji";
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.9);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }
}
</style>
