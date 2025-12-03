<template>
  <section class="our-story">
    <div class="our-story__container">
      <div class="our-story__content">
        <div class="our-story__text">
          <span class="our-story__eyebrow">Нашето начало</span>
          <h2 class="our-story__heading">Историята зад emWear</h2>
          <p class="our-story__paragraph">
            emWear започна с желанието да създаваме не просто продукти, а специални спомени. Всеки
            наш артикул е създаден с мисъл за индивидуалността и усмивката на детето.
          </p>
          <p class="our-story__paragraph">
            С любов към детайлите и отдаденост към качеството, ние вярваме, че всеки персонализиран
            продукт носи частица от уникалността на всяко дете. Това е нашата мисия - да създаваме
            радост чрез ръчно бродирани изделия.
          </p>
          <div class="our-story__stats">
            <div class="our-story__stat">
              <span class="our-story__stat-number">2000+</span>
              <span class="our-story__stat-label">Щастливи клиенти</span>
            </div>
            <div class="our-story__stat">
              <span class="our-story__stat-number">100%</span>
              <span class="our-story__stat-label">Ръчна изработка</span>
            </div>
          </div>
        </div>
        <div class="our-story__image">
          <div class="our-story__img-wrapper">
            <NuxtImg
              src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop"
              alt="Нашата история"
              class="our-story__img"
              format="webp"
              quality="80"
              width="800"
              height="600"
              loading="lazy"
              placeholder
            />
            <div class="our-story__img-overlay"/>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

.our-story {
  padding: 4rem 0;
  background: $bg-card;

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

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: center;

    @include up(lg) {
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
    }
  }

  &__text {
    order: 2;

    @include up(lg) {
      order: 1;
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
    margin: 0 0 1.5rem 0;
    line-height: 1.2;
    letter-spacing: 0.02em;
  }

  &__paragraph {
    font-family: $font-body;
    font-weight: 400;
    font-size: 1.0625rem;
    color: $text-secondary;
    line-height: 1.8;
    margin: 0 0 1.5rem 0;

    &:last-of-type {
      margin-bottom: 2rem;
    }
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 2.5rem;
  }

  &__stat {
    text-align: center;
    padding: 1.5rem;
    background: $bg-page;
    border-radius: 12px;
    border: 2px solid $brand;
  }

  &__stat-number {
    display: block;
    font-family: $font-heading;
    font-size: 2.5rem;
    font-weight: 700;
    color: $brand-ink;
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  &__stat-label {
    display: block;
    font-family: $font-body;
    font-size: 0.875rem;
    font-weight: 500;
    color: $text-secondary;
  }

  &__image {
    order: 1;

    @include up(lg) {
      order: 2;
    }
  }

  &__img-wrapper {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba($brand-ink, 0.15);

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba($brand, 0.1) 0%, transparent 100%);
      z-index: 1;
      pointer-events: none;
    }
  }

  &__img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.6s ease;
  }

  &__img-wrapper:hover &__img {
    transform: scale(1.05);
  }
}
</style>
