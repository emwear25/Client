<template>
  <section class="what-makes-different">
    <div class="what-makes-different__container">
      <div class="what-makes-different__header">
        <span class="what-makes-different__eyebrow">Нашите стойности</span>
      <h2 class="what-makes-different__heading">Какво ни прави различни</h2>
        <p class="what-makes-different__intro">
          Комбинираме традиционно майсторство с модерни технологии, за да създадем продукти, които ще бъдат ценени за дълги години
        </p>
      </div>
      <div class="what-makes-different__grid">
        <article
          v-for="feature in features"
          :key="feature.title"
          class="feature-card"
        >
          <div class="feature-card__icon-wrapper">
            <Icon :name="feature.icon" class="feature-card__icon" />
          </div>
          <h3 class="feature-card__title">{{ feature.title }}</h3>
          <p class="feature-card__text">{{ feature.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Feature {
  icon: string
  title: string
  text: string
}

const features: Feature[] = [
  {
    icon: 'mdi:account-heart-outline',
    title: 'Персонализация с име и цвят',
    text: 'Всеки продукт може да бъде персонализиран с името на детето и любимия му цвят за уникален подарък.',
  },
  {
    icon: 'mdi:creation',
    title: 'Прецизна машинна изработка',
    text: 'Използваме най-модерни машини за качествена и дълготрайна изработка на всяка бродерия.',
  },
  {
    icon: 'mdi:flag-outline',
    title: 'Произведено в България',
    text: 'Гордеем се, че всички наши продукти се произвеждат в България с грижа и внимание.',
  },
  {
    icon: 'mdi:gift-outline',
    title: 'Идеални за подарък',
    text: 'Всеки продукт се опакова красиво и е готов да зарадва получателя при всяка специална случка.',
  },
]
</script>

<style scoped lang="scss">
@use '~/assets/styles/colors' as *;
@use '~/assets/styles/breakpoints' as *;
@use '~/assets/styles/fonts' as *;

.what-makes-different {
  padding: 4rem 0;
  background: $bg-page;

  @include up(md) {
  padding: 5rem 0;
  }

  @include up(lg) {
    padding: 6rem 0;
  }

  &__container {
    width: 100%;
    margin-inline: auto;
    padding-inline: 16px;

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

  &__header {
    text-align: center;
    max-width: 720px;
    margin: 0 auto 3rem;

    @include up(md) {
      margin-bottom: 4rem;
    }
  }

  &__eyebrow {
    display: inline-block;
    font-family: $font-body;
    font-size: 0.875rem;
    font-weight: 600;
    color: $brand;
    margin-bottom: 1rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  &__heading {
    font-family: $font-heading;
    font-weight: 700;
    font-size: clamp(2rem, 5vw, 2.75rem);
    color: $brand-ink;
    margin: 0 0 1rem 0;
    line-height: 1.2;
    letter-spacing: 0.02em;
  }

  &__intro {
    font-family: $font-body;
    font-size: 1.0625rem;
    color: $text-secondary;
    line-height: 1.7;
    margin: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @include up(sm) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include up(lg) {
      grid-template-columns: repeat(4, 1fr);
    }
    }
  }

.feature-card {
  background: $bg-card;
    padding: 2rem 1.5rem;
    border-radius: 16px;
    text-align: center;
  border: 2px solid $border-base;
  box-shadow: 0 6px 16px $shadow-soft;
  transition: all 0.3s ease;

    &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px $shadow-med;
    border-color: $brand;
  }

  &__icon-wrapper {
    width: 72px;
    height: 72px;
    background: $grad-brand-b;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    transition: transform 0.3s ease;

    @include up(md) {
      width: 80px;
      height: 80px;
    }
  }

  &:hover &__icon-wrapper {
    transform: scale(1.1) rotate(5deg);
  }

  &__icon {
    width: 36px;
    height: 36px;
    color: $color-white;

    @include up(md) {
      width: 40px;
      height: 40px;
    }
  }

  &__title {
    font-family: $font-heading;
    font-weight: 500;
    font-size: 1.125rem;
    color: $brand-ink;
    margin: 0 0 1rem 0;
    line-height: 1.3;
  }

  &__text {
    font-family: $font-body;
    font-weight: 400;
    font-size: 0.9375rem;
    color: $text-secondary;
    line-height: 1.6;
    margin: 0;
  }
}
</style>
