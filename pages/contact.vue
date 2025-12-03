<template>
  <div class="contact-page">
    <section class="contact">
      <!-- Left Side - Visual & Info -->
      <div class="contact__info-side">
        <div class="contact__info-content">
          <div class="contact__header">
            <span class="contact__eyebrow">Нека се свържем</span>
            <h1 class="contact__heading">Свържете се с нас</h1>
            <p class="contact__intro">
              Имате въпрос или искате да създадете персонализиран продукт? Очакваме вашето
              съобщение!
            </p>
          </div>

          <div class="contact__details">
            <div class="contact__detail-card">
              <div class="contact__detail-icon">
                <Icon name="mdi:email-outline" />
              </div>
              <div class="contact__detail-text">
                <h3 class="contact__detail-title">Имейл</h3>
                <a href="mailto:info@emwear.bg" class="contact__detail-link"> info@emwear.bg </a>
              </div>
            </div>

            <div class="contact__detail-card">
              <div class="contact__detail-icon">
                <Icon name="mdi:phone-outline" />
              </div>
              <div class="contact__detail-text">
                <h3 class="contact__detail-title">Телефон</h3>
                <a href="tel:+359890927520" class="contact__detail-link"> +359 89 092 7520 </a>
              </div>
            </div>

            <div class="contact__detail-card">
              <div class="contact__detail-icon">
                <Icon name="mdi:clock-outline" />
              </div>
              <div class="contact__detail-text">
                <h3 class="contact__detail-title">Работно време</h3>
                <p class="contact__detail-info">
                  Пон - Пет: 9:00 - 18:00<br >
                  Съб: 10:00 - 14:00
                </p>
              </div>
            </div>
          </div>

          <div class="contact__social">
            <h3 class="contact__social-title">Последвайте ни</h3>
            <div class="contact__social-links">
              <a
                href="https://www.facebook.com/emwearbg/"
                target="_blank"
                rel="noopener noreferrer"
                class="contact__social-link"
              >
                <Icon name="mdi:facebook" />
              </a>
              <a
                href="https://www.instagram.com/emwea.r/"
                target="_blank"
                rel="noopener noreferrer"
                class="contact__social-link"
              >
                <Icon name="mdi:instagram" />
              </a>
              <a
                href="https://www.tiktok.com/@emwear.bg"
                target="_blank"
                rel="noopener noreferrer"
                class="contact__social-link"
              >
                <Icon name="simple-icons:tiktok" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Form -->
      <div class="contact__form-side">
        <form class="contact-form" @submit.prevent="handleSubmit">
          <h2 class="contact-form__title">Изпратете ни съобщение</h2>

          <div class="contact-form__row">
            <div class="contact-form__field">
              <label for="name" class="contact-form__label">Име *</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                class="contact-form__input"
                placeholder="Вашето име"
                required
              >
            </div>

            <div class="contact-form__field">
              <label for="email" class="contact-form__label">Имейл *</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="contact-form__input"
                placeholder="email@example.com"
                required
              >
            </div>
          </div>

          <div class="contact-form__field">
            <label for="phone" class="contact-form__label">Телефон</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              class="contact-form__input"
              placeholder="+359 ..."
            >
          </div>

          <div class="contact-form__field">
            <label for="subject" class="contact-form__label">Тема *</label>
            <select
              id="subject"
              v-model="formData.subject"
              class="contact-form__input contact-form__select"
              required
            >
              <option value="">Изберете тема</option>
              <option value="order">Въпрос относно поръчка</option>
              <option value="custom">Персонализация</option>
              <option value="support">Поддръжка</option>
              <option value="other">Друго</option>
            </select>
          </div>

          <div class="contact-form__field">
            <label for="message" class="contact-form__label">Съобщение *</label>
            <textarea
              id="message"
              v-model="formData.message"
              class="contact-form__textarea"
              rows="6"
              placeholder="Вашето съобщение..."
              required
            />
          </div>

          <button
            type="submit"
            class="contact-form__submit btn btn--primary btn--large"
            :disabled="isSubmitting"
          >
            <Icon
              v-if="isSubmitting"
              name="mdi:loading"
              class="contact-form__submit-icon contact-form__submit-icon--spin"
            />
            <Icon v-else name="mdi:send" class="contact-form__submit-icon" />
            {{ isSubmitting ? "Изпращане..." : "Изпрати съобщение" }}
          </button>

          <p class="contact-form__note">* Задължителни полета. Отговаряме в рамките на 24 часа.</p>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

// Set page meta
useHead({
  title: "Контакти - emWear | Свържете се с нас",
  meta: [
    {
      name: "description",
      content:
        "Свържете се с emWear за въпроси относно персонализирани подаръци. Телефон: +359 89 092 7520, Имейл: info@emwear.bg. Отговаряме до 24 часа.",
    },
    {
      property: "og:title",
      content: "Контакти - emWear | Свържете се с нас",
    },
    {
      property: "og:description",
      content:
        "Свържете се с emWear за въпроси относно персонализирани подаръци. Телефон: +359 89 092 7520, Имейл: info@emwear.bg. Отговаряме до 24 часа.",
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
});

// Form state
const formData = reactive({
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
});

const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;

  // TODO: Implement actual form submission
  console.log("Form submitted:", formData);

  // Simulate API call
  setTimeout(() => {
    alert("Благодарим Ви! Вашето съобщение е изпратено успешно.");
    // Reset form
    formData.name = "";
    formData.email = "";
    formData.phone = "";
    formData.subject = "";
    formData.message = "";
    isSubmitting.value = false;
  }, 1500);
};
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

.contact-page {
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
  background: $bg-page;
}

.contact {
  display: grid;
  grid-template-columns: 1fr;
  min-height: calc(100vh - 120px);

  @include up(lg) {
    grid-template-columns: 45% 55%;
  }

  // Left Side - Info
  &__info-side {
    background: $grad-brand-b;
    color: $color-white;
    padding: 3rem 1.5rem;
    display: flex;
    align-items: center;

    @include up(md) {
      padding: 4rem 2.5rem;
    }

    @include up(lg) {
      padding: 5rem 3.5rem;
    }
  }

  &__info-content {
    max-width: 540px;
    margin: 0 auto;
    width: 100%;
  }

  &__header {
    margin-bottom: 3rem;

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
    background: rgba($color-white, 0.15);
    padding: 6px 16px;
    border-radius: 20px;
    margin-bottom: 1rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  &__heading {
    font-family: $font-heading;
    font-size: clamp(2.25rem, 6vw, 3.5rem);
    font-weight: 700;
    color: $color-white;
    margin: 0 0 1.5rem 0;
    line-height: 1.1;
    letter-spacing: 0.02em;
  }

  &__intro {
    font-family: $font-body;
    font-size: 1.0625rem;
    color: rgba($color-white, 0.9);
    line-height: 1.7;
    margin: 0;
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  &__detail-card {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  &__detail-icon {
    width: 48px;
    height: 48px;
    background: rgba($color-white, 0.15);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 24px;
    color: $brand;
  }

  &__detail-text {
    flex: 1;
  }

  &__detail-title {
    font-family: $font-heading;
    font-size: 1.125rem;
    font-weight: 500;
    color: $color-white;
    margin: 0 0 0.5rem 0;
  }

  &__detail-link {
    font-family: $font-body;
    font-size: 1rem;
    color: rgba($color-white, 0.85);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: $brand;
    }
  }

  &__detail-info {
    font-family: $font-body;
    font-size: 0.9375rem;
    color: rgba($color-white, 0.85);
    line-height: 1.6;
    margin: 0;
  }

  &__social {
    padding-top: 2rem;
    border-top: 1px solid rgba($color-white, 0.2);
  }

  &__social-title {
    font-family: $font-heading;
    font-size: 1.125rem;
    font-weight: 500;
    color: $color-white;
    margin: 0 0 1rem 0;
  }

  &__social-links {
    display: flex;
    gap: 1rem;
  }

  &__social-link {
    width: 48px;
    height: 48px;
    background: rgba($color-white, 0.1);
    border: 2px solid rgba($color-white, 0.2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-white;
    font-size: 24px;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      background: $brand;
      border-color: $brand;
      transform: translateY(-4px);
    }
  }

  // Right Side - Form
  &__form-side {
    background: $bg-card;
    padding: 3rem 1.5rem;
    display: flex;
    align-items: center;

    @include up(md) {
      padding: 4rem 2.5rem;
    }

    @include up(lg) {
      padding: 5rem 3.5rem;
    }
  }
}

.contact-form {
  max-width: 600px;
  margin: 0 auto;
  width: 100%;

  &__title {
    font-family: $font-heading;
    font-size: clamp(1.75rem, 4vw, 2.25rem);
    font-weight: 700;
    color: $brand-ink;
    margin: 0 0 2rem 0;
    line-height: 1.2;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @include up(sm) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__field {
    margin-bottom: 1.5rem;
  }

  &__label {
    display: block;
    font-family: $font-body;
    font-size: 0.9375rem;
    font-weight: 600;
    color: $brand-ink;
    margin-bottom: 0.5rem;
  }

  &__input,
  &__textarea,
  &__select {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid $border-base;
    border-radius: 10px;
    font-family: $font-body;
    font-size: 1rem;
    color: $text-primary;
    background: $bg-page;
    transition: all 0.2s ease;

    &::placeholder {
      color: $text-secondary;
    }

    &:focus {
      outline: none;
      border-color: $brand;
      box-shadow: 0 0 0 4px rgba($brand, 0.1);
      background: $color-white;
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 140px;
  }

  &__submit {
    width: 100%;
    margin-top: 1rem;
  }

  &__submit-icon {
    width: 20px;
    height: 20px;

    &--spin {
      animation: spin 1s linear infinite;
    }
  }

  &__note {
    font-family: $font-body;
    font-size: 0.8125rem;
    color: $text-secondary;
    text-align: center;
    margin: 1rem 0 0 0;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
