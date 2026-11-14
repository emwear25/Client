<template>
  <div class="home-page">
    <HeroSlider />
    <PromoBanner />
    <CategoryPromos />
    <section class="home-intro">
      <div class="container home-intro__inner">
        <h1 class="home-intro__title">Персонализирани детски подаръци с бродирано име</h1>
        <p class="home-intro__text">
          В emWear бродираме името на детето върху
          <NuxtLink to="/category/kid-bathrobes">халати</NuxtLink>,
          <NuxtLink to="/category/kids-towels">хавлии с качулка</NuxtLink>,
          <NuxtLink to="/category/kids-bags">раници за детска градина</NuxtLink>,
          <NuxtLink to="/category/kids-blankets">муселинови одеяла</NuxtLink> и
          <NuxtLink to="/category/personalizirani-plusheni-igrachki">плюшени играчки</NuxtLink>.
          Всяко изделие се изработва индивидуално за 1–2 работни дни и пристига с Еконт или Спиди
          навсякъде в България.
        </p>
        <nav aria-label="Подаръци по повод">
          <ul class="home-intro__chips">
            <li v-for="page in LANDING_PAGES" :key="page.slug">
              <NuxtLink :to="`/podaratsi/${page.slug}`" class="home-intro__chip">{{ page.label }}</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </section>
    <FeaturedProducts />
    <FeatureHighlights />
    <BannerSection />
    <Testimonials />
    <NewsletterSignup />
  </div>
</template>

<script setup lang="ts">
import { usePageSEO } from "~/composables/useSEO";
import { LANDING_PAGES } from "~/utils/seoContent";

usePageSEO({
  title: "Персонализирани детски подаръци с бродирано име | emWear",
  description:
    "Детски халати, хавлии с качулка, раници и одеяла с бродирано име. Изработка за 1–2 работни дни, доставка в цяла България. Подарък, който остава за спомен.",
  image: "/emwear-front-page.png",
  type: "website",
  path: "/",
});

// Organization and WebSite structured data is emitted globally in app.vue.
// Preload only the LCP image (first hero slide, which is a CSS background
// and therefore invisible to the preload scanner). Below-the-fold promo
// banners must not compete for bandwidth with it.
useHead({
  link: [
    {
      rel: "preload",
      as: "image",
      href: "/img/slider/bags-kids-mobile.webp",
      type: "image/webp",
      media: "(max-width: 767px)",
      fetchpriority: "high",
    },
    {
      rel: "preload",
      as: "image",
      href: "/img/slider/bags-kids.webp",
      type: "image/webp",
      media: "(min-width: 768px)",
      fetchpriority: "high",
    },
  ],
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/colors" as *;

.home-page {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;

  > * {
    margin: 0;
    max-width: 100%;
  }
}

.home-intro {
  padding: 3rem 0 1rem;
  text-align: center;

  &__inner {
    max-width: 860px;
    margin: 0 auto;
  }

  &__title {
    font-family: "Outfit", sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.2;
    color: $brand-ink;
    margin: 0 0 1rem;

    @media (min-width: 768px) {
      font-size: 2.5rem;
    }
  }

  &__text {
    font-size: 1.05rem;
    line-height: 1.7;
    color: $text-primary;
    margin: 0 0 1.5rem;

    a {
      color: $brand-ink;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__chip {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 999px;
    background: $bg-card;
    border: 1px solid $border-base;
    color: $brand-ink;
    text-decoration: none;
    font-size: 0.95rem;

    &:hover {
      border-color: $brand;
    }
  }
}
</style>
