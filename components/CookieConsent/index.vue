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
            <button class="cookie-btn cookie-btn--primary" type="button" @click="acceptAll">
              Приемам всички
            </button>
            <button class="cookie-btn cookie-btn--secondary" type="button" @click="rejectAll">
              Само необходимите
            </button>
            <button class="cookie-btn cookie-btn--text" type="button" @click="openSettings">
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
            <button class="cookie-btn cookie-btn--primary" type="button" @click="savePreferences">
              Запази избора
            </button>
            <button class="cookie-btn cookie-btn--secondary" type="button" @click="acceptAll">
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
.cookie-banner {
  position: fixed;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  z-index: 10001;
  max-width: 720px;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  font-family: "Inter", sans-serif;

  &__content {
    padding: 1.25rem 1.5rem;
  }

  &__title {
    margin: 0 0 0.35rem;
    font-size: 16px;
    font-weight: 700;
    color: #1f2937;
  }

  &__description {
    margin: 0;
    font-size: 13.5px;
    line-height: 1.55;
    color: #4b5563;
  }

  &__link {
    color: #e67e22;
    text-decoration: underline;

    &:hover {
      color: #cf6d15;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 1rem;
  }
}

.cookie-btn {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  border: 1px solid transparent;

  &--primary {
    background: #e67e22;
    color: #ffffff;

    &:hover {
      background: #cf6d15;
    }
  }

  &--secondary {
    background: #ffffff;
    color: #1f2937;
    border-color: #d1d5db;

    &:hover {
      border-color: #9ca3af;
      background: #f9fafb;
    }
  }

  &--text {
    background: transparent;
    color: #6b7280;
    text-decoration: underline;
    padding-left: 0.5rem;
    padding-right: 0.5rem;

    &:hover {
      color: #1f2937;
    }
  }

  &:focus-visible {
    outline: 2px solid #e67e22;
    outline-offset: 2px;
  }
}

.cookie-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10002;
  background: rgba(17, 24, 39, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.cookie-modal {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
  font-family: "Inter", sans-serif;
  outline: none;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
  }

  &__close {
    background: transparent;
    border: none;
    font-size: 16px;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 8px;

    &:hover {
      background: #f3f4f6;
      color: #1f2937;
    }
  }

  &__intro {
    margin: 0 0 1.25rem;
    font-size: 13.5px;
    line-height: 1.55;
    color: #4b5563;
  }

  &__categories {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 1.5rem;
  }
}

.cookie-category {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  &__name {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
  }

  &__status {
    margin: 0.1rem 0 0;
    font-size: 12px;
    font-weight: 600;
    color: #10b981;
  }

  &__description {
    margin: 0.6rem 0 0;
    font-size: 13px;
    line-height: 1.5;
    color: #6b7280;
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
      background: #e67e22;

      &::before {
        transform: translateX(20px);
      }
    }

    &:focus-visible + .cookie-toggle__slider {
      outline: 2px solid #e67e22;
      outline-offset: 2px;
    }
  }

  &__slider {
    position: absolute;
    inset: 0;
    background: #d1d5db;
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
      background: #ffffff;
      border-radius: 50%;
      transition: transform 0.2s ease;
    }
  }

  &--locked .cookie-toggle__slider {
    cursor: not-allowed;
    opacity: 0.7;
    background: #10b981;

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
  transform: translateY(20px);
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

@media (max-width: 480px) {
  .cookie-banner {
    left: 0.5rem;
    right: 0.5rem;
    bottom: 0.5rem;

    &__actions .cookie-btn {
      flex: 1 1 100%;
      text-align: center;
    }
  }
}
</style>
