<template>
  <section class="meet-maker">
    <div class="meet-maker__container">
      <div class="meet-maker__content">
        <!-- Image Side -->
        <div class="meet-maker__visual">
          <div class="meet-maker__image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=700&fit=crop&crop=faces"
              alt="Севал - Създател на emWear"
              class="meet-maker__image"
            >
            <div class="meet-maker__image-decoration"/>
          </div>
          <div class="meet-maker__badge">
            <Icon name="mdi:heart-outline" class="meet-maker__badge-icon" />
            <span class="meet-maker__badge-text">Създадено с любов</span>
          </div>
        </div>

        <!-- Text Side -->
        <div class="meet-maker__text">
          <span class="meet-maker__eyebrow">Запознайте се</span>
          <h2 class="meet-maker__heading">Кой стои зад emWear?</h2>

          <div class="meet-maker__intro">
            <p class="meet-maker__greeting">
              Здравейте! Аз съм <strong>Севал</strong> – човекът зад emWear.
            </p>
          </div>

          <div class="meet-maker__story">
            <p class="meet-maker__paragraph">
              Вярвам, че най-красивите подаръци са тези, в които има лично послание и емоция. Именно
              затова всяка моя изработка е създадена с изключително внимание към детайла, с много
              любов и истинска грижа към всеки клиент.
            </p>

            <p class="meet-maker__paragraph">
              Всяка бродерия, всеки шев и всеки надпис носят частица от моята душа и страст към
              занаята. За мен най-важното е да направя вашия подарък наистина специален, уникален и
              запомнящ се – нещо, което ще донесе усмивка и топлина в сърцето на получателя.
            </p>

            <p class="meet-maker__paragraph meet-maker__paragraph--highlight">
              Когато създавам продукт за вас, аз не просто бродирам име върху материя – вплитам
              история, емоция и лични спомени, които правят всеки артикул уникален и безценен.
            </p>
          </div>

          <div class="meet-maker__signature">
            <div class="meet-maker__signature-line"/>
            <span class="meet-maker__signature-name">Севал</span>
            <span class="meet-maker__signature-title">Основател</span>
          </div>

          <div class="meet-maker__values">
            <div class="meet-maker__value">
              <Icon name="mdi:hand-heart" class="meet-maker__value-icon" />
              <span class="meet-maker__value-text">Ръчна изработка</span>
            </div>
            <div class="meet-maker__value">
              <Icon name="mdi:heart-pulse" class="meet-maker__value-icon" />
              <span class="meet-maker__value-text">С любов и грижа</span>
            </div>
            <div class="meet-maker__value">
              <Icon name="mdi:star-circle" class="meet-maker__value-icon" />
              <span class="meet-maker__value-text">Уникални творения</span>
            </div>
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

.meet-maker {
  padding: 4rem 0;
  background: $bg-card;
  position: relative;
  overflow: hidden;

  @include up(md) {
    padding: 5rem 0;
  }

  @include up(lg) {
    padding: 6rem 0;
  }

  // Decorative background
  &::before {
    content: "";
    position: absolute;
    top: -20%;
    left: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba($brand-accent-1, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  &__container {
    width: 100%;
    margin-inline: auto;
    padding-inline: 16px;
    position: relative;
    z-index: 1;

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
      grid-template-columns: 45% 55%;
      gap: 4rem;
    }
  }

  // Visual Side
  &__visual {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__image-wrapper {
    position: relative;
    width: 100%;
    max-width: 480px;
    aspect-ratio: 6 / 7;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba($brand-ink, 0.2);

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba($brand, 0.2) 0%, transparent 60%);
      z-index: 1;
      pointer-events: none;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }

  &__image-wrapper:hover &__image {
    transform: scale(1.05);
  }

  &__image-decoration {
    position: absolute;
    bottom: -20px;
    right: -20px;
    width: 150px;
    height: 150px;
    background: $grad-brand-a;
    border-radius: 50%;
    z-index: -1;
    box-shadow: 0 10px 30px rgba($brand, 0.3);
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: $brand;
    color: $brand-ink;
    padding: 12px 24px;
    border-radius: 50px;
    margin-top: -30px;
    font-family: $font-body;
    font-size: 0.9375rem;
    font-weight: 600;
    box-shadow: 0 8px 20px rgba($brand, 0.3);
    z-index: 2;
  }

  &__badge-icon {
    width: 20px;
    height: 20px;
  }

  // Text Side
  &__text {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__eyebrow {
    display: inline-block;
    font-family: $font-body;
    font-size: 0.875rem;
    font-weight: 600;
    color: $brand;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  &__heading {
    font-family: $font-heading;
    font-weight: 700;
    font-size: clamp(2rem, 5vw, 2.75rem);
    color: $brand-ink;
    margin: 0;
    line-height: 1.2;
    letter-spacing: 0.02em;
  }

  &__intro {
    margin: 0.5rem 0;
  }

  &__greeting {
    font-family: $font-body;
    font-size: 1.25rem;
    color: $text-primary;
    line-height: 1.6;
    margin: 0;

    strong {
      color: $brand-ink;
      font-weight: 700;
      font-size: 1.375rem;
    }
  }

  &__story {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  &__paragraph {
    font-family: $font-body;
    font-size: 1.0625rem;
    color: $text-secondary;
    line-height: 1.8;
    margin: 0;

    &--highlight {
      padding: 1.5rem;
      background: $bg-page;
      border-left: 4px solid $brand;
      border-radius: 8px;
      color: $text-primary;
      font-style: italic;
    }
  }

  &__signature {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 2rem;
    border-top: 2px solid $border-base;
  }

  &__signature-line {
    width: 120px;
    height: 2px;
    background: $brand;
    margin-bottom: 0.5rem;
  }

  &__signature-name {
    font-family: $font-accent;
    font-size: 2rem;
    color: $brand;
    line-height: 1;
  }

  &__signature-title {
    font-family: $font-body;
    font-size: 0.875rem;
    color: $text-secondary;
    font-weight: 500;
  }

  &__values {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
  }

  &__value {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: rgba($brand, 0.1);
    border: 1px solid $brand;
    border-radius: 50px;
    font-family: $font-body;
    font-size: 0.875rem;
    font-weight: 600;
    color: $brand-ink;
    transition: all 0.2s ease;

    &:hover {
      background: $brand;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($brand, 0.3);
    }
  }

  &__value-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
