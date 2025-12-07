<template>
  <div class="blog-page">
    <div class="container">
      <h1 class="blog-page__title">Блог</h1>
      <p class="blog-page__message">Скоро ще добавим интересни статии и новини.</p>
      <NuxtLink to="/products" class="btn btn--primary"> Разгледай Продукти </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageSEO } from "~/composables/useSEO";

usePageSEO({
  title: "Блог",
  description:
    "Полезни статии за персонализирани подаръци, идеи за подаръци, съвети за избор и вдъхновение от emWear.",
  type: "website",
});

// Add Blog structured data
useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "emWear Блог",
        description: "Полезни статии за персонализирани подаръци и вдъхновение",
        url: "https://emwear.bg/blog",
      }),
    },
  ],
});
</script>

<style lang="scss" scoped>
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/fonts" as *;
@use "~/assets/styles/breakpoints" as *;

.blog-page {
  min-height: 60vh;
  padding: 4rem 1rem;
  text-align: center;
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;

  &__title {
    font-family: $font-heading;
    font-size: clamp(2rem, 4vw, 3rem);
    color: $brand-ink;
    margin: 0 0 1rem;
  }

  &__message {
    font-family: $font-body;
    font-size: 1.125rem;
    color: $text-secondary;
    margin: 0 0 2rem;
  }
}
</style>
