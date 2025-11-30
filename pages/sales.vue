<template>
  <div class="sales-page">
    <div class="container">
      <h1 class="sales-page__title">Намаления</h1>
      <p class="sales-page__message">Скоро ще добавим продукти на намаление.</p>
      <NuxtLink to="/products" class="btn btn--primary">
        Разгледай Продукти
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Намаления - emWear',
  meta: [
    { name: 'description', content: 'Разгледайте нашите продукти на намаление.' }
  ]
})
</script>

<style lang="scss" scoped>
@use '~/assets/styles/colors' as *;
@use '~/assets/styles/fonts' as *;
@use '~/assets/styles/breakpoints' as *;

.sales-page {
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

