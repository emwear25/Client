<template>
  <section class="page-hero">
    <div class="container">
      <h1 class="page-hero__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-hero__subtitle">{{ subtitle }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/fonts" as *;
@use "~/assets/styles/breakpoints" as *;

.page-hero {
  background: $grad-brand-a;
  padding: 3rem 0;
  text-align: center;
  color: $brand-ink;
  width: 100%;
  max-width: 100%;
  margin: 0;
  box-sizing: border-box;

  @include up(md) {
    padding: 4rem 0;
  }

  &__title {
    font-family: "Outfit", sans-serif;
    font-size: 56px;
    font-weight: 300;
    color: $brand-ink;
    margin: 0 0 0.75rem;
    letter-spacing: 0.01em;
    line-height: 60px;

    @media (max-width: 767px) {
      font-size: 36px;
      line-height: 42px;
    }
  }

  &__subtitle {
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans",
      "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol", "Noto Color Emoji";
    font-size: 18px;
    font-weight: 300;
    line-height: 31px;
    color: $brand-ink;
    max-width: 700px;
    margin-inline: auto;
  }
}
</style>

