<template>
  <section class="feature-highlights">
    <div class="feature-highlights__container">
      <!-- Desktop: Grid Layout -->
      <div class="feature-highlights__grid">
        <div
          v-for="feature in features"
          :key="feature.id"
          class="feature-highlights__card"
        >
          <div class="feature-highlights__icon-wrapper">
            <div class="feature-highlights__icon-circle">
              <Icon :name="feature.icon" class="feature-highlights__icon" />
            </div>
          </div>
          <h3 class="feature-highlights__title">
            {{ feature.title }}
          </h3>
          <p class="feature-highlights__text">
            {{ feature.text }}
          </p>
        </div>
      </div>

      <!-- Mobile: Slider -->
      <div class="feature-highlights__slider">
        <Swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="24"
          :loop="false"
          :grab-cursor="true"
          :pagination="{
            clickable: true,
            el: '.feature-highlights__pagination',
          }"
          class="feature-highlights__swiper"
        >
          <SwiperSlide
            v-for="feature in features"
            :key="feature.id"
            class="feature-highlights__slide"
          >
            <div class="feature-highlights__card">
              <div class="feature-highlights__icon-wrapper">
                <div class="feature-highlights__icon-circle">
                  <Icon :name="feature.icon" class="feature-highlights__icon" />
                </div>
              </div>
              <h3 class="feature-highlights__title">
                {{ feature.title }}
              </h3>
              <p class="feature-highlights__text">
                {{ feature.text }}
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
        <div class="feature-highlights__pagination"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const modules = [Pagination]

// Static feature data
const features = ref([
  {
    id: 1,
    icon: 'mdi:alphabetical-variant',
    title: 'Персонализирано име',
    text: 'Всяка раница се изработва с името, което Вие изберете.',
  },
  {
    id: 2,
    icon: 'mdi:cog',
    title: 'Прецизна машинна бродерия',
    text: 'Висококачествени машини гарантират трайна и детайлна бродерия.',
  },
  {
    id: 3,
    icon: 'mdi:truck-fast',
    title: 'Експресна 48-часова изработка',
    text: 'Подготвяме и изпращаме Вашата поръчка в рамките на 2 дни.',
  },
  {
    id: 4,
    icon: 'mdi:gift-outline',
    title: 'Идеален за подарък',
    text: 'Получавате продукта в красива опаковка, готова за изненада.',
  },
])
</script>

<style scoped lang="scss">
@use '~/assets/styles/colors' as *;
@use '~/assets/styles/breakpoints' as *;
@use '~/assets/styles/fonts' as *;

.feature-highlights {
  background: #ffffff;
  padding: 1.5rem 0;

  @include up(md) {
    padding: 2rem 0;
  }

  @include up(lg) {
    padding: 2rem 0;
  }

  &__container {
    width: 100%;
    margin-inline: auto;
    padding-inline: 16px;

    @include up(md) {
      max-width: 1104px;
      padding-inline: 20px;
    }
    @include up(lg) {
      max-width: 1472px;
      padding-inline: 24px;
    }
    @include up(xl) {
      max-width: 1656px;
      padding-inline: 32px;
    }
  }

  // Desktop: Grid Layout
  &__grid {
    display: none;

    @include up(md) {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2.5rem;
    }

    @include up(lg) {
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
  }

  // Mobile: Slider
  &__slider {
    display: block;
    width: 100%;

    @include up(md) {
      display: none;
    }
  }

  &__swiper {
    padding: 0.5rem 0 3rem;
    overflow: visible;
  }

  &__slide {
    height: auto;
  }

  &__pagination {
    position: relative;
    bottom: 0;
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
    gap: 0.5rem;

    :deep(.swiper-pagination-bullet) {
      width: 8px;
      height: 8px;
      background: rgba(185, 198, 170, 0.4);
      opacity: 1;
      transition: all 0.3s ease;

      &.swiper-pagination-bullet-active {
        background: rgba(185, 198, 170, 0.8);
        width: 24px;
        border-radius: 4px;
      }
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
    transition: none;
  }

  &__icon-wrapper {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;

    @include up(md) {
      margin-bottom: 1.25rem;
    }
  }

  &__icon-circle {
    position: relative;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed rgba(185, 198, 170, 0.6);
    border-radius: 50%;
    background: transparent;

    @include up(md) {
      width: 70px;
      height: 70px;
    }

    @include up(lg) {
      width: 80px;
      height: 80px;
    }
  }

  &__icon {
    font-size: 1.5rem;
    color: rgba(185, 198, 170, 0.8);
    width: 1em;
    height: 1em;

    @include up(md) {
      font-size: 1.75rem;
    }

    @include up(lg) {
      font-size: 2rem;
    }
  }

  &__title {
    font-family:
      system-ui,
      -apple-system,
      'Segoe UI',
      Roboto,
      'Helvetica Neue',
      'Noto Sans',
      'Liberation Sans',
      Arial,
      sans-serif,
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      'Noto Color Emoji';
    font-size: 13px;
    font-weight: 700;
    color: rgba(47, 58, 42, 0.9);
    margin: 0 0 0.75rem;
    line-height: 16px;

    @include up(md) {
      margin-bottom: 1rem;
    }
  }

  &__text {
    font-family:
      system-ui,
      -apple-system,
      'Segoe UI',
      Roboto,
      'Helvetica Neue',
      'Noto Sans',
      'Liberation Sans',
      Arial,
      sans-serif,
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      'Noto Color Emoji';
    font-size: 13px;
    font-weight: 400;
    color: rgba(47, 58, 42, 0.7);
    line-height: 23px;
    margin: 0;
    max-width: 280px;

    @include up(md) {
      max-width: 300px;
    }

    @include up(lg) {
      max-width: none;
    }
  }
}
</style>
