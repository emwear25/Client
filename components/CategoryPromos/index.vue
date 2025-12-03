<template>
  <section class="category-promos">
    <div class="category-promos__container">
      <!-- Desktop: Grid Layout -->
      <div class="category-promos__grid">
        <div
          v-for="(category, index) in categories"
          :key="category.id"
          class="category-promos__card"
          :class="`category-promos__card--${index + 1}`"
        >
          <div class="category-promos__card-inner">
            <!-- Background Image -->
            <div class="category-promos__image-wrapper">
              <NuxtImg
                :src="category.image"
                :alt="category.title"
                class="category-promos__image"
                format="webp"
                quality="80"
                width="600"
                height="400"
                loading="lazy"
                placeholder
              />
              <!-- Dark Overlay -->
              <div class="category-promos__overlay"/>
            </div>

            <!-- Content -->
            <div class="category-promos__content" :class="`category-promos__content--${index + 1}`">
              <h3 class="category-promos__title">{{ category.title }}</h3>
              <NuxtLink :to="category.link" class="category-promos__button">
                {{ "Купи сега" }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile: Slider -->
      <div class="category-promos__slider">
        <Swiper
          :modules="modules"
          :slides-per-view="1.2"
          :space-between="16"
          :loop="false"
          :grab-cursor="true"
          :breakpoints="{
            480: {
              slidesPerView: 1.5,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
          }"
          class="category-promos__swiper"
        >
          <SwiperSlide
            v-for="category in categories"
            :key="category.id"
            class="category-promos__slide"
          >
            <div class="category-promos__card-inner">
              <!-- Background Image -->
              <div class="category-promos__image-wrapper">
                <NuxtImg
                :src="category.image"
                :alt="category.title"
                class="category-promos__image"
                format="webp"
                quality="80"
                width="600"
                height="400"
                loading="lazy"
                placeholder
              />
                <!-- Dark Overlay -->
                <div class="category-promos__overlay"/>
              </div>

              <!-- Content -->
              <div
                class="category-promos__content"
                :class="`category-promos__content--${category.id}`"
              >
                <h3 class="category-promos__title">{{ category.title }}</h3>
                <NuxtLink :to="category.link" class="category-promos__button">
                  {{ category.id === 1 || category.id === 2 ? "Купи сега" : "Shop Now" }}
                </NuxtLink>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface CategoryPromo {
  id: number;
  title: string;
  image: string;
  link: string;
}

const modules = [Navigation, Pagination, Autoplay];

const categories: CategoryPromo[] = [
  {
    id: 1,
    title: "Детски ранички",
    image: "/img/banners/banner1.jpg",
    link: "/products?category=backpacks",
  },
  {
    id: 2,
    title: "Халати",
    image: "/img/banners/banner2.jpg",
    link: "/products?category=robes",
  },
  {
    id: 3,
    title: "Кърпи с ушички",
    image: "/img/banners/banner3.jpg",
    link: "/products?category=towels",
  },
  {
    id: 4,
    title: "Персонализирани Гергефи",
    image: "/img/banners/banner4.jpg",
    link: "/products?category=towels-personalized",
  },
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

  // Desktop Grid
  &__grid {
    display: none;

    @media (min-width: 768px) {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 1.5rem;
      height: 600px;
    }

    @media (min-width: 1024px) {
      gap: 2rem;
      height: 650px;
    }
  }

  // Mobile Slider
  &__slider {
    display: block;
    width: 100%;

    @media (min-width: 768px) {
      display: none;
    }
  }

  &__swiper {
    padding: 0.5rem 0 2rem;
    overflow: visible;
  }

  &__slide {
    height: auto;
  }

  // Card Styles
  &__card {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    width: 100%;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);

      .category-promos__overlay {
        background: rgba(0, 0, 0, 0.55);
      }

      .category-promos__button {
        background: #2f3a2a;
        transform: translateY(-2px);
      }
    }

    // Grid positioning: Row 1 - 1/3 and 2/3, Row 2 - 2/3 and 1/3
    &--1 {
      @media (min-width: 768px) {
        grid-column: 1 / 2;
        grid-row: 1;
      }
    }

    &--2 {
      @media (min-width: 768px) {
        grid-column: 2 / 4;
        grid-row: 1;
      }
    }

    &--3 {
      @media (min-width: 768px) {
        grid-column: 1 / 3;
        grid-row: 2;
      }
    }

    &--4 {
      @media (min-width: 768px) {
        grid-column: 3 / 4;
        grid-row: 2;
      }
    }
  }

  &__card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 280px;
    overflow: hidden;

    @media (min-width: 768px) {
      min-height: 100%;
    }
  }

  &__image-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2;
    transition: background 0.3s ease;
  }

  &__content {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1rem;
    width: auto;
  }

  &__title {
    font-family: "Outfit", sans-serif;
    font-size: 30px;
    font-weight: 300;
    color: #fefefe;
    margin: 0;
    padding: 0;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    line-height: 1.2;
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    background: #2e2e2e;
    color: #ffffff;
    font-family:
      system-ui,
      -apple-system,
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Noto Sans",
      "Liberation Sans",
      Arial,
      sans-serif;
    font-size: 13px;
    font-weight: 400;
    text-decoration: none;
    text-align: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    margin: 0;
    width: auto;

    &:hover {
      background: #1a1a1a;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }
}
</style>
