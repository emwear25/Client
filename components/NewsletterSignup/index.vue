<template>
  <section class="newsletter">
    <div class="newsletter__container">
      <div class="newsletter__content">
        <div class="newsletter__visual">
          <div class="newsletter__icon-wrapper">
            <Icon name="mdi:email-heart-outline" class="newsletter__icon" />
          </div>
        </div>
        <div class="newsletter__text">
          <h2 class="newsletter__heading">
            Присъединете се към нашето семейство
          </h2>
          <p class="newsletter__subtext">
            Бъдете първи, които научават за нови колекции, специални оферти и
            ексклузивни дизайни
          </p>
        </div>
        <form @submit.prevent="handleSubmit" class="newsletter__form">
          <div class="newsletter__input-group">
            <Icon name="mdi:email-outline" class="newsletter__input-icon" />
            <input
              v-model="email"
              type="email"
              placeholder="вашия@имейл.com"
              class="newsletter__input"
              required
            />
          </div>
          <button
            type="submit"
            class="newsletter__button btn btn--primary btn--large"
          >
            Абонирай се
            <Icon name="mdi:arrow-right" class="newsletter__button-icon" />
          </button>
        </form>
        <p class="newsletter__privacy">
          Грижим се за вашата поверителност. Няма спам, само вдъхновение.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const email = ref('')

const handleSubmit = () => {
  // Newsletter signup logic placeholder
  console.log('Newsletter signup:', email.value)
  // TODO: Add success message
  email.value = ''
}
</script>

<style scoped lang="scss">
@use '~/assets/styles/colors' as *;
@use '~/assets/styles/breakpoints' as *;
@use '~/assets/styles/fonts' as *;

.newsletter {
  width: 100%;
  padding: 4rem 0;
  background: $grad-brand-a;
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
    top: -50%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba($brand, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -5%;
    width: 300px;
    height: 300px;
    background: radial-gradient(
      circle,
      rgba($brand-ink, 0.08) 0%,
      transparent 70%
    );
    border-radius: 50%;
    pointer-events: none;
  }

  &__container {
    max-width: 1035px;
    margin: 0 auto;
    padding: 0 16px;
    position: relative;
    z-index: 1;

    @include up(md) {
      padding: 0 24px;
    }
  }

  &__content {
    background: $bg-card;
    border-radius: 20px;
    border: 2px solid $brand;
    padding: 2.5rem 1.5rem;
    box-shadow: 0 12px 32px rgba($brand-ink, 0.12);
    text-align: center;

    @include up(md) {
      padding: 3.5rem 3rem;
    }
  }

  &__visual {
    margin-bottom: 2rem;
  }

  &__icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: $grad-brand-b;
    border-radius: 50%;
    box-shadow: 0 8px 20px rgba($brand, 0.3);
    margin: 0 auto;

    @include up(md) {
      width: 96px;
      height: 96px;
    }
  }

  &__icon {
    width: 40px;
    height: 40px;
    color: $color-white;

    @include up(md) {
      width: 48px;
      height: 48px;
    }
  }

  &__text {
    margin-bottom: 2rem;

    @include up(md) {
      margin-bottom: 2.5rem;
    }
  }

  &__heading {
    font-family: $font-heading;
    font-weight: 700;
    font-size: clamp(1.75rem, 5vw, 2.5rem);
    color: $brand-ink;
    margin: 0 0 1rem 0;
    letter-spacing: 0.02em;
    line-height: 1.2;
  }

  &__subtext {
    font-family: $font-body;
    font-weight: 400;
    font-size: 1rem;
    color: $text-secondary;
    line-height: 1.7;
    max-width: 644px;
    margin: 0 auto;

    @include up(md) {
      font-size: 1.0625rem;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    max-width: 540px;
    margin: 0 auto 1.5rem;

    @include up(sm) {
      flex-direction: row;
      gap: 1rem;
    }
  }

  &__input-group {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
  }

  &__input-icon {
    position: absolute;
    left: 1rem;
    width: 20px;
    height: 20px;
    color: $text-secondary;
    pointer-events: none;
  }

  &__input {
    font-family: $font-body;
    font-size: 1rem;
    padding: 14px 16px 14px 48px;
    border: 2px solid $border-base;
    border-radius: 10px;
    outline: none;
    transition: all 0.2s ease;
    width: 100%;
    background: $bg-page;
    color: $text-primary;

    &::placeholder {
      color: $text-secondary;
    }

    &:focus {
      border-color: $brand;
      box-shadow: 0 0 0 4px rgba($brand, 0.15);
      background: $color-white;
    }

    &:focus + .newsletter__input-icon {
      color: $brand;
    }
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    white-space: nowrap;
    min-width: 160px;

    @include up(sm) {
      min-width: 180px;
    }
  }

  &__button-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;
  }

  &__button:hover &__button-icon {
    transform: translateX(4px);
  }

  &__privacy {
    font-family: $font-body;
    font-size: 0.8125rem;
    color: $text-secondary;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    &::before {
      content: '🔒';
      font-size: 0.875rem;
    }
  }
}
</style>
