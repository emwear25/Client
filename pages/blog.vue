<template>
  <div class="blog-page">
    <div class="container">
      <h1 class="blog-page__title">Блог</h1>
      <p class="blog-page__message">Скоро ще добавим интересни статии и новини.</p>
      <NuxtLink to="/products" class="btn btn--primary">
        Разгледай Продукти
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Блог - emWear',
  meta: [
    { name: 'description', content: 'Разгледайте нашите статии и новини.' }
  ]
})
</script>

<style lang="scss" scoped>
@use '~/assets/styles/colors' as *;
@use '~/assets/styles/fonts' as *;
@use '~/assets/styles/breakpoints' as *;

.blog-page {
  min-height: 60vh;
  padding: 4rem 1rem;
  text-align: center;

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

