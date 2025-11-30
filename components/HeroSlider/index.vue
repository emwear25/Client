<template>
  <div class="hero-slider">
    <Swiper
      :modules="modules"
      :slides-per-view="1"
      :space-between="0"
      :loop="true"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
      :pagination="{
        clickable: true,
        dynamicBullets: true,
      }"
      :navigation="{
        nextEl: '.hero-slider__button-next',
        prevEl: '.hero-slider__button-prev',
      }"
      class="hero-slider__swiper"
    >
      <SwiperSlide
        v-for="slide in slides"
        :key="slide.id"
        class="hero-slider__slide"
        :style="{ backgroundImage: `url(${slide.image})` }"
      >
        <div class="hero-slider__overlay"></div>
        <div class="hero-slider__content">
          <h1 class="hero-slider__title">{{ slide.title }}</h1>
          <p v-if="slide.subtitle" class="hero-slider__subtitle">
            {{ slide.subtitle }}
          </p>
          <NuxtLink :to="slide.buttonLink" class="hero-slider__button">
            {{ slide.buttonText }}
          </NuxtLink>
        </div>
      </SwiperSlide>

      <!-- Navigation arrows (desktop only) -->
      <div class="hero-slider__button-prev">
        <Icon name="mdi:chevron-left" />
      </div>
      <div class="hero-slider__button-next">
        <Icon name="mdi:chevron-right" />
      </div>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Swiper modules
const modules = [Navigation, Pagination, Autoplay]

// Slide data
const slides = ref([
  {
    id: 1,
    image: '/img/slider/bags.png',
    title: 'Персонализирани раници',
    subtitle: 'Стилни и функционални раници за всеки ден',
    buttonText: 'Разгледай колекцията',
    buttonLink: '/products',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Създайте персонализирани раници',
    subtitle: 'Уникални бродерии за всеки стил и случай',
    buttonText: 'Разгледай',
    buttonLink: '/products',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Ръчно бродирани аксесоари',
    subtitle: 'Изработени с любов и внимание към детайла',
    buttonText: 'Поръчай сега',
    buttonLink: '/products',
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Специални намаления',
    subtitle: 'До 30% отстъпка на избрани продукти',
    buttonText: 'Вижте намаленията',
    buttonLink: '/sales',
  },
])
</script>

<style scoped lang="scss">
@use '~/assets/styles/colors' as *;
@use '~/assets/styles/breakpoints' as *;
@use '~/assets/styles/fonts' as *;

.hero-slider {
  width: 100vw;
  position: relative;
  margin-left: calc(50% - 50vw);

  &__swiper {
    width: 100%;
    height: 60vh;
    min-height: 400px;

    @include up(md) {
      height: 70vh;
      min-height: 500px;
    }

    @include up(lg) {
      height: 80vh;
      min-height: 600px;
    }
  }

  &__slide {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover !important;
    background-position: center center !important;
    background-repeat: no-repeat !important;
    background-attachment: scroll;
    overflow: hidden;
    width: 100% !important;
    height: 100% !important;
    min-height: inherit;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(47, 58, 42, 0.5), rgba(47, 58, 42, 0.7));
    z-index: 1;
  }

  &__content {
    position: relative;
    z-index: 2;
    text-align: center;
    color: $color-white;
    max-width: 800px;
    padding: 2rem 1rem;

    @include up(md) {
      padding: 3rem 2rem;
    }
  }

  &__title {
    font-family: $font-heading;
    font-size: clamp(2rem, 6vw, 3.5rem);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
    letter-spacing: 0.02em;

    @include up(md) {
      margin-bottom: 1.5rem;
    }
  }

  &__subtitle {
    font-family: $font-body;
    font-size: 1.1rem;
    font-weight: 400;
    line-height: 1.6;
    margin-bottom: 2rem;
    opacity: 0.95;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);

    @include up(md) {
      font-size: 1.25rem;
      margin-bottom: 2.5rem;
    }
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: $font-body;
    font-size: 1rem;
    font-weight: 500;
    padding: 14px 32px;
    background: $brand;
    color: $brand-ink;
    text-decoration: none;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.2s ease;
    letter-spacing: 0.02em;
    box-shadow: 0 4px 16px rgba(185, 198, 170, 0.3);

    &:hover {
      background: $brand-hover;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(185, 198, 170, 0.4);
    }

    @include up(md) {
      font-size: 1.1rem;
      padding: 16px 40px;
    }

    &:focus-visible {
      outline: 2px solid $color-white;
      outline-offset: 4px;
    }
  }

  // Navigation arrows
  &__button-prev,
  &__button-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 50px;
    height: 50px;
    background: rgba(185, 198, 170, 0.3);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: none;
    align-items: center;
    justify-content: center;
    color: $color-white;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease;

    @include up(lg) {
      display: flex;
    }

    &:hover {
      background: rgba(185, 198, 170, 0.5);
      transform: translateY(-50%) scale(1.1);
    }

    &:focus-visible {
      outline: 2px solid $color-white;
      outline-offset: 2px;
    }
  }

  &__button-prev {
    left: 2rem;
  }

  &__button-next {
    right: 2rem;
  }
}

// Swiper pagination customization
:deep(.swiper-pagination) {
  bottom: 2rem !important;

  .swiper-pagination-bullet {
    width: 12px;
    height: 12px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 1;
    transition: all 0.2s ease;

    &-active {
      background: $brand;
      transform: scale(1.2);
    }
  }
}

// Hide navigation buttons when they would be disabled
:deep(.swiper-button-disabled) {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
