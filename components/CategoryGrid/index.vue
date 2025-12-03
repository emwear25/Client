<template>
  <section class="category-grid">
    <div class="category-grid__container">
      <h2 class="category-grid__heading">Разгледай по категории</h2>
      <div class="category-grid__grid">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/products?category=${category.slug}`"
          class="category-grid__card"
        >
          <div class="category-grid__card-content">
            <img :src="category.img" :alt="category.title" class="category-grid__img" >
            <div class="category-grid__overlay">
              <Icon :name="category.icon" class="category-grid__icon" />
              <h3 class="category-grid__title">{{ category.title }}</h3>
            </div>
          </div>
          <span class="category-grid__cta">Виж всички</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Category {
  id: number;
  slug: string;
  title: string;
  img: string;
  icon: string;
}

const categories: Category[] = [
  {
    id: 1,
    slug: "ranici",
    title: "Раници",
    img: "/images/categories/backpack.jpg",
    icon: "mdi:backpack",
  },
  {
    id: 2,
    slug: "havlii",
    title: "Хавлии",
    img: "/images/categories/towel.jpg",
    icon: "mdi:bathtub-outline",
  },
  {
    id: 3,
    slug: "halati",
    title: "Халати",
    img: "/images/categories/robe.jpg",
    icon: "mdi:robe",
  },
];
</script>

<style scoped lang="scss">
.category-grid {
  width: 100%;
  padding: 4rem 0;
  background-color: #f8f9fa;

  &__container {
    max-width: 1380px;
    margin: 0 auto;
    padding: 0 1rem;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }
  }

  &__heading {
    font-family: "Poppins", sans-serif;
    font-weight: 700;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    text-align: center;
    margin-bottom: 3rem;
    color: #2c3e50;
  }

  &__grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;
    justify-content: center;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 2.5rem;
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;

    &:hover {
      transform: scale(1.03);

      .category-grid__card-content {
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);
      }

      .category-grid__cta {
        text-decoration: underline;
      }
    }
  }

  &__card-content {
    position: relative;
    width: 100%;
    height: 360px;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.3s ease;

    @media (min-width: 1024px) {
      height: 420px;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: 3 / 4;
  }

  &__overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    padding: 2rem 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  &__icon {
    width: 32px;
    height: 32px;
    color: white;

    @media (min-width: 1024px) {
      width: 40px;
      height: 40px;
    }
  }

  &__title {
    font-family: "Poppins", sans-serif;
    font-weight: 600;
    font-size: 1.25rem;
    color: white;
    margin: 0;
    text-align: center;
  }

  &__cta {
    font-family: "Inter", sans-serif;
    font-weight: 500;
    font-size: 15px;
    color: #3498db;
    margin-top: 1rem;
    text-align: center;
    transition: text-decoration 0.3s ease;
  }
}
</style>
