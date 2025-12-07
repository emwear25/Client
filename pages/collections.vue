<template>
  <div class="collections">
    <h1 class="collections__title">Колекции</h1>

    <div v-if="loading" class="collections__loading">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="collections__error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="categories.length === 0" class="collections__empty">
      <p>Няма налични категории</p>
    </div>

    <div v-else class="collections__grid">
      <NuxtLink
        v-for="category in categories"
        :key="category._id"
        :to="`/category/${category.slug}`"
        class="collections__card"
        :class="{ 'collections__card--has-image': category.imageUrl }"
      >
        <div
          class="collections__card-bg"
          :style="category.imageUrl ? { backgroundImage: `url(${category.imageUrl})` } : {}"
        ></div>
        <div class="collections__card-overlay"></div>
        <div class="collections__card-content">
          <h2 class="collections__card-title">{{ category.displayName }}</h2>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from "~/composables/useApi";

// Set page background to white
useHead({
  style: [
    {
      children: "html, body { background-color: #fff !important; }",
    },
  ],
});

interface Category {
  _id: string;
  name: string;
  slug: string;
  displayName: string;
  imageUrl?: string | null;
}

// State
const categories = ref<Category[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Fetch categories
const fetchCategories = async () => {
  try {
    loading.value = true;
    error.value = null;

    const api = useApi();
    const response = await api.get<{ success: boolean; data: Category[] }>(
      "categories?active=true"
    );

    if (response && response.success) {
      categories.value = response.data || [];
    } else {
      error.value = "Неуспешно зареждане на категориите";
    }
  } catch (err) {
    console.error("Error fetching categories:", err);
    error.value = "Неуспешно зареждане на категориите";
  } finally {
    loading.value = false;
  }
};

// Fetch on mount
onMounted(() => {
  fetchCategories();
});
</script>

<style lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

// Override global background for this page
html,
body {
  background-color: #fff !important;
}

.collections {
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: #fff;

  @include up(md) {
    max-width: 1104px;
    padding: 3rem 20px;
  }

  @include up(lg) {
    max-width: 1472px;
    padding: 4rem 24px;
  }

  @include up(xl) {
    max-width: 1656px;
    padding: 4rem 32px;
  }

  &__title {
    font-family: "Outfit", sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 56px;
    line-height: 60px;
    color: rgb(51, 51, 51);
    margin-bottom: 2rem;
    text-align: center;

    @include up(md) {
      margin-bottom: 3rem;
    }
  }

  &__loading,
  &__error,
  &__empty {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    text-align: center;
    color: $text-secondary;
  }

  &__error {
    color: $error;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    justify-items: center;

    @include up(md) {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      justify-items: stretch;
    }

    @include up(lg) {
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    @include up(xl) {
      gap: 2.5rem;
    }
  }

  &__card {
    position: relative;
    display: block;
    width: 100%;
    max-width: 522px;
    height: 120px;
    border-radius: 0;
    overflow: hidden;
    text-decoration: none;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    box-shadow: 0 4px 12px $shadow-soft;

    @include up(sm) {
      width: 100%;
      max-width: 100%;
    }

    @include up(md) {
      width: 100%;
      max-width: 100%;
    }

    @include up(lg) {
      width: 100%;
      max-width: 100%;
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px $shadow-med;
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: 2px;
    }

    &-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #b9c6aa 0%, #2f3a2a 100%);
      background-size: cover;
      background-position: center;
      transition: transform 0.3s ease;
    }

    &:hover &-bg {
      transform: scale(1.05);
    }

    &-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      transition: background 0.3s ease;
    }

    &:hover &-overlay {
      background: rgba(0, 0, 0, 0.4);
    }

    &-content {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0;
    }

    &-title {
      font-family: "Outfit", sans-serif;
      font-style: normal;
      font-weight: 300;
      font-size: 32px;
      line-height: 34px;
      color: rgb(255, 255, 255);
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
      margin: 0;
      text-align: center;
    }
  }
}
</style>
