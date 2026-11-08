<template>
  <section class="newsletter">
    <div class="newsletter__container">
      <div class="newsletter__content">
        <div class="newsletter__visual">
          <div class="newsletter__icon-wrapper">
            <svg
              class="newsletter__icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 21s-7.2-4.5-9.6-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.1 4 2.3.8-1.2 2-2.3 4-2.3 3.5 0 5 3.5 3.6 6.5C19.2 16.5 12 21 12 21z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
        <div class="newsletter__text">
          <h2 class="newsletter__heading">Присъединете се към нашето семейство</h2>
          <p class="newsletter__subtext">
            Бъдете първи, които научават за нови колекции, специални оферти и ексклузивни дизайни
          </p>
        </div>
        <form class="newsletter__form" @submit.prevent="handleSubmit">
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
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Абонирай се</span>
            <span v-else>Изпращане...</span>
            <Icon v-if="!isLoading" name="mdi:arrow-right" class="newsletter__button-icon" />
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
import { useApi } from "~/composables/useApi";
import { useToast } from "~/composables/useToast";

const email = ref("");
const isLoading = ref(false);
const toast = useToast();

const handleSubmit = async () => {
  if (!email.value || isLoading.value) return;

  isLoading.value = true;

  try {
    const api = useApi();
    const response = await api.post("subscriptions", {
      email: email.value,
    });

    if (response && response.success) {
      toast.success(response.message || "Успешно се абонирахте за нашия бюлетин!");
      email.value = "";
    }
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Възникна грешка при абониране. Моля опитайте отново.";
    toast.error(errorMessage);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

.newsletter {
  width: 100%;
  padding: 4rem 0;
  background: transparent;
  position: relative;
  overflow: hidden;

  @include up(md) {
    padding: 5rem 0;
  }

  @include up(lg) {
    padding: 6rem 0;
  }

  &__container {
    width: 100%;
    max-width: 1610px;
    margin: 0 auto;
    padding: 0 1rem;
    position: relative;
    z-index: 1;

    @include up(md) {
      padding: 0 2rem;
    }
  }

  &__content {
    background: $bg-card;
    border: 1px solid $border-base;
    padding: 2.5rem 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, $brand 0%, $brand-accent-1 100%);
    box-shadow: 0 4px 12px rgba($brand, 0.2);
    margin: 0 auto;

    @include up(md) {
      width: 80px;
      height: 80px;
    }
  }

  &__icon {
    width: 32px;
    height: 32px;
    color: $color-white;

    @include up(md) {
      width: 40px;
      height: 40px;
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
    z-index: 1;
  }

  &__input {
    font-family: $font-body;
    font-size: 1rem;
    padding: 14px 16px 14px 48px;
    border: 1px solid $border-base;
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
      box-shadow: 0 0 0 3px rgba($brand, 0.1);
      background: $color-white;
    }

    &:focus ~ .newsletter__input-icon {
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
      content: "🔒";
      font-size: 0.875rem;
    }
  }
}
</style>
