<template>
  <div class="hero-slider">
    <Swiper
      :modules="modules"
      :slides-per-view="1"
      :space-between="0"
      :loop="true"
      :autoplay="{
        delay: 6000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }"
      :pagination="{
        clickable: true,
        renderBullet: renderCustomBullet,
      }"
      :navigation="{
        nextEl: '.hero-slider__nav--next',
        prevEl: '.hero-slider__nav--prev',
      }"
      :speed="1200"
      :effect="'creative'"
      :creative-effect="{
        prev: {
          translate: ['-120%', 0, -500],
        },
        next: {
          translate: ['120%', 0, -500],
        },
      }"
      class="hero-slider__swiper"
      @slide-change="onSlideChange"
      @init="onSwiperInit"
    >
      <!-- Slide 1: Diagonal Split Left -->
      <SwiperSlide class="hero-slider__slide hero-slider__slide--diagonal-left">
        <!-- Mobile: Full width image background -->
        <div
          class="hero-slider__mobile-bg"
          :style="{ backgroundImage: `url(${slides[0].image})` }"
        />

        <!-- Desktop: Diagonal split image -->
        <div class="hero-slider__image-container hero-slider__image-container--diagonal-left">
          <div
            class="hero-slider__image"
            :style="{ backgroundImage: `url(${slides[0].image})` }"
          />
        </div>

        <div class="hero-slider__content-zone hero-slider__content-zone--right">
          <!-- Animated embroidery thread -->
          <svg
            class="hero-slider__thread-path hero-slider__thread-path--1"
            viewBox="0 0 400 600"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="thread-1"
              d="M 50,50 Q 200,150 100,300 T 250,500"
              stroke="url(#thread-gradient-1)"
              fill="none"
              stroke-width="3"
              stroke-dasharray="1000"
              stroke-dashoffset="1000"
            />
            <defs>
              <linearGradient id="thread-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color: #b9c6aa; stop-opacity: 0.6" />
                <stop offset="100%" style="stop-color: #e8b8b1; stop-opacity: 0.8" />
              </linearGradient>
            </defs>
          </svg>

          <div class="hero-slider__content hero-slider__content--style-1">
            <div class="hero-slider__label">Нова колекция</div>
            <h1 class="hero-slider__title hero-slider__title--large">
              <span class="hero-slider__title-word">Персонализирани</span>
              <span class="hero-slider__title-word hero-slider__title-word--accent">раници</span>
            </h1>
            <p class="hero-slider__subtitle">Стилни и функционални раници<br >за всеки ден</p>

            <!-- Decorative stitches -->
            <svg
              class="hero-slider__stitch-decoration"
              viewBox="0 0 200 4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0"
                y1="2"
                x2="200"
                y2="2"
                stroke="#B9C6AA"
                stroke-width="2"
                stroke-dasharray="8,4"
                class="hero-slider__stitch-line"
              />
            </svg>

            <NuxtLink to="/products" class="hero-slider__cta hero-slider__cta--primary">
              <span class="hero-slider__cta-text">Разгледай колекцията</span>
              <svg
                class="hero-slider__cta-arrow"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </NuxtLink>
          </div>

          <!-- Morphing blob decoration -->
          <svg
            class="hero-slider__blob hero-slider__blob--1"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="url(#blob-gradient-1)" opacity="0.15">
              <animate
                attributeName="d"
                dur="8s"
                repeatCount="indefinite"
                values="M45,-65C58,-55,68,-43,72,-29C76,-15,73,2,67,17C61,32,52,45,40,54C28,63,13,68,-3,73C-19,78,-38,83,-51,77C-64,71,-71,54,-73,37C-75,20,-72,3,-68,-13C-64,-29,-59,-44,-49,-55C-39,-66,-19,-73,-2,-70C15,-67,31,-54,45,-65Z;
                         M39,-58C50,-48,58,-36,62,-23C66,-10,66,4,62,17C58,30,50,42,39,50C28,58,14,62,-1,64C-16,66,-32,66,-44,58C-56,50,-64,34,-67,17C-70,0,-68,-18,-61,-33C-54,-48,-42,-60,-28,-66C-14,-72,2,-72,18,-68C34,-64,51,-56,39,-58Z;
                         M45,-65C58,-55,68,-43,72,-29C76,-15,73,2,67,17C61,32,52,45,40,54C28,63,13,68,-3,73C-19,78,-38,83,-51,77C-64,71,-71,54,-73,37C-75,20,-72,3,-68,-13C-64,-29,-59,-44,-49,-55C-39,-66,-19,-73,-2,-70C15,-67,31,-54,45,-65Z"
              />
            </path>
            <defs>
              <radialGradient id="blob-gradient-1">
                <stop offset="0%" style="stop-color: #b9c6aa" />
                <stop offset="100%" style="stop-color: #e8b8b1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </SwiperSlide>

      <!-- Slide 2: Diagonal Split Right -->
      <SwiperSlide class="hero-slider__slide hero-slider__slide--diagonal-right">
        <!-- Mobile: Full width image background -->
        <div
          class="hero-slider__mobile-bg"
          :style="{ backgroundImage: `url(${slides[1].image})` }"
        />

        <div class="hero-slider__content-zone hero-slider__content-zone--left">
          <!-- Animated embroidery thread -->
          <svg
            class="hero-slider__thread-path hero-slider__thread-path--2"
            viewBox="0 0 400 600"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="thread-2"
              d="M 350,50 Q 200,150 300,300 T 150,500"
              stroke="url(#thread-gradient-2)"
              fill="none"
              stroke-width="3"
              stroke-dasharray="1000"
              stroke-dashoffset="1000"
            />
            <defs>
              <linearGradient id="thread-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color: #afc9e6; stop-opacity: 0.6" />
                <stop offset="100%" style="stop-color: #b9c6aa; stop-opacity: 0.8" />
              </linearGradient>
            </defs>
          </svg>

          <div
            class="hero-slider__content hero-slider__content--style-1 hero-slider__content--align-right"
          >
            <div class="hero-slider__label">Персонализация</div>
            <h1 class="hero-slider__title hero-slider__title--large">
              <span class="hero-slider__title-word">Създайте</span>
              <span class="hero-slider__title-word hero-slider__title-word--accent"
                >уникален дизайн</span
              >
            </h1>
            <p class="hero-slider__subtitle">Уникални бродерии за всеки<br >стил и случай</p>

            <!-- Decorative stitches -->
            <svg
              class="hero-slider__stitch-decoration"
              viewBox="0 0 200 4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0"
                y1="2"
                x2="200"
                y2="2"
                stroke="#AFC9E6"
                stroke-width="2"
                stroke-dasharray="8,4"
                class="hero-slider__stitch-line"
              />
            </svg>

            <NuxtLink to="/products" class="hero-slider__cta hero-slider__cta--primary">
              <span class="hero-slider__cta-text">Разгледай</span>
              <svg
                class="hero-slider__cta-arrow"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </NuxtLink>
          </div>

          <!-- Morphing blob decoration -->
          <svg
            class="hero-slider__blob hero-slider__blob--2"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="url(#blob-gradient-2)" opacity="0.15">
              <animate
                attributeName="d"
                dur="8s"
                repeatCount="indefinite"
                values="M39,-58C50,-48,58,-36,62,-23C66,-10,66,4,62,17C58,30,50,42,39,50C28,58,14,62,-1,64C-16,66,-32,66,-44,58C-56,50,-64,34,-67,17C-70,0,-68,-18,-61,-33C-54,-48,-42,-60,-28,-66C-14,-72,2,-72,18,-68C34,-64,51,-56,39,-58Z;
                         M45,-65C58,-55,68,-43,72,-29C76,-15,73,2,67,17C61,32,52,45,40,54C28,63,13,68,-3,73C-19,78,-38,83,-51,77C-64,71,-71,54,-73,37C-75,20,-72,3,-68,-13C-64,-29,-59,-44,-49,-55C-39,-66,-19,-73,-2,-70C15,-67,31,-54,45,-65Z;
                         M39,-58C50,-48,58,-36,62,-23C66,-10,66,4,62,17C58,30,50,42,39,50C28,58,14,62,-1,64C-16,66,-32,66,-44,58C-56,50,-64,34,-67,17C-70,0,-68,-18,-61,-33C-54,-48,-42,-60,-28,-66C-14,-72,2,-72,18,-68C34,-64,51,-56,39,-58Z"
              />
            </path>
            <defs>
              <radialGradient id="blob-gradient-2">
                <stop offset="0%" style="stop-color: #afc9e6" />
                <stop offset="100%" style="stop-color: #b9c6aa" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        <!-- Desktop: Diagonal split image -->
        <div class="hero-slider__image-container hero-slider__image-container--diagonal-right">
          <div
            class="hero-slider__image"
            :style="{ backgroundImage: `url('${slides[1].image}')` }"
            :data-slide="2"
          />
        </div>
      </SwiperSlide>

      <!-- Slide 3: Diagonal Split Left -->
      <SwiperSlide class="hero-slider__slide hero-slider__slide--diagonal-left">
        <!-- Mobile: Full width image background -->
        <div
          class="hero-slider__mobile-bg"
          :style="{ backgroundImage: `url(${slides[2].image})` }"
        />

        <!-- Desktop: Diagonal split image -->
        <div class="hero-slider__image-container hero-slider__image-container--diagonal-left">
          <div
            class="hero-slider__image"
            :style="{ backgroundImage: `url('${slides[2].image}')` }"
          />
        </div>

        <div class="hero-slider__content-zone hero-slider__content-zone--right">
          <!-- Animated embroidery thread -->
          <svg
            class="hero-slider__thread-path hero-slider__thread-path--3"
            viewBox="0 0 400 600"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="thread-3"
              d="M 50,100 Q 200,200 100,350 T 250,550"
              stroke="url(#thread-gradient-3)"
              fill="none"
              stroke-width="3"
              stroke-dasharray="1000"
              stroke-dashoffset="1000"
            />
            <defs>
              <linearGradient id="thread-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color: #f2c66d; stop-opacity: 0.6" />
                <stop offset="100%" style="stop-color: #b9c6aa; stop-opacity: 0.8" />
              </linearGradient>
            </defs>
          </svg>

          <div class="hero-slider__content hero-slider__content--style-1">
            <div class="hero-slider__label">Прецизна машинна бродерия</div>
            <h1 class="hero-slider__title hero-slider__title--large">
              <span class="hero-slider__title-word">Бродирани халати</span>
              <span class="hero-slider__title-word hero-slider__title-word--accent"
                >с герои и имена</span
              >
            </h1>
            <p class="hero-slider__subtitle">Персонализирани халати с<br >любими герои и имена</p>

            <!-- Decorative stitches -->
            <svg
              class="hero-slider__stitch-decoration"
              viewBox="0 0 200 4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0"
                y1="2"
                x2="200"
                y2="2"
                stroke="#F2C66D"
                stroke-width="2"
                stroke-dasharray="8,4"
                class="hero-slider__stitch-line"
              />
            </svg>

            <NuxtLink to="/products" class="hero-slider__cta hero-slider__cta--primary">
              <span class="hero-slider__cta-text">Поръчай сега</span>
              <svg
                class="hero-slider__cta-arrow"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </NuxtLink>
          </div>

          <!-- Morphing blob decoration -->
          <svg
            class="hero-slider__blob hero-slider__blob--3"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="url(#blob-gradient-3)" opacity="0.15">
              <animate
                attributeName="d"
                dur="8s"
                repeatCount="indefinite"
                values="M45,-65C58,-55,68,-43,72,-29C76,-15,73,2,67,17C61,32,52,45,40,54C28,63,13,68,-3,73C-19,78,-38,83,-51,77C-64,71,-71,54,-73,37C-75,20,-72,3,-68,-13C-64,-29,-59,-44,-49,-55C-39,-66,-19,-73,-2,-70C15,-67,31,-54,45,-65Z;
                         M39,-58C50,-48,58,-36,62,-23C66,-10,66,4,62,17C58,30,50,42,39,50C28,58,14,62,-1,64C-16,66,-32,66,-44,58C-56,50,-64,34,-67,17C-70,0,-68,-18,-61,-33C-54,-48,-42,-60,-28,-66C-14,-72,2,-72,18,-68C34,-64,51,-56,39,-58Z;
                         M45,-65C58,-55,68,-43,72,-29C76,-15,73,2,67,17C61,32,52,45,40,54C28,63,13,68,-3,73C-19,78,-38,83,-51,77C-64,71,-71,54,-73,37C-75,20,-72,3,-68,-13C-64,-29,-59,-44,-49,-55C-39,-66,-19,-73,-2,-70C15,-67,31,-54,45,-65Z"
              />
            </path>
            <defs>
              <radialGradient id="blob-gradient-3">
                <stop offset="0%" style="stop-color: #f2c66d" />
                <stop offset="100%" style="stop-color: #b9c6aa" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </SwiperSlide>

      <!-- Slide 4: Diagonal Split Right -->
      <SwiperSlide class="hero-slider__slide hero-slider__slide--diagonal-right">
        <!-- Mobile: Full width image background -->
        <div
          class="hero-slider__mobile-bg"
          :style="{ backgroundImage: `url(${slides[3].image})` }"
        />

        <div class="hero-slider__content-zone hero-slider__content-zone--left">
          <!-- Animated embroidery thread -->
          <svg
            class="hero-slider__thread-path hero-slider__thread-path--4"
            viewBox="0 0 400 600"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="thread-4"
              d="M 350,100 Q 200,200 300,350 T 150,550"
              stroke="url(#thread-gradient-4)"
              fill="none"
              stroke-width="3"
              stroke-dasharray="1000"
              stroke-dashoffset="1000"
            />
            <defs>
              <linearGradient id="thread-gradient-4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color: #e8b8b1; stop-opacity: 0.6" />
                <stop offset="100%" style="stop-color: #f2c66d; stop-opacity: 0.8" />
              </linearGradient>
            </defs>
          </svg>

          <div
            class="hero-slider__content hero-slider__content--style-1 hero-slider__content--align-right"
          >
            <div class="hero-slider__label">Прецизна машинна бродерия</div>
            <h1 class="hero-slider__title hero-slider__title--large">
              <span class="hero-slider__title-word">Персонализирани кърпи</span>
              <span class="hero-slider__title-word hero-slider__title-word--accent">с ушички</span>
            </h1>
            <p class="hero-slider__subtitle">С любими герои и<br >имена</p>

            <!-- Decorative stitches -->
            <svg
              class="hero-slider__stitch-decoration"
              viewBox="0 0 200 4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0"
                y1="2"
                x2="200"
                y2="2"
                stroke="#E8B8B1"
                stroke-width="2"
                stroke-dasharray="8,4"
                class="hero-slider__stitch-line"
              />
            </svg>

            <NuxtLink to="/products" class="hero-slider__cta hero-slider__cta--primary">
              <span class="hero-slider__cta-text">Поръчай сега</span>
              <svg
                class="hero-slider__cta-arrow"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </NuxtLink>
          </div>

          <!-- Morphing blob decoration -->
          <svg
            class="hero-slider__blob hero-slider__blob--4"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="url(#blob-gradient-4)" opacity="0.15">
              <animate
                attributeName="d"
                dur="8s"
                repeatCount="indefinite"
                values="M39,-58C50,-48,58,-36,62,-23C66,-10,66,4,62,17C58,30,50,42,39,50C28,58,14,62,-1,64C-16,66,-32,66,-44,58C-56,50,-64,34,-67,17C-70,0,-68,-18,-61,-33C-54,-48,-42,-60,-28,-66C-14,-72,2,-72,18,-68C34,-64,51,-56,39,-58Z;
                         M45,-65C58,-55,68,-43,72,-29C76,-15,73,2,67,17C61,32,52,45,40,54C28,63,13,68,-3,73C-19,78,-38,83,-51,77C-64,71,-71,54,-73,37C-75,20,-72,3,-68,-13C-64,-29,-59,-44,-49,-55C-39,-66,-19,-73,-2,-70C15,-67,31,-54,45,-65Z;
                         M39,-58C50,-48,58,-36,62,-23C66,-10,66,4,62,17C58,30,50,42,39,50C28,58,14,62,-1,64C-16,66,-32,66,-44,58C-56,50,-64,34,-67,17C-70,0,-68,-18,-61,-33C-54,-48,-42,-60,-28,-66C-14,-72,2,-72,18,-68C34,-64,51,-56,39,-58Z"
              />
            </path>
            <defs>
              <radialGradient id="blob-gradient-4">
                <stop offset="0%" style="stop-color: #e8b8b1" />
                <stop offset="100%" style="stop-color: #f2c66d" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        <!-- Desktop: Diagonal split image -->
        <div class="hero-slider__image-container hero-slider__image-container--diagonal-right">
          <div
            class="hero-slider__image"
            :style="{ backgroundImage: `url('${slides[3].image}')` }"
            :data-slide="4"
          />
        </div>
      </SwiperSlide>

      <!-- Custom Navigation -->
      <button class="hero-slider__nav hero-slider__nav--prev" aria-label="Previous slide">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button class="hero-slider__nav hero-slider__nav--next" aria-label="Next slide">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 18l6-6-6-6"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </Swiper>

    <!-- Progress indicator -->
    <div class="hero-slider__progress">
      <div class="hero-slider__progress-bar" :style="{ width: progressWidth }"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

const modules = [Navigation, Pagination, Autoplay, EffectCreative];

const currentSlide = ref(0);
const progressWidth = ref("0%");
const contentCard = ref<HTMLElement | null>(null);

const slides = ref([
  {
    id: 1,
    image: "/img/slider/bags.png",
  },
  {
    id: 2,
    image: "/img/slider/slide-2.png",
  },
  {
    id: 3,
    image: "/img/slider/bathrobes.jpg",
  },
  {
    id: 4,
    image: "/img/slider/towels.jpg",
  },
]);

const onSlideChange = (swiper: any) => {
  currentSlide.value = swiper.realIndex;
  animateThreadPaths();
};

const onSwiperInit = () => {
  animateThreadPaths();
  startProgressAnimation();
};

const animateThreadPaths = () => {
  // Trigger thread path animations on slide change
  const threads = document.querySelectorAll(".hero-slider__thread-path path");
  threads.forEach((thread) => {
    const pathElement = thread as SVGPathElement;
    pathElement.style.strokeDashoffset = "1000";
    setTimeout(() => {
      pathElement.style.strokeDashoffset = "0";
    }, 300);
  });
};

const startProgressAnimation = () => {
  let progress = 0;
  const interval = setInterval(() => {
    progress += 1.67; // 100 / 60 (6 seconds)
    progressWidth.value = `${progress}%`;
    if (progress >= 100) {
      progress = 0;
    }
  }, 100);

  onUnmounted(() => clearInterval(interval));
};

// 3D tilt effect for card
const handleCardTilt = (e: MouseEvent) => {
  if (!contentCard.value) return;

  const card = contentCard.value;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = (y - centerY) / 10;
  const rotateY = (centerX - x) / 10;

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
};

const resetCardTilt = () => {
  if (!contentCard.value) return;
  contentCard.value.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
};

// Custom pagination bullet renderer
const renderCustomBullet = (index: number, className: string) => {
  return `<span class="${className} hero-slider__bullet">
    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none" />
    </svg>
  </span>`;
};
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

/* ============================================
   REVOLUTIONARY HERO SLIDER - BEM
   ============================================ */

.hero-slider {
  position: relative;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  background: $color-linen;

  &__swiper {
    width: 100%;
    height: 650px;

    @include up(md) {
      height: 750px;
    }

    @include up(lg) {
      height: 800px;
    }
  }

  /* ==========================================
     SLIDES - Different Layouts
     ========================================== */

  &__slide {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    @include up(md) {
      flex-direction: row;
    }
  }

  /* Mobile background for diagonal slides */
  &__mobile-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    filter: brightness(0.6);
    z-index: 0;

    @include up(md) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
    }
  }

  /* ==========================================
     SLIDE 1: DIAGONAL SPLIT LEFT
     ========================================== */

  &__slide--diagonal-left {
    display: flex;
    flex-direction: column;
    background: $color-linen;

    @include up(md) {
      flex-direction: row;
      background: $color-linen;
    }
  }

  &__slide--diagonal-right {
    display: flex;
    flex-direction: column;
    background: $color-linen;

    @include up(md) {
      flex-direction: row;
      background: $color-linen;
    }
  }

  &__image-container {
    position: relative;
    overflow: hidden;
    z-index: 0;

    // Mobile: hidden, using mobile-bg instead
    display: none !important;

    @include up(md) {
      display: flex !important;
      position: relative;
      flex: 1;
      width: 100%;
      height: 100%;
      min-height: 100%;
      align-items: stretch;
      visibility: visible !important;
      opacity: 1 !important;
    }

    &--diagonal-left {
      @include up(md) {
        clip-path: polygon(0 0, 100% 0, 75% 100%, 0% 100%);
        order: 1;
      }

      @include up(lg) {
        clip-path: polygon(0 0, 100% 0, 70% 100%, 0% 100%);
      }
    }

    &--diagonal-right {
      @include up(md) {
        clip-path: polygon(25% 0, 100% 0, 100% 100%, 0% 100%);
        order: 2;
        z-index: 1;
        position: relative;
      }

      @include up(lg) {
        clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%);
      }
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    min-height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: transform 8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    display: block;
    position: relative;
    flex: 1;
    background-color: #f5f5f0; // Fallback color

    @include up(md) {
      width: 100% !important;
      height: 100% !important;
      min-height: 100% !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      background-size: cover !important;
      background-position: center !important;
      background-repeat: no-repeat !important;
    }

    .swiper-slide-active & {
      transform: scale(1.1);
    }

    &--parallax {
      transform: scale(1.2);

      .swiper-slide-active & {
        transform: scale(1.1);
      }
    }

    &--full {
      position: absolute;
      top: 0;
      left: 0;
      filter: brightness(0.7);
    }
  }

  &__content-zone {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 2.5rem 1.25rem 2rem;
    z-index: 2;
    min-height: 100%;

    // Mobile: full width with better spacing
    width: 100%;

    @media (max-width: 767px) {
      padding: 2.5rem 1.25rem 2rem;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    @include up(md) {
      padding: 4rem 2.5rem 4rem 3rem;
      width: auto;
      flex-direction: row;
      justify-content: flex-start;
    }

    &--right {
      @include up(md) {
        flex: 1;
        order: 2;
        padding-left: 3rem;
        padding-right: 4rem;
      }

      @include up(lg) {
        padding-right: 5rem;
      }
    }

    &--left {
      background: transparent;

      @include up(md) {
        flex: 1;
        order: 1;
        background: transparent;
      }
    }
  }

  /* ==========================================
     ANIMATED SVG ELEMENTS
     ========================================== */

  &__thread-path {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0.6;

    // Hidden on mobile for performance
    display: none;

    @include up(md) {
      display: block;
    }

    path {
      transition: stroke-dashoffset 3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  &__embroidery-flower {
    position: absolute;
    top: 10%;
    left: 10%;
    width: 150px;
    height: 150px;
    opacity: 0;
    animation: fadeInFloat 1.5s ease-out 0.5s forwards;

    // Hidden on mobile
    display: none;

    @include up(md) {
      display: block;
      width: 200px;
      height: 200px;
    }
  }

  &__petal {
    animation: petalPulse 3s ease-in-out infinite;

    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
    &:nth-child(4) {
      animation-delay: 0.6s;
    }
  }

  &__flower-stitch {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: drawStitch 2s ease-out 1s forwards;
  }

  &__needle-path {
    position: absolute;
    bottom: 5%;
    right: 5%;
    width: 400px;
    height: 400px;
    pointer-events: none;

    // Hidden on mobile
    display: none;

    @include up(md) {
      display: block;
    }

    path {
      animation: dashMove 4s linear infinite;
    }
  }

  &__blob {
    position: absolute;
    width: 200px;
    height: 200px;
    pointer-events: none;

    // Hidden on mobile
    display: none;

    @include up(md) {
      display: block;
    }

    &--1 {
      bottom: 10%;
      right: 10%;

      @include up(md) {
        width: 300px;
        height: 300px;
      }
    }
  }

  /* ==========================================
     CONTENT STYLES
     ========================================== */

  &__content {
    position: relative;
    z-index: 15;
    opacity: 0;
    animation: slideUpFadeIn 1s ease-out 0.3s forwards;
    width: 100%;
    padding: 1.5rem 1rem;
    text-align: center;

    @include up(md) {
      padding: 0;
      text-align: left;
    }

    &--style-1,
    &--style-2 {
      max-width: 100%;

      @include up(md) {
        max-width: 600px;
      }

      @include up(lg) {
        max-width: 700px;
      }
    }

    &--align-right {
      @include up(md) {
        margin-left: auto;
        margin-right: 0;
        text-align: right;

        .hero-slider__cta {
          margin-left: auto;
          margin-right: 0;
        }
      }
    }

    &--style-3 {
      text-align: center;
    }

    &--style-4 {
      text-align: center;
    }
  }

  &__label {
    display: inline-block;
    font-family: $font-body;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: $brand-ink;
    background: $brand;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    margin-bottom: 1.5rem;

    // Mobile: Hide badge
    @media (max-width: 767px) {
      display: none;
    }

    @include up(md) {
      font-size: 0.875rem;
      box-shadow: none;
    }
  }

  &__vertical-text {
    position: absolute;
    left: -80px;
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
    font-family: $font-heading;
    font-size: 3rem;
    font-weight: 700;
    color: rgba($brand, 0.15);
    letter-spacing: 0.1em;
    white-space: nowrap;

    // Hidden on mobile
    display: none;

    @include up(md) {
      display: block;
      font-size: 4rem;
      left: -100px;
    }
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: $font-body;
    font-size: 0.875rem;
    font-weight: 500;
    color: $brand-ink;
    background: rgba($brand, 0.2);
    border: 2px solid $brand;
    padding: 0.5rem 1.25rem;
    border-radius: 25px;
    margin-bottom: 1.5rem;

    &::before {
      content: "✦";
      color: $brand;
    }
  }

  /* ==========================================
     TYPOGRAPHY
     ========================================== */

  &__title {
    font-family: $font-heading;
    font-weight: 700;
    line-height: 1.1;
    margin: 0 0 1rem;
    color: $brand-ink;
    word-wrap: break-word;
    overflow-wrap: break-word;

    // Mobile: Font specifications
    @media (max-width: 767px) {
      font-family: "Outfit", sans-serif;
      font-weight: 300;
      color: rgb(255, 255, 255);
      font-size: 24px;
      line-height: 27px;
      text-shadow: none;
    }

    @include up(md) {
      margin: 0 0 1.5rem;
      text-shadow: none;
      word-wrap: normal;
      overflow-wrap: normal;
    }

    &--large {
      // Mobile: Override with specified font size
      @media (max-width: 767px) {
        font-size: 24px;
        line-height: 27px;
      }

      @include up(sm) {
        font-size: 2.5rem;
      }

      @include up(md) {
        font-size: clamp(2.5rem, 4vw, 4rem);
      }

      @include up(lg) {
        font-size: clamp(3.5rem, 5vw, 5rem);
      }
    }

    &--creative {
      font-size: 1.75rem;

      @include up(sm) {
        font-size: 2rem;
      }

      @include up(md) {
        font-size: 3.5rem;
      }
    }

    &--embroidered {
      font-size: 1.75rem;
      text-shadow:
        2px 2px 0 rgba($brand, 0.3),
        4px 4px 0 rgba($brand, 0.2);

      @include up(sm) {
        font-size: 2rem;
      }

      @include up(md) {
        font-size: 3rem;
      }
    }

    &--bold {
      font-size: 2rem;
      color: $color-white;
      text-shadow: 2px 2px 20px rgba($color-forest, 0.8);

      @include up(sm) {
        font-size: 2.5rem;
      }

      @include up(md) {
        font-size: 4rem;
      }
    }
  }

  &__title-word {
    display: block;
    animation: wordSlideIn 0.8s ease-out backwards;

    &:nth-child(1) {
      animation-delay: 0.5s;
    }
    &:nth-child(2) {
      animation-delay: 0.7s;
    }

    &--accent {
      color: $brand;
      position: relative;

      // Mobile: Make accent text white
      @media (max-width: 767px) {
        color: rgb(255, 255, 255);
        text-shadow: none;
      }

      &::after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, $brand 0%, $brand-accent-1 100%);
        border-radius: 2px;

        // Mobile: Hide underline
        @media (max-width: 767px) {
          display: none;
        }
      }
    }
  }

  &__title-line {
    display: block;

    &--outlined {
      color: transparent;
      -webkit-text-stroke: 1px $brand-ink;
      text-stroke: 1px $brand-ink;

      @include up(md) {
        -webkit-text-stroke: 2px $brand-ink;
        text-stroke: 2px $brand-ink;
      }
    }
  }

  &__title-highlight {
    color: $brand;
    position: relative;
    display: inline-block;

    &::before {
      content: "";
      position: absolute;
      bottom: 5px;
      left: -5px;
      right: -5px;
      height: 15px;
      background: rgba($brand, 0.3);
      z-index: -1;
      transform: skewY(-2deg);
    }
  }

  &__subtitle {
    font-family: $font-body;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: $text-secondary;
    margin: 0 0 1.5rem;

    // Mobile: Font specifications
    @media (max-width: 767px) {
      font-family: "Outfit", sans-serif;
      font-weight: 300;
      color: rgb(255, 255, 255);
      font-size: 16px;
      line-height: 19px;
      text-shadow: none;
    }

    @include up(sm) {
      font-size: 1rem;
    }

    @include up(md) {
      font-size: 1.25rem;
      margin: 0 0 2rem;
      color: $text-secondary;
      text-shadow: none;
      font-weight: 400;
    }

    &--minimal {
      font-size: 0.875rem;
      font-style: italic;

      @include up(md) {
        font-size: 0.9375rem;
      }
    }

    &--large {
      font-size: 1rem;
      color: rgba($color-white, 0.95);
      text-shadow: 1px 1px 10px rgba($color-forest, 0.6);

      @include up(sm) {
        font-size: 1.125rem;
      }

      @include up(md) {
        font-size: 1.5rem;
      }
    }
  }

  &__stitch-decoration {
    width: 100px;
    height: 4px;
    margin: 1rem auto 1.5rem;
    opacity: 0;
    animation: fadeIn 1s ease-out 1s forwards;
    display: block;

    // Mobile: Hide divider
    @media (max-width: 767px) {
      display: none;
    }

    @include up(md) {
      margin: 1.5rem 0;
      opacity: 1;
    }
  }

  &__stitch-line {
    // Mobile: Make line darker and more visible
    @media (max-width: 767px) {
      stroke: #2d5016 !important;
      stroke-width: 2.5px !important;
      stroke-opacity: 0.8 !important;
    }
  }

  /* ==========================================
     CTA BUTTONS
     ========================================== */

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: $font-body;
    font-size: 0.9375rem;
    font-weight: 600;
    text-decoration: none;
    border-radius: 50px;
    padding: 0.875rem 1.75rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    margin-top: 0.5rem;
    width: auto;

    // Mobile: Better positioning and sizing
    @media (max-width: 767px) {
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      padding: 0.75rem 1.5rem;
      font-size: 0.875rem;
      display: inline-flex;
      justify-content: center;
    }

    @include up(sm) {
      gap: 0.75rem;
      font-size: 1rem;
      padding: 1rem 2rem;
      margin-top: 0.5rem;
    }

    @include up(md) {
      font-size: 1.0625rem;
      padding: 1.125rem 2.5rem;
      margin-top: 0;
    }

    &--primary {
      background: $brand;
      color: $brand-ink;
      border: 2px solid $brand;
      box-shadow: 0 4px 20px rgba($brand, 0.3);

      &:hover {
        background: $brand-hover;
        transform: translateY(-3px);
        box-shadow: 0 8px 30px rgba($brand, 0.5);
      }
    }

    &--outlined {
      background: transparent;
      color: $brand-ink;
      border: 2px solid $brand-ink;

      &:hover {
        background: $brand-ink;
        color: $color-white;
        transform: scale(1.05);
      }
    }

    &--gradient {
      background: linear-gradient(135deg, $brand 0%, $brand-accent-1 100%);
      color: $brand-ink;
      border: none;
      box-shadow: 0 6px 25px rgba($brand, 0.4);

      &:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 10px 35px rgba($brand, 0.6);
      }
    }

    &--sale {
      background: $brand-ink;
      color: $color-white;
      border: 2px solid $brand-ink;
      box-shadow: 0 6px 25px rgba($brand-ink, 0.4);

      &:hover {
        background: $brand;
        color: $brand-ink;
        border-color: $brand;
        transform: translateY(-3px);
      }
    }

    &--ghost {
      background: rgba($color-white, 0.15);
      color: $color-white;
      border: 2px solid rgba($color-white, 0.5);
      backdrop-filter: blur(10px);

      &:hover {
        background: rgba($color-white, 0.25);
        border-color: $color-white;
      }
    }
  }

  &__cta-arrow,
  &__cta-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;

    .hero-slider__cta:hover & {
      transform: translateX(4px);
    }
  }

  &__cta-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  /* ==========================================
     SLIDE 3: VERTICAL SPLIT WITH CARD
     ========================================== */

  &__slide--vertical-split {
    background: $color-linen;
  }

  &__split-container {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;

    @include up(md) {
      flex-direction: row;
    }
  }

  &__split-side {
    flex: 1;
    position: relative;

    &--image {
      min-height: 200px;

      @include up(sm) {
        min-height: 250px;
      }

      @include up(md) {
        min-height: auto;
      }
    }

    &--content {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem 1rem;

      @include up(sm) {
        padding: 2rem 1rem;
      }

      @include up(md) {
        padding: 3rem 2rem;
      }
    }
  }

  &__content-card {
    position: relative;
    background: $color-white;
    border-radius: 15px;
    padding: 2rem 1.5rem;
    max-width: 500px;
    width: 100%;
    box-shadow:
      0 20px 60px rgba($color-forest, 0.15),
      0 0 0 1px rgba($brand, 0.1);
    transition: transform 0.3s ease;
    transform-style: preserve-3d;

    @include up(sm) {
      border-radius: 20px;
      padding: 2.5rem 2rem;
    }

    @include up(md) {
      padding: 3rem 2.5rem;
    }
  }

  &__corner-stitch {
    position: absolute;
    width: 40px;
    height: 40px;

    &--tl {
      top: 10px;
      left: 10px;
    }
    &--tr {
      top: 10px;
      right: 10px;
    }
    &--bl {
      bottom: 10px;
      left: 10px;
    }
    &--br {
      bottom: 10px;
      right: 10px;
    }
  }

  &__features {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 2rem 0;
  }

  &__feature {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: $font-body;
    font-size: 0.9375rem;
    color: $text-primary;

    svg {
      width: 20px;
      height: 20px;
      color: $brand;
      flex-shrink: 0;
    }
  }

  /* ==========================================
     SLIDE 4: ASYMMETRIC WITH FLOATING CARD
     ========================================== */

  &__slide--asymmetric {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 1rem;

    @include up(sm) {
      padding: 2rem 1rem;
    }

    @include up(md) {
      padding: 3rem 2rem;
    }
  }

  &__floating-card {
    position: relative;
    z-index: 10;
    max-width: 550px;
    width: 100%;
  }

  &__card-inner {
    position: relative;
    background: rgba($color-white, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 2rem 1.5rem;
    box-shadow:
      0 30px 80px rgba($color-forest, 0.25),
      0 0 0 1px rgba($color-white, 0.5);

    @include up(sm) {
      border-radius: 25px;
      padding: 2.5rem 2rem;
    }

    @include up(md) {
      padding: 3.5rem 3rem;
    }
  }

  &__thread-border {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &__sale-badge {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, $brand 0%, $brand-accent-1 100%);
    border-radius: 50%;
    margin: 0 auto 1.5rem;
    box-shadow: 0 8px 25px rgba($brand, 0.4);

    @include up(sm) {
      width: 80px;
      height: 80px;
    }

    @include up(md) {
      width: 100px;
      height: 100px;
    }
  }

  &__sale-percent {
    font-family: $font-heading;
    font-size: 1.75rem;
    font-weight: 700;
    color: $brand-ink;
    line-height: 1;

    @include up(sm) {
      font-size: 2rem;
    }

    @include up(md) {
      font-size: 2.5rem;
    }
  }

  &__sale-text {
    font-family: $font-body;
    font-size: 0.75rem;
    font-weight: 600;
    color: $brand-ink;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__float-element {
    position: absolute;
    pointer-events: none;
    opacity: 0;
    animation: floatIn 1.5s ease-out forwards;

    // Smaller and repositioned on mobile
    &--1 {
      top: 5%;
      left: 5%;
      width: 40px;
      height: 40px;
      animation-delay: 0.5s;

      @include up(sm) {
        width: 60px;
        height: 60px;
      }

      @include up(md) {
        top: 10%;
        left: 10%;
        width: 80px;
        height: 80px;
      }
    }

    &--2 {
      top: 60%;
      right: 5%;
      width: 50px;
      height: 50px;
      animation-delay: 0.8s;

      @include up(sm) {
        width: 80px;
        height: 80px;
      }

      @include up(md) {
        right: 15%;
        width: 100px;
        height: 100px;
      }
    }

    &--3 {
      bottom: 10%;
      left: 10%;
      width: 35px;
      height: 35px;
      animation-delay: 1.1s;

      @include up(sm) {
        width: 50px;
        height: 50px;
      }

      @include up(md) {
        bottom: 15%;
        left: 20%;
        width: 70px;
        height: 70px;
      }
    }
  }

  /* ==========================================
     NAVIGATION
     ========================================== */

  &__nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 5;
    width: 50px;
    height: 50px;
    background: rgba($color-white, 0.9);
    backdrop-filter: blur(10px);
    border: 2px solid $brand;
    border-radius: 50%;
    display: none;
    align-items: center;
    justify-content: center;
    color: $brand-ink;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    @include up(md) {
      display: flex;
    }

    @include up(lg) {
      width: 60px;
      height: 60px;
    }

    svg {
      width: 24px;
      height: 24px;
    }

    &:hover {
      background: $brand;
      color: $color-white;
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 8px 25px rgba($brand, 0.4);
    }

    &--prev {
      left: 1rem;

      @include up(md) {
        left: 2rem;
      }
    }

    &--next {
      right: 1rem;

      @include up(md) {
        right: 2rem;
      }
    }
  }

  /* ==========================================
     PROGRESS INDICATOR
     ========================================== */

  &__progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba($brand, 0.2);
    z-index: 20;
  }

  &__progress-bar {
    height: 100%;
    background: linear-gradient(90deg, $brand 0%, $brand-accent-1 100%);
    transition: width 0.1s linear;
  }
}

/* ==========================================
   CUSTOM PAGINATION
   ========================================== */

:deep(.swiper-pagination) {
  bottom: 1.5rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  z-index: 20;

  @include up(md) {
    bottom: 2rem !important;
  }
}

:deep(.hero-slider__bullet) {
  width: 16px;
  height: 16px;
  color: rgba($color-white, 0.6);
  opacity: 1;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    width: 100%;
    height: 100%;
  }

  &:hover {
    color: rgba($color-white, 0.9);
    transform: scale(1.2);
  }

  &.swiper-pagination-bullet-active {
    color: $brand;
    transform: scale(1.3);

    svg circle {
      fill: currentColor;
    }
  }
}

/* ==========================================
   ANIMATIONS
   ========================================== */

@keyframes slideUpFadeIn {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes wordSlideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInFloat {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes petalPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes drawStitch {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes dashMove {
  to {
    stroke-dashoffset: -100;
  }
}

@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(30px) rotate(0deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(360deg);
  }
}

/* ==========================================
   ACCESSIBILITY
   ========================================== */

@media (prefers-reduced-motion: reduce) {
  .hero-slider {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
</style>
