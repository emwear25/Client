<template>
  <div class="about-page">
    <AboutUsHeroBanner />
    <AboutUsOurStory />
    <AboutUsWhatMakesUsDifferent />
    <AboutUsMeetTheMaker />
    <AboutUsTestimonials />
    <AboutUsCallToAction />
  </div>
</template>

<script setup lang="ts">
// Set page meta
useHead({
  title: "За нас - emWear | Персонализирани подаръци",
  meta: [
    {
      name: "description",
      content:
        "Научете повече за emWear - създаваме персонализирани подаръци с внимание към всеки детайл. Произведено в България с много грижа и любов.",
    },
    {
      property: "og:title",
      content: "За нас - emWear | Персонализирани подаръци",
    },
    {
      property: "og:description",
      content:
        "Научете повече за emWear - създаваме персонализирани подаръци с внимание към всеки детайл. Произведено в България с много грижа и любов.",
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
});
</script>

<style scoped lang="scss">
.about-page {
  // No additional styles needed - components handle their own spacing
}
</style>
