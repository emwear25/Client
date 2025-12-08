<template>
  <section class="testimonials">
    <div class="testimonials__container">
      <div class="testimonials__header">
        <span class="testimonials__eyebrow">Отзиви</span>
        <h2 class="testimonials__heading">Какво казват нашите клиенти</h2>
        <p class="testimonials__intro">
          Доверието и удовлетворението на нашите клиенти е най-важното за нас
        </p>
      </div>

      <!-- Sliding Carousel -->
      <div class="testimonials__carousel-wrapper">
        <Swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="24"
          :loop="true"
          :autoplay="{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }"
          :breakpoints="{
            640: {
              slidesPerView: 1.5,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 2.5,
              spaceBetween: 32,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
          }"
          :grab-cursor="true"
          class="testimonials__swiper"
        >
          <SwiperSlide
            v-for="testimonial in testimonials"
            :key="testimonial.id"
            class="testimonials__slide"
          >
            <article class="testimonial-card">
              <!-- Header (like social media post) -->
              <div class="testimonial-card__header">
                <div class="testimonial-card__avatar">
                  <span class="testimonial-card__avatar-initial">{{ testimonial.initial }}</span>
                </div>
                <div class="testimonial-card__info">
                  <h3 class="testimonial-card__name">{{ testimonial.name }}</h3>
                  <span class="testimonial-card__date">{{ testimonial.date }}</span>
                </div>
                <div class="testimonial-card__rating">
                  <Icon
                    v-for="star in 5"
                    :key="star"
                    name="mdi:star"
                    class="testimonial-card__star"
                  />
                </div>
              </div>

              <!-- Content -->
              <div class="testimonial-card__content">
                <p class="testimonial-card__text">{{ testimonial.text }}</p>
              </div>

              <!-- Source badge -->
              <div class="testimonial-card__source">
                <Icon :name="testimonial.sourceIcon" class="testimonial-card__source-icon" />
                <span class="testimonial-card__source-text">{{ testimonial.source }}</span>
              </div>
            </article>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const modules = [Autoplay];

interface Testimonial {
  id: number;
  name: string;
  initial: string;
  date: string;
  text: string;
  source: string;
  sourceIcon: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Кристина Стефанова",
    initial: "КС",
    date: "24 септември 2025",
    text: "Раничките са прекрасни! Много ви благодаря!",
    source: "Instagram",
    sourceIcon: "mdi:instagram",
  },
  {
    id: 2,
    name: "Виктория Иванова",
    initial: "ВИ",
    date: "12 септември 2025",
    text: "Вчера успях да видя раничката и супер много ми хареса, отново ви благодаря, че я направихте каквато исках да е!",
    source: "Messenger",
    sourceIcon: "mdi:facebook-messenger",
  },
  {
    id: 3,
    name: "Боряна Манушева",
    initial: "БМ",
    date: "21 август 2025",
    text: "Благодаря за прекрасните ранички, децата са много доволни и щастливи!",
    source: "Instagram",
    sourceIcon: "mdi:instagram",
  },
  {
    id: 4,
    name: "Сашка Илиева",
    initial: "СИ",
    date: "20 август 2025",
    text: "Взех раничката, много е хубава, а пратката беше много красиво опакована! Благодаря!",
    source: "Messenger",
    sourceIcon: "mdi:facebook-messenger",
  },
  {
    id: 5,
    name: "Надя Попова",
    initial: "НП",
    date: "5 юли 2025",
    text: "Днес взех раничката. Прекрасна е! Благодаря!",
    source: "Instagram",
    sourceIcon: "mdi:instagram",
  },
  {
    id: 6,
    name: "Теодора В. Митева",
    initial: "ТМ",
    date: "13 юни 2025",
    text: "Получих раничката, Уникална е, а вие сте просто страхотни в изработката и бързината",
    source: "Messenger",
    sourceIcon: "mdi:facebook-messenger",
  },
  {
    id: 7,
    name: "Лорита Фидосиева",
    initial: "ЛФ",
    date: "24 май 2025",
    text: "Раничката ни е супер, излизаме и събираме погледите! Благодаря ви от Сърце",
    source: "Instagram",
    sourceIcon: "mdi:instagram",
  },
  {
    id: 8,
    name: "Лидия Кондова",
    initial: "ЛК",
    date: "16 август 2025",
    text: "С голяма радост пиша, тези редове. Прекрасно е, когато си поръчаш нещо, а то е още по-красиви и качествено от това, което си очаквал. Първо да Благодаря за личното отношение. Второ за времето, което отделихте да ми изработите шрифт, който исках. Трето, но не на последно място за бързата реакция. Благодаря за прекрасната емоция Габи, Албена и Теди са безкрайно щастливи!",
    source: "Messenger",
    sourceIcon: "mdi:facebook-messenger",
  },
];
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

.testimonials {
  padding: 4rem 0;
  background: transparent;
  position: relative;
  overflow: hidden;

  @include up(md) {
    padding: 5rem 0;
  }

  @include up(lg) {
    padding: 6rem 0;
  }

  &__container {
    width: 100%;
    max-width: 1610px;
    margin: 0 auto;
    padding: 0 1rem;
    position: relative;
    z-index: 1;

    @include up(md) {
      padding: 0 2rem;
    }
  }

  &__header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 3rem;

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
    margin-bottom: 1rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  &__heading {
    font-family: $font-heading;
    font-weight: 700;
    font-size: clamp(2rem, 5vw, 2.75rem);
    color: $brand-ink;
    margin: 0 0 1rem 0;
    line-height: 1.2;
    letter-spacing: 0.02em;
  }

  &__intro {
    font-family: $font-body;
    font-size: 1.0625rem;
    color: $text-secondary;
    line-height: 1.7;
    margin: 0;
  }

  &__carousel-wrapper {
    position: relative;
    padding: 1rem 0;
  }

  &__swiper {
    overflow: visible;
  }

  &__slide {
    height: auto;
  }
}

.testimonial-card {
  background: $bg-card;
  border: 1px solid $border-base;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 200px;
  transition: all 0.3s ease;
  padding: 1.25rem;

  @include up(md) {
    padding: 1.5rem;
    min-height: 220px;
  }

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
    border-color: $brand;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid $border-base;
  }

  &__avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, $brand 0%, $brand-accent-1 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba($brand, 0.2);
  }

  &__avatar-initial {
    font-family: $font-heading;
    font-size: 0.9375rem;
    font-weight: 600;
    color: $color-white;
    letter-spacing: 0.02em;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-family: $font-heading;
    font-size: 0.9375rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 0.25rem 0;
    line-height: 1.3;
  }

  &__date {
    font-family: $font-body;
    font-size: 0.8125rem;
    color: $text-secondary;
    display: block;
  }

  &__rating {
    display: flex;
    gap: 2px;
    flex-shrink: 0;
    margin-top: 0.25rem;
  }

  &__star {
    width: 14px;
    height: 14px;
    color: $brand-accent-3;
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
    margin-bottom: 1rem;
  }

  &__text {
    font-family: $font-body;
    font-size: 0.875rem;
    color: $text-primary;
    line-height: 1.6;
    margin: 0;
  }

  &__source {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid $border-base;
    margin-top: auto;
  }

  &__source-icon {
    width: 18px;
    height: 18px;
    color: $text-secondary;
    flex-shrink: 0;
  }

  &__source-text {
    font-family: $font-body;
    font-size: 0.75rem;
    color: $text-secondary;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}
</style>
