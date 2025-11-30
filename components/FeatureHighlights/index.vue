<template>
  <section class="feature-highlights">
    <div class="feature-highlights__container">
      <h2 class="feature-highlights__heading">Защо да изберете emWear?</h2>

      <div class="feature-highlights__grid">
        <div
          v-for="feature in features"
          :key="feature.id"
          class="feature-highlights__card"
        >
          <div class="feature-highlights__icon">
            <Icon :name="feature.icon" />
          </div>
          <h3 class="feature-highlights__title">
            {{ feature.title }}
          </h3>
          <p class="feature-highlights__text">
            {{ feature.text }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Static feature data
const features = ref([
  {
    id: 1,
    icon: 'mdi:alphabetical-variant',
    title: 'Персонализирано име',
    text: 'Всяка раница се изработва с името, което Вие изберете.',
  },
  {
    id: 2,
    icon: 'mdi:cog',
    title: 'Прецизна машинна бродерия',
    text: 'Висококачествени машини гарантират трайна и детайлна бродерия.',
  },
  {
    id: 3,
    icon: 'mdi:truck-fast',
    title: 'Експресна 48-часова изработка',
    text: 'Подготвяме и изпращаме Вашата поръчка в рамките на 2 дни.',
  },
  {
    id: 4,
    icon: 'mdi:gift-outline',
    title: 'Идеален за подарък',
    text: 'Получавате продукта в красива опаковка, готова за изненада.',
  },
])
</script>

<style scoped lang="scss">
@use '~/assets/styles/colors' as *;
@use '~/assets/styles/breakpoints' as *;
@use '~/assets/styles/fonts' as *;

.feature-highlights {
  background: $bg-card;
  padding: 3rem 0;

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

  &__heading {
    font-family: $font-heading;
    font-size: clamp(2rem, 6vw, 2.75rem);
    font-weight: 700;
    text-align: center;
    color: $brand-ink;
    margin-bottom: 3rem;
    line-height: 1.2;
    letter-spacing: 0.02em;

    @include up(md) {
      margin-bottom: 4rem;
    }

    @include up(lg) {
      margin-bottom: 5rem;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @include up(md) {
      grid-template-columns: repeat(2, 1fr);
      gap: 2.5rem;
    }

    @include up(lg) {
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
  }

  &__card {
    background: $bg-page;
    padding: 2rem 1.5rem;
    border-radius: 14px;
    text-align: center;
    box-shadow: 0 6px 16px $shadow-soft;
    transition: all 0.2s ease;
    border: 1px solid $border-base;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px $shadow-med;
      border-color: $brand;
    }

    @include up(md) {
      padding: 2.5rem 2rem;
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    background: $grad-brand-b;
    border-radius: 50%;
    color: $color-white;
    font-size: 2rem;
    transition: all 0.2s ease;

    @include up(md) {
      width: 90px;
      height: 90px;
      font-size: 2.25rem;
      margin-bottom: 2rem;
    }

    .feature-highlights__card:hover & {
      transform: scale(1.1);
      box-shadow: 0 8px 20px rgba(185, 198, 170, 0.4);
    }
  }

  &__title {
    font-family: $font-heading;
    font-size: 1.25rem;
    font-weight: 500;
    color: $brand-ink;
    margin-bottom: 1rem;
    line-height: 1.3;

    @include up(md) {
      font-size: 1.375rem;
      margin-bottom: 1.25rem;
    }
  }

  &__text {
    font-family: $font-body;
    font-size: 0.95rem;
    font-weight: 400;
    color: $text-secondary;
    line-height: 1.7;
    margin: 0;

    @include up(md) {
      font-size: 1rem;
    }
  }
}
</style>
