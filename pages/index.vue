<template>
  <div class="home-page">
    <HeroSlider />
    <PromoBanner />
    <CategoryPromos />
    <FeaturedProducts />
    <FeatureHighlights />
    <BannerSection />
    <Testimonials />
    <NewsletterSignup />
  </div>
</template>

<script setup lang="ts">
import { usePageSEO } from "~/composables/useSEO";

// Set homepage SEO
usePageSEO({
  title: "Магията на бродерията за твоето дете | emWear",
  description:
    "Превърнете всеки детски аксесоар в уникален спомен. Прецизна бродерия с име, любими герои и много любов. Вечни подаръци за малки герои от emWear.",
  image: "/emwear-front-page.png",
  type: "website",
});

// Organization and WebSite structured data is emitted globally in app.vue
useHead({
  link: [
    {
      rel: "preload",
      as: "image",
      href: "/img/banners/banner1.jpg",
      fetchpriority: "high",
    },
    {
      rel: "preload",
      as: "image",
      href: "/img/banners/banner2.jpg",
      fetchpriority: "high",
    },
    {
      rel: "preload",
      as: "image",
      href: "/img/banners/banner3.jpg",
      fetchpriority: "high",
    },
    {
      rel: "preload",
      as: "image",
      href: "/img/banners/banner4.jpg",
      fetchpriority: "high",
    },
  ],
});
</script>

<style lang="scss" scoped>
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
</style>
