<template>
  <section class="about-cta">
    <div class="about-cta__container">
      <div class="about-cta__content">
        <h2 class="about-cta__heading">Готови да създадем нещо специално?</h2>
        <p class="about-cta__text">
          Разгледайте нашата колекция и открийте перфектния персонализиран подарък
        </p>
        <div class="about-cta__actions">
          <NuxtLink to="/products" class="btn btn--primary btn--large">
            Разгледай продуктите
          </NuxtLink>
          <NuxtLink to="/contact" class="btn btn--ghost btn--large">
            Свържете се с нас
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@use '~/assets/styles/colors' as *;
@use '~/assets/styles/breakpoints' as *;
@use '~/assets/styles/fonts' as *;

.about-cta {
  padding: 4rem 0;
  background: $grad-brand-b;
  position: relative;
  overflow: hidden;

  @include up(md) {
    padding: 5rem 0;
  }

  @include up(lg) {
    padding: 6rem 0;
  }

  // Decorative elements
  &::before {
    content: '';
    position: absolute;
    bottom: -10%;
    left: -5%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba($color-white, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -15%;
    right: -8%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba($color-white, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  &__container {
    width: 100%;
    margin-inline: auto;
    padding-inline: 16px;
    position: relative;
    z-index: 1;
    max-width: 900px;

    @include up(md) {
      padding-inline: 20px;
    }
  }

  &__content {
    text-align: center;
  }

  &__heading {
    font-family: $font-heading;
    font-weight: 700;
    font-size: clamp(2rem, 6vw, 3rem);
    color: $color-white;
    margin: 0 0 1.5rem 0;
    line-height: 1.2;
    letter-spacing: 0.02em;
  }

  &__text {
    font-family: $font-body;
    font-size: 1.125rem;
    color: rgba($color-white, 0.9);
    line-height: 1.7;
    margin: 0 0 2.5rem 0;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;

    @include up(sm) {
      flex-direction: row;
      gap: 1.5rem;
    }

    .btn--ghost {
      background: rgba($color-white, 0.1);
      border-color: $color-white;
      color: $color-white;

      &:hover {
        background: rgba($color-white, 0.2);
      }
    }
  }
}
</style>
