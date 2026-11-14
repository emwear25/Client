<template>
  <section class="occasions">
    <div class="occasions__hero">
      <div class="container">
        <h1 class="occasions__title">Персонализирани подаръци по повод</h1>
        <p class="occasions__intro">
          Подарък с бродирано име за всеки повод – от изписването и кръщенето до първия ден в
          детската градина и Коледа. Изберете повод и разгледайте най-подходящите изделия.
        </p>
      </div>
    </div>

    <div class="container">
      <ul class="occasions__grid">
        <li v-for="page in LANDING_PAGES" :key="page.slug">
          <NuxtLink :to="`/podaratsi/${page.slug}`" class="occasions__card">
            <h2 class="occasions__card-title">{{ page.label }}</h2>
            <p class="occasions__card-text">{{ page.description }}</p>
            <span class="occasions__card-cta">Разгледай →</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePageSEO } from "~/composables/useSEO";
import { useBreadcrumbs } from "~/composables/useBreadcrumbs";
import { LANDING_PAGES } from "~/utils/seoContent";

usePageSEO({
  title: "Подаръци с име по повод – за бебе, кръщене, Коледа",
  description:
    "Персонализирани подаръци с бродирано име за бебе, кръщене, прощъпулник, рожден ден, детска градина и Коледа. Изработка за 1–2 дни, доставка в цяла България.",
  path: "/podaratsi",
});

useBreadcrumbs([
  { name: "Начало", url: "/" },
  { name: "Подаръци по повод", url: "/podaratsi" },
]);
</script>

<style lang="scss" scoped>
@use "@/assets/styles/colors" as *;
@use "@/assets/styles/breakpoints" as *;

.occasions {
  min-height: 100vh;
  padding-bottom: 4rem;

  &__hero {
    background: $grad-brand-a;
    padding: 3rem 0;
    text-align: center;
    color: $brand-ink;
  }

  &__title {
    font-family: "Outfit", sans-serif;
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 1rem;

    @include up(md) {
      font-size: 3rem;
    }
  }

  &__intro {
    max-width: 680px;
    margin: 0 auto;
    font-size: 1.05rem;
    line-height: 1.6;
    color: $text-primary;
  }

  &__grid {
    list-style: none;
    padding: 0;
    margin: 2.5rem 0 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;

    @include up(md) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include up(lg) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1.5rem;
    border-radius: 16px;
    background: $bg-card;
    border: 1px solid $border-base;
    color: $text-primary;
    text-decoration: none;
    transition: border-color 0.2s ease, transform 0.2s ease;

    &:hover {
      border-color: $brand;
      transform: translateY(-2px);
    }
  }

  &__card-title {
    font-family: "Outfit", sans-serif;
    font-size: 1.35rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 0.5rem;
  }

  &__card-text {
    flex: 1;
    margin: 0 0 1rem;
    line-height: 1.55;
    color: $text-secondary;
  }

  &__card-cta {
    font-weight: 600;
    color: $brand-ink;
  }
}
</style>
