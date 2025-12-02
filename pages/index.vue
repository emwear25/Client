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
// This is the main index page
</script>

<style lang="scss" scoped>
.home-page {
  margin: 0;
  padding: 0;

  > * {
    margin: 0;
  }
}
</style>
