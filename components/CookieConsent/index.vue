<template>
  <ClientOnly>
    <!-- Consent banner -->
    <Transition name="cookie-slide">
      <div
        v-if="isBannerVisible && !isSettingsOpen"
        class="cookie-banner"
        role="dialog"
        aria-live="polite"
        aria-label="Съгласие за използване на бисквитки"
      >
        <div class="cookie-banner__content">
          <div class="cookie-banner__text">
            <p class="cookie-banner__title">🍪 Използваме бисквитки</p>
            <p class="cookie-banner__description">
              Използваме бисквитки, за да осигурим основните функции на сайта, да
              анализираме трафика и да измерваме рекламните си кампании. Можете да
              приемете всички, да продължите само с необходимите или да изберете сами.
              Повече информация в нашата
              <NuxtLink to="/privacy-policy" class="cookie-banner__link">
                Политика за поверителност</NuxtLink>.
            </p>
          </div>
          <div class="cookie-banner__actions">
            <button class="btn btn--primary cookie-banner__btn" type="button" @click="acceptAll">
              Приемам всички
            </button>
            <button class="btn btn--ghost cookie-banner__btn" type="button" @click="rejectAll">
              Само необходимите
            </button>
            <button class="cookie-banner__settings-btn" type="button" @click="openSettings">
              Настройки
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Preferences modal -->
    <Transition name="cookie-fade">
      <div
        v-if="isSettingsOpen"
        class="cookie-modal-overlay"
        @click.self="closeModal"
        @keydown.esc="closeModal"
      >
        <div
          ref="modalRef"
          class="cookie-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          tabindex="-1"
        >
          <div class="cookie-modal__header">
            <h2 id="cookie-modal-title" class="cookie-modal__title">
              Настройки на бисквитките
            </h2>
            <button
              class="cookie-modal__close"
              type="button"
              aria-label="Затвори настройките"
              @click="closeModal"
            >
              ✕
            </button>
          </div>

          <p class="cookie-modal__intro">
            Изберете кои бисквитки разрешавате. Можете да промените избора си по всяко
            време от връзката „Настройки на бисквитките" в долната част на сайта.
          </p>

          <div class="cookie-modal__categories">
            <div class="cookie-category">
              <div class="cookie-category__header">
                <div>
                  <p class="cookie-category__name">Необходими</p>
                  <p class="cookie-category__status">Винаги активни</p>
                </div>
                <label class="cookie-toggle cookie-toggle--locked">
                  <input type="checkbox" checked disabled aria-label="Необходими бисквитки - винаги активни" />
                  <span class="cookie-toggle__slider" />
                </label>
              </div>
              <p class="cookie-category__description">
                Осигуряват основни функции като количката, влизането в профила и
                сигурността на сайта. Без тях сайтът не може да работи и затова не могат
                да бъдат изключени.
              </p>
            </div>

            <div class="cookie-category">
              <div class="cookie-category__header">
                <p class="cookie-category__name">Аналитични</p>
                <label class="cookie-toggle">
                  <input
                    v-model="draft.analytics"
                    type="checkbox"
                    aria-label="Разреши аналитични бисквитки"
                  />
                  <span class="cookie-toggle__slider" />
                </label>
              </div>
              <p class="cookie-category__description">
                Помагат ни да разберем как посетителите използват сайта (Google
                Analytics), за да подобряваме съдържанието и пазаруването. Данните се
                събират обобщено.
              </p>
            </div>

            <div class="cookie-category">
              <div class="cookie-category__header">
                <p class="cookie-category__name">Маркетингови</p>
                <label class="cookie-toggle">
                  <input
                    v-model="draft.marketing"
                    type="checkbox"
                    aria-label="Разреши маркетингови бисквитки"
                  />
                  <span class="cookie-toggle__slider" />
                </label>
              </div>
              <p class="cookie-category__description">
                Използват се за измерване на рекламните ни кампании и показване на
                подходящи предложения (Meta/Facebook Pixel).
              </p>
            </div>
          </div>

          <div class="cookie-modal__actions">
            <button class="btn btn--primary cookie-modal__btn" type="button" @click="savePreferences">
              Запази избора
            </button>
            <button class="btn btn--ghost cookie-modal__btn" type="button" @click="acceptAll">
              Приемам всички
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useCookieConsent } from "~/composables/useCookieConsent";

const {
  categories,
  isBannerVisible,
  isSettingsOpen,
  initConsent,
  acceptAll,
  rejectAll,
  saveConsent,
  openSettings,
  closeSettings,
  hasValidConsent,
} = useCookieConsent();

// Local draft so toggling in the modal doesn't apply until "Save"
const draft = reactive({
  analytics: false,
  marketing: false,
});

const modalRef = ref<HTMLElement | null>(null);

const savePreferences = () => {
  saveConsent({
    necessary: true,
    analytics: draft.analytics,
    marketing: draft.marketing,
  });
};

const closeModal = () => {
  closeSettings();
  // If the visitor has never decided, bring the banner back
  if (!hasValidConsent.value) {
    isBannerVisible.value = true;
  }
};

// Sync draft with saved choice and move focus when the modal opens
watch(isSettingsOpen, async (open) => {
  if (open) {
    draft.analytics = categories.value.analytics;
    draft.marketing = categories.value.marketing;
    await nextTick();
    modalRef.value?.focus();
  }
});

onMounted(() => {
  initConsent();
});
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/fonts" as *;
@use "~/assets/styles/breakpoints" as *;

.cookie-banner {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10001;
  background: $bg-card;
  border-top: 1px solid $border-base;
  box-shadow: 0 -8px 32px $shadow-med;
  font-family: $font-ui;
  padding-bottom: env(safe-area-inset-bottom, 0);

  @include up(md) {
    left: 1.5rem;
    right: auto;
    bottom: 1.5rem;
    max-width: 480px;
    border: 1px solid $border-base;
    border-radius: 16px;
    padding-bottom: 0;
  }

  &__content {
    padding: 1.25rem 1rem;

    @include up(sm) {
      padding: 1.25rem 1.5rem;
    }
  }

  &__title {
    margin: 0 0 0.35rem;
    font-family: $font-heading;
    font-size: 1rem;
    font-weight: 600;
    color: $brand-ink;
  }

  &__description {
    margin: 0;
    font-size: 0.845rem;
    line-height: 1.55;
    color: $text-secondary;
  }

  &__link {
    color: $brand-ink;
    font-weight: 500;
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      color: $color-sage-deep;
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;

    @include up(sm) {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.6rem;
    }
  }

  &__btn {
    width: 100%;
    padding: 10px 20px;
    font-size: 0.9375rem;

    @include up(sm) {
      width: auto;
      flex: 0 0 auto;
    }
  }

  &__settings-btn {
    background: transparent;
    border: none;
    padding: 0.5rem;
    font-family: $font-ui;
    font-size: 0.875rem;
    font-weight: 500;
    color: $text-secondary;
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: $brand-ink;
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: 2px;
      border-radius: 4px;
    }
  }
}

.cookie-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10002;
  background: rgba(47, 58, 42, 0.45);
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @include up(sm) {
    align-items: center;
    padding: 1rem;
  }
}

.cookie-modal {
  background: $bg-card;
  border-radius: 16px 16px 0 0;
  width: 100%;
  max-height: 88dvh;
  overflow-y: auto;
  padding: 1.25rem 1rem calc(1.25rem + env(safe-area-inset-bottom, 0));
  font-family: $font-ui;
  outline: none;

  @include up(sm) {
    border: 1px solid $border-base;
    border-radius: 16px;
    max-width: 520px;
    max-height: 90vh;
    padding: 1.5rem;
    box-shadow: 0 16px 48px $shadow-med;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  &__title {
    margin: 0;
    font-family: $font-heading;
    font-size: 1.125rem;
    font-weight: 600;
    color: $brand-ink;
  }

  &__close {
    background: transparent;
    border: 1px solid $border-base;
    border-radius: 999px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    color: $brand-ink;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      background: $brand;
      border-color: $brand;
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: 2px;
    }
  }

  &__intro {
    margin: 0 0 1.25rem;
    font-size: 0.845rem;
    line-height: 1.55;
    color: $text-secondary;
  }

  &__categories {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    @include up(sm) {
      gap: 1rem;
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1.5rem;

    @include up(sm) {
      flex-direction: row;
      gap: 0.6rem;
    }
  }

  &__btn {
    width: 100%;
    padding: 10px 20px;
    font-size: 0.9375rem;

    @include up(sm) {
      width: auto;
    }
  }
}

.cookie-category {
  background: $bg-page;
  border: 1px solid $border-base;
  border-radius: 12px;
  padding: 0.875rem 1rem;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  &__name {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
    color: $brand-ink;
  }

  &__status {
    margin: 0.1rem 0 0;
    font-size: 0.75rem;
    font-weight: 600;
    color: $success;
  }

  &__description {
    margin: 0.6rem 0 0;
    font-size: 0.8125rem;
    line-height: 1.5;
    color: $text-secondary;
  }
}

.cookie-toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .cookie-toggle__slider {
      background: $color-sage-deep;

      &::before {
        transform: translateX(20px);
      }
    }

    &:focus-visible + .cookie-toggle__slider {
      outline: 2px solid $brand;
      outline-offset: 2px;
    }
  }

  &__slider {
    position: absolute;
    inset: 0;
    background: $border-base;
    border-radius: 24px;
    cursor: pointer;
    transition: background 0.2s ease;

    &::before {
      content: "";
      position: absolute;
      width: 18px;
      height: 18px;
      left: 3px;
      top: 3px;
      background: $color-white;
      border-radius: 50%;
      box-shadow: 0 1px 3px $shadow-med;
      transition: transform 0.2s ease;
    }
  }

  &--locked .cookie-toggle__slider {
    cursor: not-allowed;
    opacity: 0.85;
    background: $success;

    &::before {
      transform: translateX(20px);
    }
  }
}

// Transitions
.cookie-slide-enter-active,
.cookie-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.cookie-slide-enter-from,
.cookie-slide-leave-to {
  transform: translateY(24px);
  opacity: 0;
}

.cookie-fade-enter-active,
.cookie-fade-leave-active {
  transition: opacity 0.2s ease;
}

.cookie-fade-enter-from,
.cookie-fade-leave-to {
  opacity: 0;
}
</style>
