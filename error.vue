<template>
  <div class="error-page">
    <div class="container">
      <div class="error-content">
        <!-- Error Icon -->
        <div class="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <!-- Error Code -->
        <h1 class="error-code">404</h1>

        <!-- Error Message -->
        <h2 class="error-title">Страницата не е намерена</h2>
        <p class="error-description">
          Съжаляваме, но страницата, която търсите, не съществува или е била
          преместена.
        </p>

        <!-- Action Buttons -->
        <div class="error-actions">
          <NuxtLink to="/" class="btn btn--primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Към началото
          </NuxtLink>
          <NuxtLink to="/products" class="btn btn--secondary"> Разгледай продукти </NuxtLink>
        </div>

        <!-- Popular Links -->
        <div class="error-suggestions">
          <h3 class="suggestions-title">Може да потърсите:</h3>
          <ul class="suggestions-list">
            <li><NuxtLink to="/category/kids-bags">Детски чанти</NuxtLink></li>
            <li><NuxtLink to="/category/kid-bathrobes">Детски халати</NuxtLink></li>
            <li><NuxtLink to="/category/kids-towels">Детски кърпи</NuxtLink></li>
            <li><NuxtLink to="/contact">Свържете се с нас</NuxtLink></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageSEO } from "~/composables/useSEO";

// Set SEO for 404 page
usePageSEO({
  title: "404 - Страницата не е намерена",
  description: "Съжаляваме, но страницата, която търсите, не съществува. Върнете се към началната страница или разгледайте нашите продукти.",
  noindex: true, // Don't index error pages
});

// Clear the error when navigating away
const error = useError();
onBeforeUnmount(() => {
  if (error.value) {
    clearError();
  }
});
</script>

<style lang="scss" scoped>
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/fonts" as *;
@use "~/assets/styles/breakpoints" as *;

.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: $bg-page;
}

.container {
  max-width: 600px;
  width: 100%;
}

.error-content {
  text-align: center;
}

.error-icon {
  margin-bottom: 2rem;

  svg {
    width: 80px;
    height: 80px;
    color: $brand;
    margin: 0 auto;
  }
}

.error-code {
  font-family: $font-heading;
  font-size: clamp(6rem, 20vw, 10rem);
  font-weight: 700;
  color: $brand;
  line-height: 1;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, $brand 0%, darken($brand, 20%) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-title {
  font-family: $font-heading;
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: $brand-ink;
  margin: 0 0 1rem;
}

.error-description {
  font-size: 1.125rem;
  color: $text-secondary;
  margin: 0 0 2.5rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;

  svg {
    width: 20px;
    height: 20px;
  }

  &--primary {
    background: $brand;
    color: white;

    &:hover {
      background: darken($brand, 10%);
      transform: translateY(-2px);
    }
  }

  &--secondary {
    background: white;
    color: $brand-ink;
    border: 2px solid $border-base;

    &:hover {
      border-color: $brand;
      color: $brand;
    }
  }
}

.error-suggestions {
  padding-top: 2rem;
  border-top: 1px solid $border-base;
}

.suggestions-title {
  font-family: $font-heading;
  font-size: 1.125rem;
  color: $text-secondary;
  margin: 0 0 1rem;
  font-weight: 500;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem 1.5rem;

  a {
    color: $brand;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;

    &:hover {
      color: darken($brand, 15%);
      text-decoration: underline;
    }
  }
}
</style>
