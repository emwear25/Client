<template>
  <section class="contact-hero">
    <div class="contact-hero__container">
      <h1 class="contact-hero__heading">Свържете се с нас</h1>
      <p class="contact-hero__subtext">
        Имате въпрос относно поръчка, продукт или идея за персонализация? Пишете ни — ще отговорим
        до 24 часа.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@use "~/assets/styles/breakpoints" as *;

.contact-hero {
  background-color: #fdf8f4;
  padding: 4rem 0;
  width: 100%;

  &__container {
    width: 100%;
    margin: 0 auto;
    padding-inline: 16px;
    text-align: center;

    @include up(md) {
      max-width: 1104px;
      padding-inline: 20px;
    }
    @include up(lg) {
      max-width: 1472px;
      padding-inline: 24px;
    }
    @include up(xl) {
      max-width: 1656px;
      padding-inline: 32px;
    }
  }

  &__heading {
    font-family: "Poppins", sans-serif;
    font-weight: 700;
    font-size: 2.5rem;
    color: #333;
    margin: 0 0 1.5rem 0;
    line-height: 1.2;

    @media (min-width: 768px) {
      font-size: 3rem;
    }

    @media (min-width: 1024px) {
      font-size: 3.5rem;
    }
  }

  &__subtext {
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 1.125rem;
    color: #666;
    line-height: 1.6;
    margin: 0 auto;
    max-width: 700px;

    @media (min-width: 768px) {
      font-size: 1.25rem;
    }
  }
}
</style>
