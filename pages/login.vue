<template>
  <div v-if="!checkingAuth" class="auth-page">
    <div class="auth-page__container">
      <div class="auth-card">
        <!-- Logo/Header -->
        <div class="auth-card__header">
          <NuxtLink to="/" class="auth-card__logo">
            <h1>emWear</h1>
          </NuxtLink>
          <h2 class="auth-card__title">Добре дошли отново</h2>
          <p class="auth-card__subtitle">Влезте в профила си</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="auth-form">
          <!-- Email Input -->
          <div class="form-group">
            <label for="email" class="form-label">Имейл</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-input"
              placeholder="your@email.com"
              required
              autocomplete="email"
              :disabled="isLoading"
            />
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
                placeholder="••••••••"
                required
                autocomplete="current-password"
                :disabled="isLoading"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Скрий парола' : 'Покажи парола'"
              >
                <svg v-if="showPassword" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" stroke="currentColor" stroke-width="2"/>
                  <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 3L17 17M10 7C11.66 7 13 8.34 13 10C13 10.35 12.94 10.69 12.83 11M7 10C7 8.34 8.34 7 10 7M7 10C7 11.66 8.34 13 10 13C10.35 13 10.69 12.94 11 12.83M2 10C2 10 5 4 10 4C11.33 4 12.55 4.36 13.61 4.93M18 10C18 10 15 16 10 16C8.67 16 7.45 15.64 6.39 15.07" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="form-row">
            <label class="checkbox-label">
              <input type="checkbox" v-model="rememberMe" />
              <span>Запомни ме</span>
            </label>
            <NuxtLink to="/forgot-password" class="link-secondary">
              Забравена парола?
            </NuxtLink>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn--primary btn--large btn--full"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Вход</span>
            <span v-else class="loading-spinner">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="50" stroke-dashoffset="25"/>
              </svg>
              Влизане...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="auth-divider">
          <span>или</span>
        </div>

        <!-- Register Link -->
        <div class="auth-card__footer">
          <p>
            Нямате профил?
            <NuxtLink to="/register" class="link-primary">
              Регистрирайте се
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

// Form state
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)
const checkingAuth = ref(true)

// Handle login
const handleLogin = async () => {
  isLoading.value = true

  try {
    await authStore.login(email.value, password.value)
    
    toast.success('Успешно влизане!')
    
    // Wait a bit for state to update
    await nextTick()
    
    // Redirect to intended page or home
    const redirect = (route.query.redirect as string) || '/'
    await navigateTo(redirect)
  } catch (error: any) {
    toast.error(error.message || 'Грешка при влизане')
  } finally {
    isLoading.value = false
  }
}

// Check auth on mount
onMounted(() => {
  // Wait for auth to initialize
  const checkInterval = setInterval(() => {
    if (authStore.isInitialized) {
      clearInterval(checkInterval)
      if (authStore.isAuthenticated) {
        console.log('[Login Page] User authenticated, redirecting...')
        navigateTo('/')
      } else {
        checkingAuth.value = false
      }
    }
  }, 50)

  // Timeout after 2 seconds
  setTimeout(() => {
    clearInterval(checkInterval)
    checkingAuth.value = false
  }, 2000)
})

// SEO
useHead({
  title: 'Вход - emWear',
  meta: [
    { name: 'description', content: 'Влезте в профила си в emWear за да управлявате поръчките си.' }
  ]
})
</script>

<style lang="scss" scoped>
@use '~/assets/styles/colors' as *;
@use '~/assets/styles/fonts' as *;
@use '~/assets/styles/breakpoints' as *;

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

.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: $font-body;
  font-size: 0.875rem;
  color: $text-secondary;
  cursor: pointer;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: $brand;
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

.link-secondary {
  font-family: $font-body;
  font-size: 0.875rem;
  color: $text-secondary;
  text-decoration: none;
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

.auth-divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;

  &::before {
    content: '';
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
</style>
