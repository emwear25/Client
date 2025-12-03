<template>
  <div class="home-page">
    <HeroSlider />
    <CategoryPromos />
    <FeatureHighlights />
    <BannerSection />
    <Testimonials />
    <NewsletterSignup />
  </div>
</template>

<script setup lang="ts">
// Preload critical banner images for better performance
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
