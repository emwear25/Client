<template>
  <div class="auth-page">
    <div class="auth-page__container">
      <div class="auth-card">
        <!-- Logo/Header -->
        <div class="auth-card__header">
          <NuxtLink to="/" class="auth-card__logo">
            <h1>emWear</h1>
          </NuxtLink>
          <h2 class="auth-card__title">Създайте профил</h2>
          <p class="auth-card__subtitle">Започнете да пазарувате днес</p>
        </div>

        <!-- Register Form -->
        <form class="auth-form" @submit.prevent="handleRegister">
          <!-- Email Input -->
          <div class="form-group">
            <label for="email" class="form-label">Имейл</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-input"
              :class="{ 'form-input--error': emailError }"
              placeholder="your@email.com"
              required
              autocomplete="email"
              :disabled="isLoading"
              @blur="validateEmail"
            >
            <span v-if="emailError" class="form-error">{{ emailError }}</span>
          </div>

          <!-- Password Input -->
          <div class="form-group">
            <label for="password" class="form-label">Парола</label>
            <div class="password-input">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'form-input--error': passwordError }"
                placeholder="Минимум 8 символа"
                required
                autocomplete="new-password"
                :disabled="isLoading"
                @input="validatePassword"
              >
              <button
                type="button"
                class="password-toggle"
                :aria-label="showPassword ? 'Скрий парола' : 'Покажи парола'"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2" />
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3 3L17 17M10 7C11.66 7 13 8.34 13 10C13 10.35 12.94 10.69 12.83 11M7 10C7 8.34 8.34 7 10 7M7 10C7 11.66 8.34 13 10 13C10.35 13 10.69 12.94 11 12.83M2 10C2 10 5 4 10 4C11.33 4 12.55 4.36 13.61 4.93M18 10C18 10 15 16 10 16C8.67 16 7.45 15.64 6.39 15.07"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
            <span v-if="passwordError" class="form-error">{{ passwordError }}</span>

            <!-- Password Strength Indicator -->
            <div v-if="password" class="password-strength">
              <div class="password-strength__bar">
                <div
                  class="password-strength__fill"
                  :class="`password-strength__fill--${passwordStrength}`"
                  :style="{ width: passwordStrengthWidth }"
                />
              </div>
              <span class="password-strength__label">{{ passwordStrengthLabel }}</span>
            </div>
          </div>

          <!-- Confirm Password Input -->
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Потвърдете паролата</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ 'form-input--error': confirmPasswordError }"
              placeholder="Въведете паролата отново"
              required
              autocomplete="new-password"
              :disabled="isLoading"
              @blur="validateConfirmPassword"
            >
            <span v-if="confirmPasswordError" class="form-error">{{ confirmPasswordError }}</span>
          </div>

          <!-- Terms & Conditions -->
          <label class="checkbox-label">
            <input v-model="acceptTerms" type="checkbox" required >
            <span>
              Приемам
              <NuxtLink to="/terms" class="link-primary" target="_blank"
                >Условията за ползване</NuxtLink
              >
              и
              <NuxtLink to="/privacy" class="link-primary" target="_blank"
                >Политиката за поверителност</NuxtLink
              >
            </span>
          </label>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn--primary btn--large btn--full"
            :disabled="isLoading || !isFormValid"
          >
            <span v-if="!isLoading">Регистрация</span>
            <span v-else class="loading-spinner">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-dasharray="50"
                  stroke-dashoffset="25"
                />
              </svg>
              Регистриране...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="auth-divider">
          <span>или</span>
        </div>

        <!-- Google Register Button -->
        <button
          type="button"
          class="btn btn--google btn--large btn--full"
          :disabled="isLoading"
          @click="handleGoogleLogin"
        >
          <svg class="google-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>Регистрирайте се с Google</span>
        </button>

        <!-- Login Link -->
        <div class="auth-card__footer">
          <p>
            Вече имате профил?
            <NuxtLink to="/login" class="link-primary"> Влезте </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useToast } from "~/composables/useToast";

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

// Form state
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const acceptTerms = ref(false);
const isLoading = ref(false);

// Validation errors
const emailError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");

// Password strength
const passwordStrength = computed(() => {
  if (!password.value) return "weak";

  let strength = 0;
  if (password.value.length >= 8) strength++;
  if (password.value.length >= 12) strength++;
  if (/[a-z]/.test(password.value) && /[A-Z]/.test(password.value)) strength++;
  if (/\d/.test(password.value)) strength++;
  if (/[^a-zA-Z0-9]/.test(password.value)) strength++;

  if (strength <= 2) return "weak";
  if (strength <= 3) return "medium";
  return "strong";
});

const passwordStrengthWidth = computed(() => {
  const widths = { weak: "33%", medium: "66%", strong: "100%" };
  return widths[passwordStrength.value];
});

const passwordStrengthLabel = computed(() => {
  const labels = { weak: "Слаба", medium: "Средна", strong: "Силна" };
  return labels[passwordStrength.value];
});

// Form validation
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value) {
    emailError.value = "Имейлът е задължителен";
  } else if (!emailRegex.test(email.value)) {
    emailError.value = "Невалиден имейл адрес";
  } else {
    emailError.value = "";
  }
};

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = "Паролата е задължителна";
  } else if (password.value.length < 8) {
    passwordError.value = "Паролата трябва да е минимум 8 символа";
  } else {
    passwordError.value = "";
  }

  // Re-validate confirm password if it's filled
  if (confirmPassword.value) {
    validateConfirmPassword();
  }
};

const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    confirmPasswordError.value = "Потвърдете паролата";
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = "Паролите не съвпадат";
  } else {
    confirmPasswordError.value = "";
  }
};

const isFormValid = computed(() => {
  return (
    email.value &&
    password.value &&
    confirmPassword.value &&
    !emailError.value &&
    !passwordError.value &&
    !confirmPasswordError.value &&
    acceptTerms.value
  );
});

// Handle registration
const handleRegister = async () => {
  // Validate all fields
  validateEmail();
  validatePassword();
  validateConfirmPassword();

  if (!isFormValid.value) {
    toast.error("Моля, попълнете всички полета правилно");
    return;
  }

  isLoading.value = true;

  try {
    await authStore.register(email.value, password.value);

    toast.success("Успешна регистрация! Добре дошли!");

    // Redirect to home
    router.push("/");
  } catch (error: any) {
    toast.error(error.message || "Грешка при регистрация");
  } finally {
    isLoading.value = false;
  }
};

// Handle Google login/register - redirects to backend which handles OAuth flow
const handleGoogleLogin = async () => {
  try {
    await authStore.loginWithGoogle("/");
  } catch (error: any) {
    toast.error(error.message || "Грешка при регистрация с Google");
  }
};

// SEO
useHead({
  title: "Регистрация - emWear",
  meta: [
    {
      name: "description",
      content:
        "Създайте профил в emWear и започнете да пазарувате персонализирани бродирани изделия.",
    },
  ],
});

// Redirect if already logged in
if (authStore.isAuthenticated) {
  router.push("/");
}
</script>

<style lang="scss" scoped>
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/fonts" as *;
@use "~/assets/styles/breakpoints" as *;

.auth-page {
  min-height: 100vh;
  background: $grad-brand-a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;

  &__container {
    width: 100%;
    max-width: 440px;
  }
}

.auth-card {
  background: $bg-card;
  border: 1px solid $border-base;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 0 8px 24px $shadow-soft;

  @include up(sm) {
    padding: 3rem 2.5rem;
  }

  &__header {
    text-align: center;
    margin-bottom: 2rem;
  }

  &__logo {
    display: inline-block;
    text-decoration: none;
    margin-bottom: 1.5rem;

    h1 {
      font-family: $font-heading;
      font-size: 2rem;
      font-weight: 700;
      color: $brand-ink;
      margin: 0;
      letter-spacing: -0.02em;
    }
  }

  &__title {
    font-family: $font-heading;
    font-size: 1.75rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 0.5rem;
  }

  &__subtitle {
    font-family: $font-body;
    font-size: 1rem;
    color: $text-secondary;
    margin: 0;
  }

  &__footer {
    text-align: center;
    margin-top: 1.5rem;

    p {
      font-family: $font-body;
      font-size: 0.9375rem;
      color: $text-secondary;
      margin: 0;
    }
  }
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.btn {
  &--full {
    width: 100%;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-family: $font-body;
  font-size: 0.875rem;
  font-weight: 500;
  color: $text-primary;
  letter-spacing: 0.01em;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  font-family: $font-body;
  font-size: 1rem;
  color: $text-primary;
  background: $bg-page;
  border: 1px solid $border-base;
  border-radius: 10px;
  transition: all 0.2s ease;

  &::placeholder {
    color: $text-secondary;
  }

  &:focus {
    outline: none;
    border-color: $brand;
    box-shadow: 0 0 0 3px rgba($brand, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--error {
    border-color: $error;

    &:focus {
      border-color: $error;
      box-shadow: 0 0 0 3px rgba($error, 0.1);
    }
  }
}

.form-error {
  font-family: $font-body;
  font-size: 0.8125rem;
  color: $error;
  margin-top: -0.25rem;
}

.password-input {
  position: relative;

  .form-input {
    padding-right: 3rem;
  }

  .password-toggle {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: $text-secondary;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s ease;

    &:hover {
      color: $brand-ink;
      background: rgba($brand, 0.1);
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: 2px;
    }
  }
}

.password-strength {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  &__bar {
    height: 4px;
    background: $border-base;
    border-radius: 2px;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    transition: all 0.3s ease;

    &--weak {
      width: 33%;
      background: $error;
    }

    &--medium {
      width: 66%;
      background: $warning;
    }

    &--strong {
      width: 100%;
      background: $success;
    }
  }

  &__label {
    font-family: $font-body;
    font-size: 0.8125rem;
    color: $text-secondary;
  }
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-family: $font-body;
  font-size: 0.875rem;
  color: $text-secondary;
  cursor: pointer;
  line-height: 1.5;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: $brand;
    margin-top: 0.125rem;
    flex-shrink: 0;
  }
}

.link-primary {
  color: $brand-ink;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: $brand;
  }

  &:focus-visible {
    outline: 2px solid $brand;
    outline-offset: 2px;
    border-radius: 4px;
  }
}

.auth-divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
    background: $border-base;
  }

  span {
    position: relative;
    display: inline-block;
    padding: 0 1rem;
    background: $bg-card;
    font-family: $font-body;
    font-size: 0.875rem;
    color: $text-secondary;
  }
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  svg {
    animation: spin 1s linear infinite;
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

.btn--google {
  background: $color-white;
  color: $text-primary;
  border: 1px solid $border-base;
  font-weight: 500;
  box-shadow: 0 2px 8px $shadow-soft;
  padding: 16px 32px;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  &:hover {
    background: $bg-page;
    border-color: $brand;
    box-shadow: 0 2px 12px $shadow-soft;
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .google-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }
}
</style>
