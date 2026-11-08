<template>
  <section class="category-promos">
    <div class="category-promos__container">
      <div class="category-promos__header">
        <span class="category-promos__eyebrow">Нашите колекции</span>
        <h2 class="category-promos__heading">Разгледай по категория</h2>
        <p class="category-promos__sub">Персонализирани с име и любим герой</p>
      </div>

      <div class="category-promos__grid">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="category.link"
          class="category-promos__card"
        >
          <div class="category-promos__image-wrapper">
            <img
              :src="category.image"
              :alt="category.title"
              class="category-promos__image"
              width="800"
              height="600"
              loading="lazy"
            />
            <div class="category-promos__overlay" />
          </div>
          <div class="category-promos__content">
            <h3 class="category-promos__title">{{ category.title }}</h3>
            <span class="category-promos__button">Купи сега</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface CategoryPromo {
  id: number;
  title: string;
  image: string;
  link: string;
}

const categories: CategoryPromo[] = [
  { id: 1, title: "Детски раници", image: "/img/banners/banner1.jpg", link: "/category/kids-bags" },
  { id: 2, title: "Детски халати", image: "/img/banners/banner2.jpg", link: "/category/kid-bathrobes" },
  { id: 3, title: "Кърпи с ушички", image: "/img/banners/banner3.jpg", link: "/category/kids-towels" },
  { id: 4, title: "Кърпи за лице", image: "/img/home/face-towels.webp", link: "/category/personalizirani-kurpi-za-lice" },
  { id: 5, title: "Ключодържатели", image: "/img/home/keychains-card.webp", link: "/category/keychains" },
  { id: 6, title: "Плюшени играчки", image: "/img/home/plush-toys.webp", link: "/category/personalizirani-plusheni-igrachki" },
  { id: 7, title: "Персонализирани гергефи", image: "/img/banners/banner4.jpg", link: "/category/personalizirani-gergefi" },
  { id: 8, title: "Муселинови одеяла", image: "/img/home/blankets-card.webp", link: "/category/kids-blankets" },
];
</script>

<style lang="scss" scoped>
.category-promos {
  width: 100%;
  padding: 3rem 0 1.5rem;
  background-color: #ffffff;

  @media (min-width: 768px) {
    padding: 4rem 0 2rem;
  }

  &__container {
    max-width: 1610px;
    margin: 0 auto;
    padding: 0 1rem;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }
  }

  &__header {
    text-align: center;
    margin-bottom: 2.75rem;

    @media (min-width: 768px) {
      margin-bottom: 3.5rem;
    }
  }

  &__eyebrow {
    display: block;
    font-family: "Inter", sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #9eb291;
    margin-bottom: 0.9rem;
  }

  &__heading {
    font-family: "Outfit", sans-serif;
    font-size: clamp(28px, 4.4vw, 44px);
    font-weight: 300;
    letter-spacing: -0.01em;
    line-height: 1.15;
    color: #2f3a2a;
    margin: 0 0 0.6rem;
  }

  &__sub {
    font-family: "Roboto", sans-serif;
    font-size: 15px;
    font-weight: 300;
    letter-spacing: 0.01em;
    color: #7a7a7a;
    margin: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;

    @media (min-width: 560px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 992px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.75rem;
    }
  }

  &__card {
    position: relative;
    display: block;
    overflow: hidden;
    border-radius: 14px;
    aspect-ratio: 4 / 3;
    text-decoration: none;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 14px 34px rgba(0, 0, 0, 0.14);

      .category-promos__overlay {
        background: rgba(0, 0, 0, 0.42);
      }
      .category-promos__image {
        transform: scale(1.05);
      }
      .category-promos__button {
        background: #2f3a2a;
        color: #fff;
      }
    }
  }

  &__image-wrapper {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.12) 55%, rgba(0, 0, 0, 0.05) 100%);
    transition: background 0.3s ease;
  }

  &__content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1.25rem;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 0 1rem;
  }

  &__title {
    font-family: "Outfit", sans-serif;
    font-size: clamp(20px, 2.4vw, 26px);
    font-weight: 400;
    color: #fff;
    margin: 0;
    text-align: center;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.7rem 1.7rem;
    background: rgba(255, 255, 255, 0.95);
    color: #2f3a2a;
    font-family: "Inter", sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-radius: 999px;
    transition: all 0.3s ease;
  }
}
</style>
